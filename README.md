# Plus Ultra

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React Native](https://img.shields.io/badge/React%20Native-0.64.2-blue.svg)](https://reactnative.dev/)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Development Setup](#development-setup)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

**Plus Ultra** is a mobile application built with React Native. It aims to track every workout of user and log them, also has the ability to scan gym equipments to recognize them.

## Features

- Authentication
- Workout Tracker/Logger
- Equipment Identifier via Camera or Image Gallery
- Estimated calories burned per workout session
- Customizable workout splits
- Adding new exercises
- See other users Personal Record

## Development Setup

### Prerequisites

- [React Native and Expo](https://reactnative.dev/docs/environment-setup)
- [Node.js](https://nodejs.org/)
- [Yarn](https://classic.yarnpkg.com/en/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://github.com/docker/compose)
- [PostgreSQL](https://www.postgresql.org/)

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/bangueco/plus-ultra.git
    ```
2. Go to root directory:
    ```bash
    cd plus-ultra
    ```
3. Install yarn package manager:
    ```bash
    npm install -g yarn
    ```
4. Install frontend and backend dependencies:
    ```bash
    yarn init
    ```
5. Install docker and docker compose (assuming you use linux)
    ```bash
    yay docker && yay docker-compose
    ```
6. On root directory, run docker compose to build PostgreSQL image:
    ```bash
    docker-compose build
    ```
7. On root directory, run this to start postgresql container:
    ```bash
    docker-compose up
    ```
8. Navigate to backend directory and make a copy of .env and edit according to variables
    ```bash
    cd backend && cp .env.example .env
    ```
9. Run this to start backend development server
    ```bash
    yarn dev
    ```
10. Navigate to frontend directory and make a copy of .env and edit according to variables
    ```bash
    cd frontend && cp .env.example .env
    ```
11. On frontend .env file, edit it according to your local ip (don't use localhost or 127.0.0.1 as it will not work.)
    ```env
    EXPO_PUBLIC_API=http://0.0.0.0:3000/api
    ```
12. Start frontend development server and scan it with Expo Go
    ```bash
    yarn start
    ```

## Usage

TODO: ADD USAGE SOON

### Compiling Mobile Application
