package com.utcn.devicesmicroservice.dto.builder;

import com.utcn.devicesmicroservice.dto.DeviceDTO;
import com.utcn.devicesmicroservice.model.Device;

public class DeviceBuilder {
    public DeviceBuilder() {}

    public static Device deviceDTOtoDevice(DeviceDTO deviceDTO) {
        return new Device(deviceDTO.getDescription(), deviceDTO.getAddress(),
                deviceDTO.getMaxHourlyConsumption());
    }
}
