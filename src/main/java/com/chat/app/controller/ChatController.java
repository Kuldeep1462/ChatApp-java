package com.chat.app.controller;

import com.chat.app.model.ChatMessage;
import com.chat.app.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Controller;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.http.ResponseEntity;

import java.time.Instant;
import java.util.List;

@Controller
@RestController
@RequestMapping("/api/chat")
public class ChatController {
    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/sendMessage")
    public void sendMessage(ChatMessage message) {
        try {
            System.out.println("Received message: " + message.getSender() + " -> " + message.getRecipient() + ": " + message.getContent());
        
            message.setTimestamp(Instant.now());
        
            if (message.getRecipient() == null || "GLOBAL".equalsIgnoreCase(message.getRecipient())) {
                message.setRecipient("GLOBAL");
                ChatMessage savedMessage = chatMessageRepository.save(message);
                System.out.println("Saved global message with ID: " + savedMessage.getId());
                System.out.println("Sending to /topic/global");
                messagingTemplate.convertAndSend("/topic/global", savedMessage);
            } else {
                ChatMessage savedMessage = chatMessageRepository.save(message);
                System.out.println("Saved private message with ID: " + savedMessage.getId());
                System.out.println("Sending to /topic/messages");
                messagingTemplate.convertAndSend("/topic/messages", savedMessage);
            }
        } catch (Exception e) {
            System.err.println("Error sending message: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @GetMapping("/history/{user}")
    public ResponseEntity<?> getChatHistory(@PathVariable String user) {
        try {
            System.out.println("Getting chat history for user: " + user);
            List<ChatMessage> messages = chatMessageRepository.findBySenderOrRecipientOrderByTimestampAsc(user, user);
            System.out.println("Found " + messages.size() + " messages for user: " + user);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            System.err.println("Error getting chat history: " + e.getMessage());
            return ResponseEntity.ok(List.of()); // Return empty list instead of error
        }
    }

    @GetMapping("/history/global")
    public ResponseEntity<?> getGlobalChatHistory() {
        try {
            System.out.println("Getting global chat history");
            List<ChatMessage> messages = chatMessageRepository.findByRecipientOrderByTimestampAsc("GLOBAL");
            System.out.println("Found " + messages.size() + " global messages");
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            System.err.println("Error getting global chat history: " + e.getMessage());
            return ResponseEntity.ok(List.of()); // Return empty list instead of error
        }
    }

    @GetMapping("/contacts/{user}")
    public ResponseEntity<?> getUserContacts(@PathVariable String user) {
        try {
            System.out.println("Getting contacts for user: " + user);
            List<ChatMessage> messages = chatMessageRepository.findBySenderOrRecipientOrderByTimestampDesc(user, user);
            System.out.println("Found " + messages.size() + " messages for contacts");
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            System.err.println("Error getting user contacts: " + e.getMessage());
            return ResponseEntity.ok(List.of());
        }
    }
}
