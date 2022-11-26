package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleServiceImpl;
import ru.kata.spring.boot_security.demo.service.UserServiceImpl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;


@RequestMapping("/api")
@RestController
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminRestController {
    private final UserServiceImpl userService;
    private final RoleServiceImpl roleService;


    @Autowired
    public AdminRestController(UserServiceImpl userService, RoleServiceImpl roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/admin/users")
    public ResponseEntity <List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.allUser());
    }

    @GetMapping("/admin/roles")
    public ResponseEntity <List<Role>> getAllRoles() {
        return ResponseEntity.ok(roleService.getRoles());
    }


    @PostMapping(value = "/admin/add")
    public ResponseEntity <User> addUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.add(user));
    }

    @PostMapping( "/admin/edit/{id}")
    public User editUser(@RequestBody User user) {
        return userService.add(user);
    }

    @PostMapping(value = "/admin/delete/{id}")
    public void deleteUser(@PathVariable("id") Long id) {
        userService.deleteById(id);
    }

    @GetMapping(value = "/logout")
    public String logoutPage(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        return "redirect:/login?logout";
    }



}
