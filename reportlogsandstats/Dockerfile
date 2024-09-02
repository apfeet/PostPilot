FROM debian:latest


RUN apt-get update && apt-get install -y \
    jq \
    bc \
    curl \
    gnupg


RUN curl -fsSL https://pgp.mongodb.com/server-6.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-archive-keyring.gpg && \
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-archive-keyring.gpg ] https://repo.mongodb.org/apt/debian bullseye/mongodb-org/6.0 main" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list && \
    apt-get update && apt-get install -y mongodb-mongosh


WORKDIR /app


COPY . .


ENTRYPOINT ["bash", "/app/monitor_docker.sh"]
