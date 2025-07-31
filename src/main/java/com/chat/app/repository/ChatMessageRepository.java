package com.chat.app.repository;

import com.chat.app.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findBySenderOrRecipientOrderByTimestampAsc(String sender, String recipient);
    List<ChatMessage> findBySenderOrRecipientOrderByTimestampDesc(String sender, String recipient);
    List<ChatMessage> findByRecipientOrderByTimestampAsc(String recipient);
    List<ChatMessage> findByRecipientOrderByTimestampDesc(String recipient);
    List<ChatMessage> findBySenderAndRecipientOrderByTimestampAsc(String sender, String recipient);
}
