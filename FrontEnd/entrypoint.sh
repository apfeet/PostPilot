#!/bin/sh

sed "s/{{FRONTEND_PORT}}/${FRONTEND_PORT}/g" /etc/caddy/Caddyfile.template > /etc/caddy/Caddyfile

# Avvia Caddy
caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
