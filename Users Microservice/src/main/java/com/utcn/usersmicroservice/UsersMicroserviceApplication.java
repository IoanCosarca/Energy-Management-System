package com.utcn.usersmicroservice;

import com.utcn.usersmicroservice.controller.v1.UserController;
import com.utcn.usersmicroservice.model.RegisterRequest;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

@SpringBootApplication
public class UsersMicroserviceApplication {
    public static void main(String[] args) {
        ApplicationContext ctx = SpringApplication.run(UsersMicroserviceApplication.class, args);

        UserController userController = (UserController) ctx.getBean("userController");

        RegisterRequest admin1 = new RegisterRequest("Ionut", "ionutcosarca1@gmail.com", "123456");
        RegisterRequest admin2 = new RegisterRequest("Catalin", "frafesteu@gmail.com", "123456");
        RegisterRequest admin3 = new RegisterRequest("John", "ionut@gmail", "123456");

        userController.saveAdmin(admin1);
        userController.saveAdmin(admin2);
        userController.saveAdmin(admin3);
    }
}
