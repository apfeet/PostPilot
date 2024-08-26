# Usa un'immagine base di Debian o Alpine per la leggerezza
FROM debian:latest

# Installa gli strumenti necessari
RUN apt-get update && apt-get install -y \
    jq \
    bc \
    curl \
    gnupg

# Installa MongoDB Shell (mongosh)
RUN curl -fsSL https://pgp.mongodb.com/server-6.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-archive-keyring.gpg && \
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-archive-keyring.gpg ] https://repo.mongodb.org/apt/debian bullseye/mongodb-org/6.0 main" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list && \
    apt-get update && apt-get install -y mongodb-mongosh

# Imposta la directory di lavoro
WORKDIR /app

# Copia il contenuto della cartella corrente nella directory di lavoro del container
COPY . .

# Imposta l'entrypoint per eseguire lo script
ENTRYPOINT ["bash", "/app/monitor_docker.sh"]
