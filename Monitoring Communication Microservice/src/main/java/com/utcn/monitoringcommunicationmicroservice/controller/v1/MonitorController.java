package com.utcn.monitoringcommunicationmicroservice.controller.v1;

import com.utcn.monitoringcommunicationmicroservice.dto.MessageDTO;
import com.utcn.monitoringcommunicationmicroservice.service.MonitorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;

@RestController
@RequestMapping(value = "/consumer")
@CrossOrigin(value = "*")
public class MonitorController {
    private final MonitorService monitorService;

    public MonitorController(MonitorService monitorService) {
        this.monitorService = monitorService;
    }

    @GetMapping()
    public ResponseEntity<List<MessageDTO>> getMessages()
    {
        List<MessageDTO> messageDTOS = monitorService.findMessages();
        return new ResponseEntity<>(messageDTOS, HttpStatus.OK);
    }

    @GetMapping(path = "/{deviceID}")
    public ResponseEntity<List<MessageDTO>> getDeviceMessages(@PathVariable Long deviceID)
    {
        List<MessageDTO> messageDTOS = monitorService.findDeviceMessages(deviceID);
        return new ResponseEntity<>(messageDTOS, HttpStatus.OK);
    }

    @DeleteMapping(path = "/{timestamp}")
    public void deleteMessage(@PathVariable("timestamp") String formattedTimestamp)
    {
        Timestamp timestamp = Timestamp.valueOf(formattedTimestamp);
        monitorService.deleteMessage(timestamp);
    }
}
