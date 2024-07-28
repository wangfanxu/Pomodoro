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

## Database Design


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