package com.utcn.devicesmicroservice.dto.builder;

import com.utcn.devicesmicroservice.dto.UserDeviceDTO;
import com.utcn.devicesmicroservice.model.UserDevice;

public class UserDeviceBuilder {
    public UserDeviceBuilder() {}

    public static UserDevice userDeviceDTOtoUserDevice(UserDeviceDTO userDeviceDTO) {
        return new UserDevice(userDeviceDTO.getDeviceID(), userDeviceDTO.getUserID());
    }
}
