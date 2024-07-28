# Pomodoro Timer Application
## Overview
This project is a Pomodoro Timer application built with Node.js, TypeScript, TypeORM,Zod and WebSocket. It allows users to manage their Pomodoro cycles, track work sessions, short breaks, and long breaks, and receive real-time notifications upon session completion.

## Features
1. Input params validation: Zod validation
2. Pomodoro Cycles: Manage multiple Pomodoro cycles and sessions.
3. Session Management: Start, stop, resume, and complete sessions with automatic scheduling.
4. Real-time Notifications: Receive real-time notifications via WebSocket.
5. REST API: Comprehensive REST API for managing users, cycles, and sessions.
6. Database Integration: Persistent storage using PostgreSQL and TypeORM.
7. Configurable Timers: Users can set and update timer configurations.

## API Design
There are total 4 endpoints included:
1. create session: `POST /sessions`
2. Get a session: `GET /users/:userId/cycles/:cycleId/sessions/:sessionId`
3. Update session status, paused or resume: `PATCH /users/:userId/cycles/:cycleId/sessions/:sessionId/status`
4. Update user configuration: `/users/:userId/configurations`

## Database Schema
### Users Table
Stores information about the users of the Pomodoro Timer application.

| Column        | Data Type | Constraints                         | Description                              |
| ------------- | --------- | ----------------------------------- | ---------------------------------------- |
| id            | UUID      | PRIMARY KEY                         | Unique identifier for the user           |
| username      | VARCHAR   | NOT NULL, UNIQUE                    | Username of the user                     |
| email         | VARCHAR   | NOT NULL, UNIQUE                    | Email address of the user                |
| password_hash | VARCHAR   | NOT NULL                            | Hashed password of the user              |
| created_at    | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Timestamp when the user was created      |
| updated_at    | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Timestamp when the user was last updated |

### Cycles Table
Stores information about Pomodoro cycles.

| Column     | Data Type | Constraints                                                  | Description                               |
| ---------- | --------- | ------------------------------------------------------------ | ----------------------------------------- |
| id         | UUID      | PRIMARY KEY                                                  | Unique identifier for the cycle           |
| completed  | UUID      | NOT NULL, DEFAULT FALSE                                      | Status of current cycle                   |
| user_id    | UUID      | NOT NULL, FOREIGN KEY REFERENCES Users(id) ON DELETE CASCADE | ID of the user who owns the cycle         |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP                          | Timestamp when the cycle was created      |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP                          | Timestamp when the cycle was last updated |

### Sessions Table
Stores information about individual Pomodoro sessions.

| Column     | Data Type | Constraints                                                   | Description                                                   |
| ---------- | --------- | ------------------------------------------------------------- | ------------------------------------------------------------- |
| id         | UUID      | PRIMARY KEY                                                   | Unique identifier for the session                             |
| cycle_id   | UUID      | NOT NULL, FOREIGN KEY REFERENCES Cycles(id) ON DELETE CASCADE | ID of the cycle to which the session belongs                  |
| status     | VARCHAR   | NOT NULL                                                      | Status of the session (e.g., "active", "paused", "completed") |
| start_time | TIMESTAMP | NOT NULL                                                      | Timestamp when the session started                            |
| end_time   | TIMESTAMP |                                                               | Timestamp when the session ended                              |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP                           | Timestamp when the session was created                        |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP                           | Timestamp when the session was last updated                   |

### Configurations Table
Stores user-specific configuration settings for Pomodoro intervals.

| Column              | Data Type | Constraints                                                  | Description                                       |
| ------------------- | --------- | ------------------------------------------------------------ | ------------------------------------------------- |
| id                  | UUID      | PRIMARY KEY                                                  | Unique identifier for the configuration           |
| user_id             | UUID      | NOT NULL, FOREIGN KEY REFERENCES Users(id) ON DELETE CASCADE | ID of the user who owns the configuration         |
| work_interval       | INTEGER   | NOT NULL                                                     | Duration of the work interval (in minutes)        |
| short_break         | INTEGER   | NOT NULL                                                     | Duration of the short break (in minutes)          |
| long_break          | INTEGER   | NOT NULL                                                     | Duration of the long break (in minutes)           |
| long_break_interval | INTEGER   | NOT NULL                                                     | Number of work intervals before a long break      |
| created_at          | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP                          | Timestamp when the configuration was created      |
| updated_at          | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP                          | Timestamp when the configuration was last updated |

## Relationships

- **User and Cycles:**
  - One-to-Many relationship.
  - Each user can have multiple cycles.

- **Cycle and Sessions:**
  - One-to-Many relationship.
  - Each cycle can have multiple sessions.

- **User and Configurations:**
  - One-to-One relationship.
  - Each user has one configuration.

## Example SQL Script for Initial Data

```sql
-- Insert users
INSERT INTO "user" (
        username,
        email,
        password_hash,
        created_at,
        updated_at
    )
VALUES (
        'testuser1',
        'testuser1@example.com',
        'passwordhash1',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'testuser2',
        'testuser2@example.com',
        'passwordhash2',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'testuser3',
        'testuser3@example.com',
        'passwordhash3',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'testuser4',
        'testuser4@example.com',
        'passwordhash4',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'testuser5',
        'testuser5@example.com',
        'passwordhash5',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );
INSERT INTO configuration (
        work_interval,
        short_break,
        long_break,
        long_break_interval,
        created_at,
        updated_at,
        user_id
    )
VALUES (
        1,
        1,
        1,
        4,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        1
    ),
    -- For testuser1
    (
        25,
        5,
        15,
        4,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        2
    ),
    -- For testuser2
    (
        25,
        5,
        15,
        4,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        3
    ),
    -- For testuser3
    (
        25,
        5,
        15,
        4,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        4
    ),
    -- For testuser4
    (
        25,
        5,
        15,
        4,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        5
    );
-- For testuser5
```

## Getting Started
### Prerequisites
Docker

### Installation
1. Clone the repository
2. Bring up the docker compose
```console
docker-compose up
```

Application will be running on 3000, or sql on 5432

### Testing Data
By default once application is up, all the table are empty.
You have to insert the testing users&configurations into tables
There is a **init.sql** included in this repo, you can simply execute it from postgresql.

### endpoints
all endpoint can be find from *.http files

### testing
unit test

```console
yarn run test
```

API test
execute the .http files