package com.utcn.devicesmicroservice.service;

import com.utcn.devicesmicroservice.controller.exception.ResourceNotFoundException;
import com.utcn.devicesmicroservice.dto.DeviceDTO;
import com.utcn.devicesmicroservice.dto.UserDeviceDTO;
import com.utcn.devicesmicroservice.dto.builder.DeviceBuilder;
import com.utcn.devicesmicroservice.dto.builder.UserDeviceBuilder;
import com.utcn.devicesmicroservice.model.Device;
import com.utcn.devicesmicroservice.model.IDResponse;
import com.utcn.devicesmicroservice.model.UserDevice;
import com.utcn.devicesmicroservice.repository.DeviceRepository;
import com.utcn.devicesmicroservice.repository.UserDeviceRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DeviceServiceImpl implements DeviceService {
    @Value("${rabbitmq.exchange.name}")
    private String exchange;
    @Value("${rabbitmq.routing.key}")
    private String routingKey;
    private final DeviceRepository deviceRepository;
    private final UserDeviceRepository userDeviceRepository;
    private final RabbitTemplate rabbitTemplate;

    public DeviceServiceImpl(DeviceRepository deviceRepository,
                             UserDeviceRepository userDeviceRepository,
                             RabbitTemplate rabbitTemplate)
    {
        this.deviceRepository = deviceRepository;
        this.userDeviceRepository = userDeviceRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    @Override
    public List<DeviceDTO> findDevices()
    {
        List<DeviceDTO> devices = new ArrayList<>();
        deviceRepository.findAll().iterator().forEachRemaining(d -> {
            Optional<UserDevice> userDeviceOptional =
                    userDeviceRepository.findByDeviceID(d.getId());
            userDeviceOptional.ifPresent(ud -> {
                DeviceDTO device = new DeviceDTO(d.getDescription(), d.getAddress(),
                        d.getMaxHourlyConsumption(), ud.getUserID());
                devices.add(device);
            });
        });
        return devices;
    }

    @Override
    public List<IDResponse> findIDs()
    {
        List<IDResponse> ids = new ArrayList<>();
        deviceRepository.findAll().iterator().forEachRemaining(d -> {
            IDResponse response = new IDResponse(d.getId());
            ids.add(response);
        });
        return ids;
    }

    @Override
    public List<IDResponse> findUserDevicesIDs(Long userID)
    {
        List<IDResponse> ids = new ArrayList<>();
        Optional<List<UserDevice>> optionalUserDevices = userDeviceRepository.findByUserID(userID);
        optionalUserDevices.ifPresent(userDevices -> userDevices.iterator().forEachRemaining(ud -> {
            IDResponse response = new IDResponse(ud.getDeviceID());
            ids.add(response);
        }));
        return ids;
    }

    @Override
    public List<DeviceDTO> findUserDevices(Long userID)
    {
        List<DeviceDTO> devices = new ArrayList<>();
        Optional<List<UserDevice>> optionalUserDevices = userDeviceRepository.findByUserID(userID);
        optionalUserDevices.ifPresent(userDevices -> userDevices.iterator().forEachRemaining(ud -> {
            Optional<Device> deviceOptional = deviceRepository.findById(ud.getDeviceID());
            deviceOptional.ifPresent(d -> {
                DeviceDTO device = new DeviceDTO(d.getDescription(), d.getAddress(),
                        d.getMaxHourlyConsumption(), ud.getUserID());
                devices.add(device);
            });
        }));
        return devices;
    }

    @Override
    public DeviceDTO findDeviceByID(Long id)
    {
        Optional<Device> deviecOptional = deviceRepository.findById(id);
        final DeviceDTO[] foundDevice = { new DeviceDTO() };
        deviecOptional.ifPresentOrElse(
                d -> {
                    Optional<UserDevice> userDeviceOptional =
                            userDeviceRepository.findByDeviceID(d.getId());
                    userDeviceOptional.ifPresent(ud -> foundDevice[0] =
                            new DeviceDTO(d.getDescription(), d.getAddress(),
                            d.getMaxHourlyConsumption(), ud.getUserID()));
                },
                () -> {
                    throw new ResourceNotFoundException("Device with id: " + id);
                }
        );
        return foundDevice[0];
    }

    @Override
    public DeviceDTO createDevice(DeviceDTO deviceDTO)
    {
        Device device = DeviceBuilder.deviceDTOtoDevice(deviceDTO);
        Device result = deviceRepository.save(device);
        UserDeviceDTO userDeviceDTO = new UserDeviceDTO(result.getId(), deviceDTO.getUserID());
        userDeviceRepository.save(UserDeviceBuilder.userDeviceDTOtoUserDevice(userDeviceDTO));
        return deviceDTO;
    }

    @Override
    public void updateDevice(String description, DeviceDTO newDetails)
    {
        Optional<Device> deviceOptional = deviceRepository.findByDescription(description);
        if (deviceOptional.isPresent())
        {
            Device databaseDevice = deviceOptional.get();
            Device device = constructDevice(newDetails, databaseDevice);
            Optional<UserDevice> userDeviceOptional =
                    userDeviceRepository.findByDeviceID(device.getId());
            userDeviceOptional.ifPresent(userDevice -> {
                if (!Objects.equals(userDevice.getUserID(), newDetails.getUserID())) {
                    userDevice.setUserID(newDetails.getUserID());
                }
                userDeviceRepository.save(userDevice);
            });
            deviceRepository.save(device);
        }
    }

    private static Device constructDevice(DeviceDTO newDetails, Device device)
    {
        if (!Objects.equals(device.getDescription(), newDetails.getDescription())
                && !Objects.equals(newDetails.getDescription(), "")) {
            device.setDescription(newDetails.getDescription());
        }
        if (!Objects.equals(device.getAddress(), newDetails.getAddress())
                && !Objects.equals(newDetails.getAddress(), "")) {
            device.setAddress(newDetails.getAddress());
        }
        if (!Objects.equals(device.getMaxHourlyConsumption(), newDetails.getMaxHourlyConsumption())
                && newDetails.getMaxHourlyConsumption() != 0) {
            device.setMaxHourlyConsumption(newDetails.getMaxHourlyConsumption());
        }
        return device;
    }

    @Override
    public void deleteDevice(String description)
    {
        Optional<Device> deviceOptional = deviceRepository.findByDescription(description);
        deviceOptional.ifPresent(device -> {
            Optional<UserDevice> userDeviceOptional =
                    userDeviceRepository.findByDeviceID(device.getId());
            userDeviceOptional.ifPresent(userDevice ->
                    userDeviceRepository.deleteById(userDevice.getId()));
            rabbitTemplate.convertAndSend(exchange, routingKey, device.getId());
            deviceRepository.deleteById(device.getId());
        });
    }

    @Override
    public void deleteMapToUser(Long userID) {
        userDeviceRepository.deleteByUserID(userID);
    }
}
