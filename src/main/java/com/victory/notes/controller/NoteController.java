package com.victory.notes.controller;

import com.victory.notes.entity.Note;
import com.victory.notes.entity.Role;
import com.victory.notes.entity.User;
import com.victory.notes.repos.NoteRepo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("notes")
public class NoteController {

    @Autowired
    private final NoteRepo noteRepo;

    public NoteController(NoteRepo noteRepo) {
        this.noteRepo = noteRepo;
    }


    @GetMapping
    public List<Note> getNotes(@AuthenticationPrincipal User user){
        if (user.getRole().contains(Role.ADMIN))
            return noteRepo.findAll(Sort.by(Sort.Direction.ASC,"checked","text"));
        else
            return noteRepo.findNoteByAuthor(user,Sort.by(Sort.Direction.ASC,"checked","text"));
    }

    @GetMapping("{id}")
    public Note getNote(@PathVariable("id") Note note){
        return note;
    }

    @PostMapping
    public Note addNote(@RequestBody Note note, @AuthenticationPrincipal User user){
        note.setAuthor(user);
        return noteRepo.save(note);
    }

    @PutMapping("{id}")
    public Note updateNote(@PathVariable("id") Note noteFromDb, @RequestBody Note note){
        BeanUtils.copyProperties(note,noteFromDb,"id","author");
        return noteRepo.save(noteFromDb);
    }

    @DeleteMapping("{id}")
    public void deleteNote(@PathVariable("id") Note note){
        noteRepo.delete(note);
    }

}
