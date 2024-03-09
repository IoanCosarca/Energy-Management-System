# Energy Management System Application
## Group 30643, Coșarcă Ioan-Cristian

## Endpoints

### GET
Users Microservice
- "/all" - returns a list of users
- "/ids" - returns a list containing just the ids of the database users
- "/id/{id}" - returns a user by the specified id
- "/email/{email}" - returns a user by the specified email

Devices Microservice
- "" - returns a list of devices
- "/{id}" - returns a device by the specified id

### POST
Users Microservice
- "/register" - inserts a new user in the database
- "/authenticate" - given an email and a password, returns a jwt token containing the user's authorizations

Devices Microservice
- "" - inserts a new device in the database and maps it to a userID

### PUT
Users Microservice
- "/{email}" - updates the credentials of a user, given an (initial) email

Devices Microservice
- "/{description}" - updates the details of a device, given a description

### DELETE
Users Microservice
- "/{email}" - deletes a user, given it's email

Devices Microservice
- "/description/{description}" - deletes a device, given it's description
- "/userID/{userID}" - deletes every mapping to a user that was removed
