# PostPilot


## ⚙️ Dependencies

- Docker installed 🐳

## 🚀 How to Run the Project

1. Rename the file `.env.example` to `.env` and populate with appropriate values.

.

2. Set the `MODALITY` variable in your `.env` file to either env or prod depending on the mode you want to run:

    - `env`: For development purposes. This mode uses local development configurations
    - `prod`: For production purposes. This mode uses optimized production configurations.
.

2. Run the project: ` docker-compose up --build`
   
# 🌐 Access Pages

NOTE: this port and host are the default one on the .env.example

- FrontEnd (`env` Mode): http://localhost:8080 🌟
- FrontEnd (`prod` Mode): http://localhost:8080 🌟

Backend: http://localhost:5000 🔧

- Nginx: http://localhost:80 (only work on `prod` mode, Acts as a reverse proxy and serves the frontend and backend, access it if youre using `prod` mode) 🖥️

# 🔧 Configuration Files

- **Frontend Development Dockerfile (env_Dockerfile)**: Used for local development with live reloading.
- **Frontend Production Dockerfile (prod_Dockerfile)**: Used for serving the built frontend in production.

.

- **Backend Development Dockerfile (env_dockerfile)**: Used for local development of the backend.
- **Backend Production Dockerfile (prod_dockerfile)**: Used for production with Gunicorn for serving the backend.