Pomodoro Timer Application
Overview
This project is a Pomodoro Timer application built with Node.js, TypeScript, TypeORM, and WebSocket. It allows users to manage their Pomodoro cycles, track work sessions, short breaks, and long breaks, and receive real-time notifications upon session completion.

Features
User Authentication: Secure user authentication and authorization.
Pomodoro Cycles: Manage multiple Pomodoro cycles and sessions.
Session Management: Start, stop, resume, and complete sessions with automatic scheduling.
Real-time Notifications: Receive real-time notifications via WebSocket.
REST API: Comprehensive REST API for managing users, cycles, and sessions.
Database Integration: Persistent storage using PostgreSQL and TypeORM.
Configurable Timers: Users can set and update timer configurations.
Getting Started
Prerequisites
Node.js (version 14 or higher)
PostgreSQL (version 12 or higher)
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/your-username/pomodoro-timer.git
cd pomodoro-timer
Install dependencies:

bash
Copy code
npm install
Set up environment variables:
Create a .env file in the root directory and add the following variables:

env
Copy code
DATABASE_HOST=your_database_host
DATABASE_PORT=your_database_port
DATABASE_USER=your_database_user
DATABASE_PASSWORD=your_database_password
DATABASE_NAME=your_database_name
Run database migrations:

bash
Copy code
npm run typeorm migration:run
Start the server:

bash
Copy code
npm start
API Endpoints
User Endpoints
Create User

http
Copy code
POST /users
Get User

http
Copy code
GET /users/:userId
Update User Configuration

http
Copy code
PATCH /users/:userId/configuration
Session Endpoints
Start Session

http
Copy code
POST /sessions
Stop Session

http
Copy code
PATCH /sessions/:sessionId/stop
Resume Session

http
Copy code
PATCH /sessions/:sessionId/resume
Update Session Status

http
Copy code
PATCH /sessions/:sessionId/status
Cycle Endpoints
Create Cycle

http
Copy code
POST /cycles
Get Sessions by Cycle

http
Copy code
GET /cycles/:cycleId/sessions
WebSocket
The application uses WebSocket to send real-time notifications to the client. Connect to the WebSocket server at:

javascript
Copy code
const ws = new WebSocket('ws://localhost:3000');
Events
Connection Established

javascript
Copy code
ws.onopen = () => {
  console.log('Connected to the WebSocket server');
};
Receive Message

javascript
Copy code
ws.onmessage = (event) => {
  console.log('Message from server:', event.data);
};
Connection Closed

javascript
Copy code
ws.onclose = () => {
  console.log('Disconnected from the WebSocket server');
};

Acknowledgements
TypeORM
Express
PostgreSQL
WebSocket