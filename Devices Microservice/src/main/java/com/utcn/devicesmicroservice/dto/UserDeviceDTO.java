package com.utcn.devicesmicroservice.dto;

public class UserDeviceDTO {
    private Long deviceID;
    private Long userID;

    public UserDeviceDTO() {}

    public UserDeviceDTO(Long deviceID, Long userID)
    {
        this.deviceID = deviceID;
        this.userID = userID;
    }

    public Long getDeviceID() {
        return deviceID;
    }

    public void setDeviceID(Long deviceID) {
        this.deviceID = deviceID;
    }

    public Long getUserID() {
        return userID;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
    }
}
