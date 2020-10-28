package com.victory.notes.repos;

import com.victory.notes.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface UserRepo extends JpaRepository<User,Long> {
    User findByUsername(String username);
}
