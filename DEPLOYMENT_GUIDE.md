# 🚀 Production Deployment Guide

## **System Architecture Overview**

This guide covers the complete deployment of a production-ready, self-healing Spring Boot + Angular application on Minikube with monitoring.

---

## **📋 Prerequisites**

1. **Minikube** installed and running
2. **kubectl** configured
3. **Docker Hub** account (images: `zehim/devops-project:latest`, `zehim/devops-frontend:latest`)
4. **Vagrant VM** with IP `192.168.56.20` (or update service URLs accordingly)

---

## **🔧 Step 1: Start Minikube Tunnel**

**CRITICAL:** LoadBalancer services require `minikube tunnel` to be running.

```bash
# Start tunnel in a separate terminal (keep it running)
minikube tunnel
```

This will assign external IPs to LoadBalancer services and route traffic correctly.

---

## **📦 Step 2: Deploy in Order**

Deploy components in this exact sequence to ensure dependencies are ready:

```bash
# 1. MySQL Database (must be ready first)
kubectl apply -f k8s-mysql.yaml

# Wait for MySQL to be Ready
kubectl wait --for=condition=ready pod -l app=mysql -n devops --timeout=120s

# 2. Spring Boot Backend
kubectl apply -f k8s-spring.yaml

# Wait for Spring Boot to be Ready (with extended timeout for startup)
kubectl wait --for=condition=ready pod -l app=spring-app -n devops --timeout=300s

# 3. Angular Frontend
kubectl apply -f k8s-frontend.yaml

# 4. Monitoring Stack (optional but recommended)
kubectl apply -f k8s-monitoring.yaml
```

---

## **🔍 Step 3: Verify Deployment**

### **Check Pod Status**

```bash
# View all pods
kubectl get pods -n devops

# Expected output:
# NAME                            READY   STATUS    RESTARTS   AGE
# mysql-deployment-xxx            1/1     Running   0          2m
# spring-app-xxx                  1/1     Running   0          1m
# frontend-xxx                    1/1     Running   0          30s
```

### **Check Services**

```bash
# View LoadBalancer services
kubectl get svc -n devops

# Expected output:
# NAME              TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)          AGE
# mysql-service     ClusterIP     10.96.x.x      <none>          3306/TCP         2m
# spring-service    LoadBalancer  10.96.x.x      192.168.56.20   8080:xxxxx/TCP   1m
# frontend-service  LoadBalancer  10.96.x.x      192.168.56.20   80:xxxxx/TCP     30s
```

### **Check Spring Boot Health**

```bash
# Get Spring Boot pod name
SPRING_POD=$(kubectl get pods -n devops -l app=spring-app -o jsonpath='{.items[0].metadata.name}')

# Check logs (should show successful startup)
kubectl logs $SPRING_POD -n devops --tail=50

# Check health endpoint
kubectl exec $SPRING_POD -n devops -- wget -qO- http://localhost:8089/student/actuator/health
```

---

## **🌐 Step 4: Access the Application**

### **Frontend**
- **URL:** `http://192.168.56.20` (via LoadBalancer)
- Or use port-forward: `kubectl port-forward -n devops svc/frontend-service 8080:80`

### **Backend API**
- **URL:** `http://192.168.56.20:8080/student/...`
- Health Check: `http://192.168.56.20:8080/student/actuator/health`

### **Monitoring (if deployed)**
```bash
# Prometheus
kubectl port-forward -n monitoring svc/prometheus-service 9090:9090
# Access: http://localhost:9090

# Grafana
kubectl port-forward -n monitoring svc/grafana-service 3000:3000
# Access: http://localhost:3000 (admin/admin)
```

---

## **🛠️ Troubleshooting**

### **Spring Boot Pod Not Starting**

1. **Check Pod Events:**
   ```bash
   kubectl describe pod <spring-pod-name> -n devops
   ```

