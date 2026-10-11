#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
ENGINE="${1:?Choose dockerd or containerd}"

case "$ENGINE" in
  dockerd)
    docker build --tag logo/order-service:v1 "$ROOT_DIR/Order Service"
    docker build --tag logo/order-service:v2 "$ROOT_DIR/Order Service"
    ;;
  containerd)
    nerdctl --namespace k8s.io build --tag logo/order-service:v1 "$ROOT_DIR/Order Service"
    nerdctl --namespace k8s.io build --tag logo/order-service:v2 "$ROOT_DIR/Order Service"
    ;;
  *)
    printf 'Unsupported engine: %s (choose dockerd or containerd)\n' "$ENGINE" >&2
    exit 2
    ;;
esac

printf 'v1 and v2 tags were built from the same source; this demonstrates rollout mechanics only.\n'
