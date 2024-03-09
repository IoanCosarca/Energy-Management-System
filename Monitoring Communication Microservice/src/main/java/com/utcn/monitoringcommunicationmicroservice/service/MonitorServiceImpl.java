package com.utcn.monitoringcommunicationmicroservice.service;

import com.utcn.monitoringcommunicationmicroservice.dto.MessageDTO;
import com.utcn.monitoringcommunicationmicroservice.dto.builder.MessageBuilder;
import com.utcn.monitoringcommunicationmicroservice.model.Message;
import com.utcn.monitoringcommunicationmicroservice.repository.MonitorRepository;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class MonitorServiceImpl implements MonitorService {
    private final MonitorRepository monitorRepository;

    public MonitorServiceImpl(MonitorRepository monitorRepository) {
        this.monitorRepository = monitorRepository;
    }

    @Override
    public List<MessageDTO> findMessages()
    {
        List<MessageDTO> messages = new ArrayList<>();
        monitorRepository.findAll().iterator().forEachRemaining(m -> {
            MessageDTO message = MessageBuilder.messageToMessageDTO(m);
            messages.add(message);
        });
        return messages;
    }

    @Override
    public List<MessageDTO> findDeviceMessages(Long deviceID)
    {
        List<MessageDTO> messages = new ArrayList<>();
        monitorRepository.findAll().iterator().forEachRemaining(m -> {
            if (Objects.equals(m.getDeviceID(), deviceID)) {
                MessageDTO message = MessageBuilder.messageToMessageDTO(m);
                messages.add(message);
            }
        });
        return messages;
    }

    @Override
    public void deleteMessage(Timestamp timestamp)
    {
        Optional<Message> messageOptional = monitorRepository.findByTimestamp(timestamp);
        messageOptional.ifPresent(m -> monitorRepository.deleteById(m.getId()));
    }
}
