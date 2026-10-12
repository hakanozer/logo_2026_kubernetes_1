#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENGINE="${1:?Choose dockerd or containerd}"

build_image() {
  local tag="$1"
  local directory="$2"
  case "$ENGINE" in
    dockerd)
      docker build --tag "$tag" "$ROOT_DIR/$directory"
      ;;
    containerd)
      nerdctl --namespace k8s.io build --tag "$tag" "$ROOT_DIR/$directory"
      ;;
    *)
      printf 'Unsupported engine: %s (choose dockerd or containerd)\n' "$ENGINE" >&2
      exit 2
      ;;
  esac
}

build_image logo/api-gateway:training "Api Gateway"
build_image logo/inventory-service:training "Inventory Service"
build_image logo/order-service:training "Order Service"
build_image logo/payment-service:training "Payment Service"
build_image logo/notification-service:training "Notification Service"

printf 'Training images built with %s.\n' "$ENGINE"
