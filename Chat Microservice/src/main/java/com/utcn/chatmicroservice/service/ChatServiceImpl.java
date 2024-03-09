package com.utcn.chatmicroservice.service;

import com.utcn.chatmicroservice.dto.MessageDTO;
import com.utcn.chatmicroservice.dto.builder.MessageBuilder;
import com.utcn.chatmicroservice.model.Message;
import com.utcn.chatmicroservice.repository.ChatRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ChatServiceImpl implements ChatService {
    private final ChatRepository chatRepository;

    public ChatServiceImpl(ChatRepository chatRepository) {
        this.chatRepository = chatRepository;
    }

    @Override
    public List<MessageDTO> findMessagesBySender(Long sender)
    {
        List<MessageDTO> messageDTOS = new ArrayList<>();
        Optional<List<Message>> listOptional = chatRepository.findBySender(sender);
        listOptional.ifPresent(messages -> messages.iterator().forEachRemaining(m -> {
            MessageDTO message = MessageBuilder.messageToMessageDTO(m);
            messageDTOS.add(message);
        }));
        return messageDTOS;
    }

    @Override
    public MessageDTO createMessage(MessageDTO messageDTO)
    {
        Message message = MessageBuilder.messageDTOtoMessage(messageDTO);
        chatRepository.save(message);
        return MessageBuilder.messageToMessageDTO(message);
    }

    @Override
    public MessageDTO markMessageAsSeen(MessageDTO seenMessage)
    {
        long timeWindowMillis = 1000; // adjust this value based on your needs
        Date startDate = new Date(seenMessage.getDate().getTime() - timeWindowMillis);
        Date endDate = new Date(seenMessage.getDate().getTime() + timeWindowMillis);

        List<Message> messages = chatRepository.findByDateRange(startDate, endDate);

        if (!messages.isEmpty())
        {
            Message message = messages.get(0);
            message.setSeen(seenMessage.getSeen());
            chatRepository.save(message);

            return MessageBuilder.messageToMessageDTO(message);
        }
        else
        {
            System.out.println("Message not found.");
            return new MessageDTO();
        }
    }
}
