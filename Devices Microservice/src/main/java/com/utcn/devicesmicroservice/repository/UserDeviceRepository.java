package com.utcn.devicesmicroservice.repository;

import com.utcn.devicesmicroservice.model.UserDevice;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserDeviceRepository extends CrudRepository<UserDevice, Long> {
    Optional<List<UserDevice>> findByUserID(Long userID);

    Optional<UserDevice> findByDeviceID(Long deviceID);

    void deleteByUserID(Long userID);
}
