# Dockerfile for Grafana
FROM grafana/grafana:latest

COPY ./grafana.ini /etc/grafana/grafana.ini
COPY ./provisioning /etc/grafana/provisioning
COPY ./dashboards /etc/grafana/dashboards

# Expose Grafana port
EXPOSE 9091

CMD ["/run.sh"]