```bash
#!/bin/bash

set -e

echo "Kubernetes bağlantısı kontrol ediliyor..."
kubectl cluster-info

echo "Kurulum başlıyor..."

find . -type f \( -name "*.yaml" -o -name "*.yml" \) \
  -not -path "./.git/*" \
  -print0 | while IFS= read -r -d '' file; do
    echo "Uygulanıyor: $file"
    kubectl apply -f "$file"
done

echo "Tüm Kubernetes manifestleri uygulandı."
kubectl get pods -A
```
