package com.victory.notes.entity;

import javax.persistence.*;

@Entity
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String text;
    private boolean checked;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User author;



    public Note() {
    }

    public Note(String text, boolean checked, User user) {
        this.text = text;
        this.checked = checked;
        this.author = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public String getAuthorName(User author){
        return author != null ? author.getUsername() : "<none>";
    }

    public boolean isChecked() {
        return checked;
    }

    public void setChecked(boolean checked) {
        this.checked = checked;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Note note = (Note) o;

        if (checked != note.checked) return false;
        if (!id.equals(note.id)) return false;
        return text.equals(note.text);
    }

    @Override
    public int hashCode() {
        int result = id.hashCode();
        result = 31 * result + text.hashCode();
        result = 31 * result + (checked ? 1 : 0);
        return result;
    }

    @Override
    public String toString() {
        return "{" +
                "id=" + id +
                ", text='" + text + '\'' +
                ", checked=" + checked +
                '}';
    }
}
