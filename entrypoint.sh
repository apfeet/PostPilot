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

if [ "$MODALITY" = "env" ]; then
    log "🚫" "MODALITY is set to 'env'. Nginx will not be started."
    log "🌐" "Starting frontend, backend, and MongoDB..."
    docker-compose up -d frontend backend mongodb
    log "✅" "Services started without Nginx."
else
    log "✅" "MODALITY is not 'env'. Proceeding with Nginx setup."
    
    log "🔧" "Substituting environment variables in nginx.conf..."
    envsubst '\$HOST \$FRONTEND_PORT \$BACKEND_PORT \$NGINX_PORT' < /etc/nginx/nginx.conf > /etc/nginx/nginx.conf
    
    log "📄" "Displaying final nginx.conf:"
    cat /etc/nginx/nginx.conf
    
    log "🚀" "Starting Nginx..."
    nginx -g 'daemon off;'
fi

log "🎉" "Script execution completed!!"