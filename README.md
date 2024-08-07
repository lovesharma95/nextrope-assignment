# track-work-time

## Overview

This project is a monorepo microservice architecture for tracking work time using NestJS and NX. It includes multiple microservices to handle authentication, user management, time tracking, project management, and notifications.

## Prerequisites

- Node.js (>= 18.x)
- Yarn (>= 1.x)

## Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Install dependencies:

    ```bash
    yarn install
    ```

## Project Structure

The project uses NX to manage the monorepo and includes the following microservices:

- **Authentication Service**: Handles user registration, email confirmation, and login.
- **User Management Service**: Manages user roles and permissions.
- **Time Tracking Service**: Manages the logging of working hours.
- **Project Management Service**: Handles CRUD operations for projects.
- **Notification Service**: Manages sending emails and other notifications (optional).

### Directory Layout

```plaintext
apps/
  authentication-service/
    src/
      app/
      main.ts
    test/
  user-management-service/
    src/
      app/
      main.ts
    test/
  time-tracking-service/
    src/
      app/
      main.ts
    test/
  project-management-service/
    src/
      app/
      main.ts
    test/
  notification-service/ (Optional)
    src/
      app/
      main.ts
    test/
libs/
  common/
  dtos/
  interfaces/
```

## Development

The first step is to create the .env file for each service inside the apps folder,env.example file has been added to all the services, just need to update the db variables and JWT variables


To start all the services in parallel, run:4

```
yarn start
```

To run tests for all services, use:

```
yarn test
```

To lint all services, use:

```
yarn lint
```

## Swagger Documentation

```
<Base_Url>/<service-name>/swagger
```
    
## Endpoints

### Authentication Service
```
GET <Base_Url>/authentication/v1/api/health
POST <Base_Url>/authentication/v1/api/register
GET <Base_Url>/authentication/v1/api/confirm-email/{token}
POST <Base_Url>/authentication/v1/api/login
GET <Base_Url>/authentication/v1/api/users
PATCH <Base_Url>/authentication/v1/api/users/{id}
```

### Time Tracking Service
```
GET <Base_Url>/time-tracking/v1/api/health
POST <Base_Url>/time-tracking/v1/api/start
PUT <Base_Url>/time-tracking/v1/api/stop/{timeLogId}
GET <Base_Url>/time-tracking/v1/api/user/total-work-time
GET <Base_Url>/time-tracking/v1/api/all-user/total-work-time
```

### Project Management Service
```
GET <Base_Url>/project-management/v1/api/health
POST <Base_Url>/project-management/v1/api/project
GET <Base_Url>/project-management/v1/api/project
```

## Contribution
Feel free to fork this repository and create a pull request if you want to contribute to the project.

## License
This project is licensed under the MIT License.
