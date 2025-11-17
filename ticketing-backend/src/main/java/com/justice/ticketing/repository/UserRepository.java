package com.justice.ticketing.repository;

import com.justice.ticketing.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByTelephone(String telephone);
    
    Boolean existsByEmail(String email);
    
    Boolean existsByTelephone(String telephone);
}
