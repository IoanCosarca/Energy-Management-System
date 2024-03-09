package com.utcn.chatmicroservice.controller.v1;

import com.utcn.chatmicroservice.dto.MessageDTO;
import com.utcn.chatmicroservice.model.TypingResponse;
import com.utcn.chatmicroservice.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/chat")
@CrossOrigin(value = "*")
public class ChatController {
    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/{sender}")
    public List<MessageDTO> getMessagesBySender(@PathVariable Long sender) {
        return chatService.findMessagesBySender(sender);
    }

    @MessageMapping("/chatSocket-message")
    @SendTo("/topic/messages")
    public MessageDTO handleChatMessage(MessageDTO message) {
        return chatService.createMessage(message);
    }

    @MessageMapping("/chatSocket-typing")
    @SendTo("/topic/typing")
    public TypingResponse handleTypingStatus(@Payload TypingResponse typingStatus) {
        return typingStatus;
    }

    @MessageMapping("/chatSocket-messageSeen")
    @SendTo("/topic/messageSeen")
    public MessageDTO handleSeenMessage(@Payload MessageDTO seenMessage) {
        return chatService.markMessageAsSeen(seenMessage);
    }
}
