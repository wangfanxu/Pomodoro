# Pomodoro Timer Application
## Overview
This project is a Pomodoro Timer application built with Node.js, TypeScript, TypeORM,Zod and WebSocket. It allows users to manage their Pomodoro cycles, track work sessions, short breaks, and long breaks, and receive real-time notifications upon session completion.

## Features
Input params validation: Zod validation
Pomodoro Cycles: Manage multiple Pomodoro cycles and sessions.
Session Management: Start, stop, resume, and complete sessions with automatic scheduling.
Real-time Notifications: Receive real-time notifications via WebSocket.
REST API: Comprehensive REST API for managing users, cycles, and sessions.
Database Integration: Persistent storage using PostgreSQL and TypeORM.
Configurable Timers: Users can set and update timer configurations.

## Getting Started
### Prerequisites
Node.js
PostgreSQL

### Installation
1. Clone the repository

2. Bring up the docker compose
docker-compose up

Application will be running on 3000, or sql on 5432

### endpoints && testing
1. all endpoint can be find from *.http files
2. open from vscode and click send request 
