package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@RequestMapping("/admin")
@Controller
public class AdminController {
    private final UserService userService;
    private final RoleService roleService;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdminController(UserService userService, RoleService roleService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @RequestMapping(method = RequestMethod.GET)
    public String allUsers(ModelMap model) {
        model.addAttribute("users", this.userService.allUser());
        return "admin";
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(value = "/add")
    public String addPage(User user, ModelMap model) {
        model.addAttribute("roles", roleService.getRoles());
        return "add";
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public String addUser(User user) {
        userService.add(user);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return "redirect:/admin";
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @RequestMapping(value = "/edit/{id}", method = RequestMethod.GET)
    public String editPage(@PathVariable("id") Long id, Model model) {
        model.addAttribute("roles", roleService.getRoles());
        User user = userService.getById(id);
        model.addAttribute("user", user);
        return "/edit";
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @RequestMapping(value = "/edit/{id}", method = RequestMethod.POST)
    public String editUser(User user) {
        userService.add(user);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return "redirect:/admin";
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping(value = "/delete/{id}")
    public String deleteUser(@PathVariable("id") Long id) {
        userService.deleteById(id);
        return "redirect:/admin";
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public String logoutPage(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        return "redirect:/login?logout";
    }

}
