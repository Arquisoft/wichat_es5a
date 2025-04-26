# Dockerfile for Prometheus
FROM prom/prometheus:latest

# Copy Prometheus configuration
COPY ./gatewayservice/monitoring/prometheus/prometheus.yml /etc/prometheus/prometheus.yml

# Expose the port
EXPOSE 9090

# Start Prometheus
CMD ["--config.file=/etc/prometheus/prometheus.yml", "--storage.tsdb.path=/prometheus"]