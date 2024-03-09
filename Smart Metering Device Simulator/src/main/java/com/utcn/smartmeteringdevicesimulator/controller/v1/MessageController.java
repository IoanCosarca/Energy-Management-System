package com.utcn.smartmeteringdevicesimulator.controller.v1;

import com.utcn.smartmeteringdevicesimulator.publisher.RabbitMQJsonProducer;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/producer")
@CrossOrigin(value = "*")
public class MessageController {
    private final RabbitMQJsonProducer jsonProducer;

    public MessageController(RabbitMQJsonProducer jsonProducer) {
        this.jsonProducer = jsonProducer;
    }

    @GetMapping(path = "/{deviceID}")
    public void sendJsonMessage(@PathVariable Long deviceID) {
        jsonProducer.sendJsonMessage(deviceID);
    }
}
