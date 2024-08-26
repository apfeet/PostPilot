# Load environment variables
source .env

# Function to start services
start_services() {
    if [ "$MODALITY" = "env" ]; then
        echo "Starting services without ⚒Nginx...⚒"
        docker-compose up -d frontend backend mongodb
    else
        echo "Starting all services including Nginx..."
        docker-compose up -d
    fi
}

# Call the function
start_services