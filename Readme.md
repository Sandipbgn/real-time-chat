# Real-Time Chat Application

## Overview

This is a real-time chat application built with Express, Prisma, PostgreSQL, React, and Socket.IO. The application supports features such as user registration and login, real-time messaging, infinite scrolling for message history, message search, and more. The application is fully Dockerized for easy deployment.

## Features

- **User Authentication**: Secure user registration and login using JWT-based authentication.
- **Real-Time Messaging**: Real-time chat functionality with Socket.IO.
- **Infinite Scrolling**: Load previous messages dynamically as the user scrolls up.
- **Message Search**: Search through chat messages in real-time.
- **Dockerized Deployment**: Fully containerized with Docker for easy setup and deployment.

## Technologies Used

- **Backend**: 
  - Node.js with Express.js
  - Prisma ORM
  - PostgreSQL Database
  - Socket.IO for real-time communication
- **Frontend**: 
  - React.js
  - Axios for API requests
  - Socket.IO Client
- **Authentication**: 
  - JWT (JSON Web Token)
- **Styling**: 
  - CSS
- **Containerization**: 
  - Docker

## Prerequisites

- **Docker** (ensure Docker and Docker Compose are installed)
- **Node.js** (for local development, not required for Docker deployment)
- **npm** or **yarn** (for local development)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/real-time-chat.git
cd real-time-chat
```

### 2. Setup Environment Variables

- Copy the `.env.example` file to `.env`:
  
```bash
cp .env.example .env
```

- Update the `.env` file with your specific environment variables (e.g., `DATABASE_URL`, `JWT_SECRET`).

## Docker Instructions

### 1. Build and Run the Application

To build and run the application with Docker, simply use the following command:

```bash
docker-compose up --build
```

This command will build the Docker images for both the backend and frontend, set up the PostgreSQL database, and start the services.

### 2. Access the Application

Once the containers are up and running, you can access the application at:

- **Frontend**: `http://localhost:8000`
- **Backend API**: `http://localhost:8000/api` (if applicable)

### 3. Managing Containers

To stop the containers, run:

```bash
docker-compose down
```

To restart the containers without rebuilding:

```bash
docker-compose up
```

### 4. Persistent Data

The database data is stored in a Docker volume named `db-data` to ensure persistence across container restarts.

## Local Development (Optional)

If you prefer to run the application locally without Docker:

### Backend Setup

1. Navigate to the project root and install backend dependencies:

```bash
npm install
```

2. Set up the PostgreSQL database and run migrations:

```bash
npx prisma migrate dev
```

3. Start the backend server:

```bash
npm run dev
```

### Frontend Setup

1. Navigate to the `client` directory and install frontend dependencies:

```bash
cd client
npm install
```

2. Start the React development server:

```bash
npm start
```

3. Access the frontend at `http://localhost:3000`.


## Environment Variables

The application requires several environment variables to run. These are provided in the `.env.example` file. Ensure you create a `.env` file in the root directory with the following variables:

- `DATABASE_URL`: Connection string for the PostgreSQL database.
- `JWT_SECRET`: Secret key for JWT authentication.
- Other variables as needed.