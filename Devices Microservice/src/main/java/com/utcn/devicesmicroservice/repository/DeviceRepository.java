package com.utcn.devicesmicroservice.repository;

import com.utcn.devicesmicroservice.model.Device;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeviceRepository extends CrudRepository<Device, Long> {
    Optional<Device> findByDescription(String description);
}
