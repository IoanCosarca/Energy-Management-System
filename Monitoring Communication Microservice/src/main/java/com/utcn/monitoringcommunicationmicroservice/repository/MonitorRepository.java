package com.utcn.monitoringcommunicationmicroservice.repository;

import com.utcn.monitoringcommunicationmicroservice.model.Message;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.Optional;

@Repository
public interface MonitorRepository extends CrudRepository<Message, Long> {
    Optional<Message> findByTimestamp(Timestamp timestamp);

    void deleteByDeviceID(Long deviceID);
}
