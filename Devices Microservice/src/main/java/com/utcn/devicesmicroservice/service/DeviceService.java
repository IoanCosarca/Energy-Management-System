package com.utcn.devicesmicroservice.service;

import com.utcn.devicesmicroservice.dto.DeviceDTO;
import com.utcn.devicesmicroservice.model.IDResponse;

import java.util.List;

public interface DeviceService {
    List<DeviceDTO> findDevices();

    List<IDResponse> findIDs();

    List<IDResponse> findUserDevicesIDs(Long userID);

    List<DeviceDTO> findUserDevices(Long userID);

    DeviceDTO findDeviceByID(Long id);

    DeviceDTO createDevice(DeviceDTO newDevice);

    void updateDevice(String description, DeviceDTO newDetails);

    void deleteDevice(String description);

    void deleteMapToUser(Long userID);
}
