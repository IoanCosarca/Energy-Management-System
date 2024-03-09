package com.utcn.smartmeteringdevicesimulator.publisher;

import com.utcn.smartmeteringdevicesimulator.dto.MessageDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
public class RabbitMQJsonProducer {
    @Value("${rabbitmq.exchange.name}")
    private String exchange;
    @Value("${rabbitmq.routing.json.key}")
    private String routingJsonKey;
    private static final Logger LOGGER = LoggerFactory.getLogger(RabbitMQJsonProducer.class);
    private final RabbitTemplate rabbitTemplate;

    public RabbitMQJsonProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendJsonMessage(Long deviceID)
    {
        try (InputStreamReader isr = new InputStreamReader(
                new ClassPathResource("sensor.csv").getInputStream());
             BufferedReader reader = new BufferedReader(isr))
        {
            String line = reader.readLine();
            int iterationCounter = 0;
            while (line != null)
            {
                try
                {
                    BigDecimal energyValue = new BigDecimal(line);

                    // Calculate timestamp based on current time and iteration
                    Timestamp timestamp = calculateTimestamp(iterationCounter);

                    MessageDTO message = new MessageDTO(timestamp, deviceID, energyValue);
                    LOGGER.info(String.format("Sending JSON message -> %s", message));
                    rabbitTemplate.convertAndSend(exchange, routingJsonKey, message);

                    // Increment the iteration counter
                    iterationCounter++;
                }
                catch (NumberFormatException e) {
                    System.err.println("Invalid number format: " + line);
                }
                Thread.sleep(5000);
                line = reader.readLine();
            }
        }
        catch (IOException e) {
            System.out.println(e.getMessage());
        }
        catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    // Calculate timestamp based on the current time and iteration
    private Timestamp calculateTimestamp(int iteration)
    {
        LocalDateTime currentDateTime = LocalDateTime.ofInstant(Instant.now(), ZoneId.of("GMT+2"));
        // Add 10 minutes for each iteration
        LocalDateTime adjustedDateTime = currentDateTime.plusMinutes(iteration * 10L);
        return Timestamp.valueOf(adjustedDateTime);
    }
}
