package com.utcn.devicesmicroservice.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_device")
public class UserDevice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "device_id")
    private Long deviceID;
    @Column(name = "user_id")
    private Long userID;

    public UserDevice() {}

    public UserDevice(Long id, Long deviceID, Long userID)
    {
        this.id = id;
        this.deviceID = deviceID;
        this.userID = userID;
    }

    public UserDevice(Long deviceID, Long userID)
    {
        this.deviceID = deviceID;
        this.userID = userID;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
