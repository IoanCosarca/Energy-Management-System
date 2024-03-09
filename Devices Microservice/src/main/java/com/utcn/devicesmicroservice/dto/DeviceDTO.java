package com.utcn.devicesmicroservice.dto;

public class DeviceDTO {
    private String description;
    private String address;
    private Integer maxHourlyConsumption;
    private Long userID;

    public DeviceDTO() {}

    public DeviceDTO(String description, String address, Integer maxHourlyConsumption, Long userID)
    {
        this.description = description;
        this.address = address;
        this.maxHourlyConsumption = maxHourlyConsumption;
        this.userID = userID;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Integer getMaxHourlyConsumption() {
        return maxHourlyConsumption;
    }

    public void setMaxHourlyConsumption(Integer maxHourlyConsumption) {
        this.maxHourlyConsumption = maxHourlyConsumption;
    }

    public Long getUserID() {
        return userID;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
    }
}
