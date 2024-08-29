#!/bin/sh

# Function to log with emoji
log() {
    emoji=$1
    message=$2
    echo "$emoji $message"
}

log "🚀" "Starting service script..."

log "🔍" "Checking MODALITY..."
echo "MODALITY: $MODALITY"
echo "NGINX_PORT: $NGINX_PORT"
echo "FRONTEND_PORT: $FRONTEND_PORT"
echo "BACKEND_PORT: $BACKEND_PORT"
echo "HOST: $HOST"

# Check and create SSL certificate if needed
check_create_ssl_cert() {
    SSL_DIR="/etc/nginx/ssl"
    CERT_FILE="$SSL_DIR/nginx.crt"
    KEY_FILE="$SSL_DIR/nginx.key"

    if [ ! -f "$CERT_FILE" ] || [ ! -f "$KEY_FILE" ]; then
        log "⚠️" "SSL certificate or key not found in $SSL_DIR"
        log "🔒" "Creating self-signed certificate..."
        
        # Generate a self-signed certificate
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout "$KEY_FILE" -out "$CERT_FILE" \
            -subj "/C=IT/ST=Italy/L=Rome/O=PostPilot/CN=${HOST}"
        
        if [ $? -eq 0 ]; then
            log "✅" "Self-signed SSL certificate created successfully."
        else
            log "❌" "Failed to create self-signed SSL certificate."
            exit 1
        fi
    else
        log "✅" "Existing SSL certificate and key found."
    fi
}

if [ "$MODALITY" = "env" ]; then
    log "🚫" "MODALITY is set to 'env'. Nginx will not be started."
    log "🌐" "Starting frontend, backend, and MongoDB..."
    docker-compose up -d frontend backend mongodb
    log "✅" "Services started without Nginx."
else
    log "✅" "MODALITY is not 'env'. Proceeding with Nginx setup."
    
    check_create_ssl_cert

    log "🔧" "Substituting environment variables in nginx.conf..."
    envsubst '\$HOST \$FRONTEND_PORT \$BACKEND_PORT \$NGINX_PORT' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf
    
    log "🚀" "Starting Nginx..."
    nginx -g 'daemon off;'
fi

log "🎉" "Script execution completed!!"