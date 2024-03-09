package com.utcn.monitoringcommunicationmicroservice.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Timestamp timestamp;
    private Long deviceID;
    private BigDecimal measurement;

    public Message() {}

    public Message(Long id, Timestamp timestamp, Long deviceID, BigDecimal measurement)
    {
        this.id = id;
        this.timestamp = timestamp;
        this.deviceID = deviceID;
        this.measurement = measurement;
    }

    public Message(Timestamp timestamp, Long deviceID, BigDecimal measurement)
    {
        this.timestamp = timestamp;
        this.deviceID = deviceID;
        this.measurement = measurement;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
        return "Message{" +
                "id=" + id +
                ", timestamp=" + timestamp +
                ", deviceID=" + deviceID +
                ", measurement=" + measurement +
                '}';
    }
}
