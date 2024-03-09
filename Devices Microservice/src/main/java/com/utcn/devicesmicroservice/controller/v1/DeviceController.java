package com.utcn.devicesmicroservice.controller.v1;

import com.utcn.devicesmicroservice.dto.DeviceDTO;
import com.utcn.devicesmicroservice.model.IDResponse;
import com.utcn.devicesmicroservice.service.DeviceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/device")
@CrossOrigin(value = "*")
public class DeviceController {
    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @GetMapping()
    public ResponseEntity<List<DeviceDTO>> getDevices()
    {
        List<DeviceDTO> deviceDTOS = deviceService.findDevices();
        return new ResponseEntity<>(deviceDTOS, HttpStatus.OK);
    }

    @GetMapping(path = "/ids")
    public ResponseEntity<List<IDResponse>> getIDs()
    {
        List<IDResponse> ids = deviceService.findIDs();
        return new ResponseEntity<>(ids, HttpStatus.OK);
    }

    @GetMapping(path = "/ids/{userID}")
    public ResponseEntity<List<IDResponse>> getUserDevicesIDs(@PathVariable Long userID)
    {
        List<IDResponse> ids = deviceService.findUserDevicesIDs(userID);
        return new ResponseEntity<>(ids, HttpStatus.OK);
    }

    @GetMapping(path = "/user/{userID}")
    public ResponseEntity<List<DeviceDTO>> getUserDevices(@PathVariable Long userID)
    {
        List<DeviceDTO> userDevices = deviceService.findUserDevices(userID);
        return new ResponseEntity<>(userDevices, HttpStatus.OK);
    }

    @GetMapping(path = "/id/{id}")
    public ResponseEntity<DeviceDTO> getDeviceByID(@PathVariable Long id)
    {
        DeviceDTO deviceDTO = deviceService.findDeviceByID(id);
        return new ResponseEntity<>(deviceDTO, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<DeviceDTO> saveDevice(@Valid @RequestBody DeviceDTO deviceDTO)
    {
        DeviceDTO device = deviceService.createDevice(deviceDTO);
        return new ResponseEntity<>(device, HttpStatus.CREATED);
    }

    @PutMapping(path = "/{description}")
    public void updateDevice(@PathVariable String description,
                             @RequestBody DeviceDTO newDetails) {
        deviceService.updateDevice(description, newDetails);
    }

    @DeleteMapping(path = "/description/{description}")
    public void deleteDevice(@PathVariable String description) {
        deviceService.deleteDevice(description);
    }

    @DeleteMapping(path = "/userID/{userID}")
    public void deleteMapToUser(@PathVariable Long userID) {
        deviceService.deleteMapToUser(userID);
    }
}
