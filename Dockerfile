FROM nginx:latest

# Copy the entrypoint script and set execute permissions
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copy other necessary files
COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY ssl /etc/nginx/ssl

# Set the entrypoint
ENTRYPOINT ["/entrypoint.sh"]
