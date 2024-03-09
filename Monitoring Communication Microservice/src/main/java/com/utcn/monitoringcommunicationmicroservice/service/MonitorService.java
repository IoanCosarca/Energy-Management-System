package com.utcn.monitoringcommunicationmicroservice.service;

import com.utcn.monitoringcommunicationmicroservice.dto.MessageDTO;

import java.sql.Timestamp;
import java.util.List;

public interface MonitorService {
    List<MessageDTO> findMessages();

    List<MessageDTO> findDeviceMessages(Long deviceID);

    void deleteMessage(Timestamp timestamp);
}
