package com.utcn.chatmicroservice.repository;

import com.utcn.chatmicroservice.model.Message;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends CrudRepository<Message, Long> {
    Optional<List<Message>> findBySender(Long sender);

    @Query("SELECT m FROM Message m WHERE m.date BETWEEN :startDate AND :endDate")
    List<Message> findByDateRange(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
}
