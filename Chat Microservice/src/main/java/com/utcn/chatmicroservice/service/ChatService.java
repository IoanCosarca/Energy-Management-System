package com.utcn.chatmicroservice.service;

import com.utcn.chatmicroservice.dto.MessageDTO;

import java.util.List;

public interface ChatService {
    List<MessageDTO> findMessagesBySender(Long sender);

    MessageDTO createMessage(MessageDTO messageDTO);

    MessageDTO markMessageAsSeen(MessageDTO seenMessage);
}
