package com.utcn.chatmicroservice.dto.builder;

import com.utcn.chatmicroservice.dto.MessageDTO;
import com.utcn.chatmicroservice.model.Message;

public class MessageBuilder {
    public MessageBuilder() {}

    public static MessageDTO messageToMessageDTO(Message message) {
        return new MessageDTO(message.getText(), message.getDate(), message.getSender(),
                message.getReceiver(), message.getSeen());
    }

    public static Message messageDTOtoMessage(MessageDTO messageDTO) {
        return new Message(messageDTO.getText(), messageDTO.getDate(), messageDTO.getSender(),
                messageDTO.getReceiver(), messageDTO.getSeen());
    }
}
