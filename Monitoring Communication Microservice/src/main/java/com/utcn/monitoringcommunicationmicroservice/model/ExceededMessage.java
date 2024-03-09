package com.utcn.monitoringcommunicationmicroservice.model;

public class ExceededMessage {
    private String deviceDescription;
    private Long userID;

    public ExceededMessage() {}

    public ExceededMessage(String deviceDescription, Long userID)
    {
        this.deviceDescription = deviceDescription;
        this.userID = userID;
    }

    public String getDeviceDescription() {
        return deviceDescription;
    }

    public void setDeviceDescription(String deviceDescription) {
        this.deviceDescription = deviceDescription;
    }

    public Long getUserID() {
        return userID;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
    }
}
