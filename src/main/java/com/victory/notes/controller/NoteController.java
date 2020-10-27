package com.victory.notes.controller;

import com.victory.notes.entity.Note;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("notes")
public class NoteController {

    private int count = 3;

    private List<Note> notes = new ArrayList<Note>(){{
        add(new Note(1,"Что-то сделать",false));
        add(new Note(2,"Что-то уже сделано",true));
    }};


    @GetMapping
    public List<Note> getNotes(){
        return notes;
    }

}
