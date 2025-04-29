# Dockerfile for Prometheus
FROM prom/prometheus:latest

# Copy Prometheus configuration
COPY . .

# Expose the port
EXPOSE 9090

# Start Prometheus
CMD ["--config.file=/prometheus/prometheus.yml", "--storage.tsdb.path=/prometheus"]