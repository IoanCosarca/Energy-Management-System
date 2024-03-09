package com.utcn.monitoringcommunicationmicroservice.dto;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class MessageDTO {
    private Timestamp timestamp;
    private Long deviceID;
    private BigDecimal measurement;

    public MessageDTO() {}

    public MessageDTO(Timestamp timestamp, Long deviceID, BigDecimal measurement)
    {
        this.timestamp = timestamp;
        this.deviceID = deviceID;
        this.measurement = measurement;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }

    public Long getDeviceID() {
        return deviceID;
    }

    public void setDeviceID(Long deviceID) {
        this.deviceID = deviceID;
    }

    public BigDecimal getMeasurement() {
        return measurement;
    }

    public void setMeasurement(BigDecimal measurement) {
        this.measurement = measurement;
    }

    @Override
    public String toString() {
        return "MessageDTO{" +
                "timestamp=" + timestamp +
                ", deviceID=" + deviceID +
                ", measurement=" + measurement +
                '}';
    }
}
