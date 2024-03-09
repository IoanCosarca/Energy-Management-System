package com.utcn.monitoringcommunicationmicroservice.consumer;

import com.utcn.monitoringcommunicationmicroservice.dto.DeviceDTO;
import com.utcn.monitoringcommunicationmicroservice.dto.MessageDTO;
import com.utcn.monitoringcommunicationmicroservice.dto.builder.MessageBuilder;
import com.utcn.monitoringcommunicationmicroservice.model.ExceededMessage;
import com.utcn.monitoringcommunicationmicroservice.model.Message;
import com.utcn.monitoringcommunicationmicroservice.repository.MonitorRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.*;

@Service
public class RabbitMQConsumer {
    private final MonitorRepository monitorRepository;
    private final List<MessageDTO> messageList;
    private static final Logger LOGGER = LoggerFactory.getLogger(RabbitMQConsumer.class);
    private static final String url = "http://host.docker.internal:8081/device/{id}";
    private final WebClient webClient;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final Map<Long, Long> lastWarningTimestamps = new HashMap<>();

    public RabbitMQConsumer(MonitorRepository monitorRepository,
                            SimpMessagingTemplate simpMessagingTemplate)
    {
        this.monitorRepository = monitorRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.messageList = new ArrayList<>();
        this.webClient = WebClient.builder().build();
    }

    @Transactional
    @RabbitListener(queues = {"${rabbitmq.queue.name}"})
    public void consumeDeleteInfo(Long deviceID) {
        monitorRepository.deleteByDeviceID(deviceID);
    }

    @RabbitListener(queues = {"${rabbitmq.queue.json.name}"})
    public void consumeJsonMessage(MessageDTO message)
    {
        LOGGER.info(String.format("Received JSON message -> %s", message.toString()));
        messageList.add(message);
        List<MessageDTO> matchingMessages = messageList.stream()
                .filter(m -> m.getDeviceID().equals(message.getDeviceID()))
                .toList();

        if (matchingMessages.size() == 6)
        {
            // Calculate the sum of measurement values
            BigDecimal sum = BigDecimal.ZERO;
            for (MessageDTO m : matchingMessages) {
                sum = sum.add(m.getMeasurement());
            }

            LOGGER.info("Hourly energy calculated for device " + message.getDeviceID()
                    + ". Sum of measurements: " + sum);

            Timestamp adjustedTimestamp = adjustTimestamp(message.getTimestamp());
            DeviceDTO deviceDetails = webClient.get()
                    .uri(url, message.getDeviceID())
                    .retrieve()
                    .bodyToMono(DeviceDTO.class)
                    .block();
            assert deviceDetails != null;
            if (sum.compareTo(BigDecimal.valueOf(deviceDetails.getMaxHourlyConsumption())) > 0)
            {
                if (!hasRecentWarning(message.getDeviceID()))
                {
                    LOGGER.info("Value exceeded!");
                    sendMessage(new ExceededMessage(deviceDetails.getDescription(),
                            deviceDetails.getUserID()));

                    // Update the timestamp for the last warning
                    lastWarningTimestamps.put(message.getDeviceID(), System.currentTimeMillis());
                }
            }

            // Save calculated hourly consumption
            MessageDTO hourlyMessageDTO =
                    new MessageDTO(adjustedTimestamp, message.getDeviceID(), sum);
            Message hourlyMessage = MessageBuilder.messageDTOtoMessage(hourlyMessageDTO);
            monitorRepository.save(hourlyMessage);

            // Remove the processed messages from the messageList
            messageList.removeAll(matchingMessages);
        }
    }

    // Adjust the timestamp to the last received message's hour, but with minutes and seconds set to 00:00
    private Timestamp adjustTimestamp(Timestamp timestamp)
    {
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(timestamp.getTime());
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        return new Timestamp(calendar.getTimeInMillis());
    }

    private boolean hasRecentWarning(Long deviceID) {
        // Check if a warning has been sent in the last, let's say, 10 minutes
        return lastWarningTimestamps.containsKey(deviceID) &&
                (System.currentTimeMillis() - lastWarningTimestamps.get(deviceID) < 600000); // 10 minutes in milliseconds
    }

    public void sendMessage(ExceededMessage message) {
        simpMessagingTemplate.convertAndSend("/topic", message);
    }
}
