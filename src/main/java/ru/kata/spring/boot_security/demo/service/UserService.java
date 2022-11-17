package ru.kata.spring.boot_security.demo.service;

import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

@Service
public interface UserService {
    List<User> allUser();

    User add(User user);

    User getById(long id);
    void deleteById(long id);
    User getUser(String name);
    User getEmail(String email);
}
