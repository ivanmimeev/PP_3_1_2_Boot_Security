package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.kata.spring.boot_security.demo.service.UserService;

@RequestMapping("/")
@Controller
public class UserController {
    private UserService userService;

    @Autowired
    public void SetUserService (UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user")
    public String userPage() {
        return "users";
    }

    @GetMapping("/admin")
    public String adminPage() {
        return "users";
    }
}
