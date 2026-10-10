#!/usr/bin/env zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# If minikube is installed and running, build directly in minikube Docker daemon.
if command -v minikube >/dev/null 2>&1 && minikube -p minikube status >/dev/null 2>&1; then
  eval "$(minikube -p minikube docker-env)"
fi

docker build -t logo/api-gateway:latest "$ROOT_DIR/Api Gateway"
docker build -t logo/inventory-service:latest "$ROOT_DIR/Inventory Service"
docker build -t logo/order-service:latest "$ROOT_DIR/Order Service"
docker build -t logo/payment-service:latest "$ROOT_DIR/Payment Service"
docker build -t logo/notification-service:latest "$ROOT_DIR/Notification Service"

echo "Docker images hazır."

