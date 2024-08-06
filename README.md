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

To start all the services in parallel, run:

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

## Development
Feel free to fork this repository and create a pull request if you want to contribute to the project.


## License
This project is licensed under the MIT License.
