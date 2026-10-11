#!/usr/bin/env bash
set -euo pipefail

: "${SERVICE_DIR:?Set SERVICE_DIR to a service directory, for example 'Order Service'}"
: "${IMAGE_REF:?Set IMAGE_REF to an approved registry/repository:immutable-tag}"
: "${DEPLOYMENT:?Set DEPLOYMENT to the deployment name}"
: "${CONTAINER_NAME:?Set CONTAINER_NAME to the container name}"
: "${KUBE_NAMESPACE:=logo-ms}"

if [[ ! -x "${SERVICE_DIR}/mvnw" ]]; then
  printf 'Maven wrapper not found in service directory: %s\n' "$SERVICE_DIR" >&2
  exit 1
fi

(
  cd "$SERVICE_DIR"
  ./mvnw --batch-mode verify
)

docker build --tag "$IMAGE_REF" "$SERVICE_DIR"
trivy image --exit-code 1 --severity HIGH,CRITICAL "$IMAGE_REF"
docker push "$IMAGE_REF"

kubectl config current-context
kubectl set image "deployment/${DEPLOYMENT}" "${CONTAINER_NAME}=${IMAGE_REF}" --namespace "$KUBE_NAMESPACE"
kubectl rollout status "deployment/${DEPLOYMENT}" --namespace "$KUBE_NAMESPACE" --timeout=180s
