package com.victory.notes.controller;

import com.victory.notes.entity.Role;
import com.victory.notes.entity.User;
import com.victory.notes.repos.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

@Controller
public class MainController {
    @Autowired
    private UserRepo userRepo;

    @GetMapping
    public String home(){
        return "index";
    }

    @GetMapping("/main")
    public String main(){
        return "main";
    }

    @GetMapping("/registration")
    public String registration(){
        return "registration";
    }

    @PostMapping("/registration")
    public String addUser(User user, Map<String,Object> model){
        User userFromDB = userRepo.findByUsername(user.getUsername());
        if (userFromDB != null){
            model.put("message","User exists");
            return "registration";
        }
        user.setActive(true);
        user.setRole(Collections.singleton(Role.ADMIN));
        userRepo.save(user);
        return "redirect:login";
    }
}
