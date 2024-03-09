package com.utcn.monitoringcommunicationmicroservice.dto.builder;

import com.utcn.monitoringcommunicationmicroservice.dto.MessageDTO;
import com.utcn.monitoringcommunicationmicroservice.model.Message;

public class MessageBuilder {
    public MessageBuilder() {}

    public static MessageDTO messageToMessageDTO(Message message) {
        return new MessageDTO(message.getTimestamp(), message.getDeviceID(),
                message.getMeasurement());
    }

    public static Message messageDTOtoMessage(MessageDTO messageDTO) {
        return new Message(messageDTO.getTimestamp(), messageDTO.getDeviceID(),
                messageDTO.getMeasurement());
    }
}