2. **Check Logs:**
   ```bash
   kubectl logs <spring-pod-name> -n devops
   kubectl logs <spring-pod-name> -n devops --previous  # Previous container
   ```

3. **Verify Health Probes:**
   - Startup probe: 30s initial delay, checks every 10s, max 30 failures (5 minutes total)
   - Readiness probe: 90s initial delay, checks every 5s, max 10 failures
   - Liveness probe: 120s initial delay, checks every 10s, max 3 failures

4. **Check Database Connectivity:**
   ```bash
   # Verify MySQL is accessible
   kubectl exec <spring-pod-name> -n devops -- wget -qO- http://mysql-service.devops.svc.cluster.local:3306
   ```

### **LoadBalancer Not Getting External IP**

- Ensure `minikube tunnel` is running
- Check tunnel status: `minikube tunnel --help`
- Restart tunnel if needed

### **Frontend Can't Connect to Backend**

- Verify backend service: `kubectl get svc spring-service -n devops`
- Check frontend service URL in `department.service.ts` and `student.service.ts`
- Ensure backend is Ready: `kubectl get pods -l app=spring-app -n devops`

---

## **📊 Health Probe Configuration**

### **Spring Boot Pod Probes**

| Probe Type | Initial Delay | Period | Timeout | Failure Threshold | Purpose |
|------------|---------------|--------|---------|------------------|---------|
| **Startup** | 30s | 10s | 5s | 30 | Prevents premature restarts during initial startup |
| **Readiness** | 90s | 5s | 3s | 10 | Marks pod as ready to receive traffic |
| **Liveness** | 120s | 10s | 5s | 3 | Restarts pod if application becomes unresponsive |

**Why These Values?**
- Spring Boot with Hibernate can take 60-90 seconds to fully initialize
- Database connection pooling adds additional startup time
- Startup probe gives up to 5 minutes (30 × 10s) for initial startup
- Readiness probe allows graceful startup without killing the pod

---

## **🔄 Update Deployment**

### **Update Application Code**

```bash
# 1. Build and push new Docker images (via Jenkins or manually)
docker build -t zehim/devops-project:latest .
docker push zehim/devops-project:latest

# 2. Restart deployment to pull new image
kubectl rollout restart deployment/spring-app -n devops
kubectl rollout restart deployment/frontend -n devops

# 3. Monitor rollout status
kubectl rollout status deployment/spring-app -n devops
kubectl rollout status deployment/frontend -n devops
```

---

## **🗑️ Cleanup**

```bash
# Delete all resources
kubectl delete -f k8s-frontend.yaml
kubectl delete -f k8s-spring.yaml
kubectl delete -f k8s-mysql.yaml
kubectl delete -f k8s-monitoring.yaml

# Delete namespace (if you want to remove everything)
kubectl delete namespace devops
kubectl delete namespace monitoring
```

---

## **✅ Production Checklist**

- [x] Health probes configured with appropriate delays
- [x] Services use LoadBalancer for stable networking
- [x] Resource limits set (memory: 1Gi, CPU: 1000m for Spring Boot)
- [x] Startup probe prevents premature restarts
- [x] Frontend API URLs point to stable LoadBalancer endpoint
- [x] Monitoring stack configured (Prometheus + Grafana)
- [x] Glassmorphism UI with Poppins font
- [x] Error handling with loading state management
- [x] `minikube tunnel` running for LoadBalancer services

---

## **📝 Notes**

- **LoadBalancer Services:** Require `minikube tunnel` to be running. Without it, services will show `<pending>` external IP.
- **Health Probes:** The extended delays prevent the silent crash loop issue by giving Spring Boot adequate time to initialize.
- **Database:** MySQL must be Ready before Spring Boot starts, or connection timeouts will occur.
- **Monitoring:** Prometheus automatically discovers Spring Boot endpoints via Kubernetes service discovery.

---

**Last Updated:** System-wide stability overhaul complete ✅

