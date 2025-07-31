package com.chat.app.repository;

import com.chat.app.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    User findByUsername(String username);
    User findByUserId(Long userId);
    User findTopByOrderByUserIdDesc(); // For getting the latest userId
} 