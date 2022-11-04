package ru.kata.spring.boot_security.demo.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.service.UserService;

@Service
public class UserDetailsServ implements UserDetailsService {

    private final UserService userService;

    @Autowired
    public UserDetailsServ(UserService userService) {
        this.userService = userService;
    }

    @Transactional
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserDetails user = userService.getUser(username);
        if (user == null) {
            throw new UsernameNotFoundException(String.format("User '/%s' not found", username));
        }
        user.getAuthorities();
        return user;
    }

    ;
}

