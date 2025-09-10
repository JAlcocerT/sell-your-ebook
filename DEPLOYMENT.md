# 🚀 Server Deployment Guide

This guide explains how to deploy your Sell Your Ebook project to a server with proper network access.

## 🔧 **Fixed Issues for Server Deployment**

### **Problem**: Config Editor not accessible from external IP
### **Solution**: Updated Docker Compose to bind to `0.0.0.0` instead of `127.0.0.1`

## 📋 **Deployment Options**

### **Option 1: Production Deployment (Recommended)**

```bash
# Deploy to production with external access
make prod-deploy

# Check logs
make prod-logs

# Stop production
make prod-stop
```

**Access URLs:**
- **Astro Site**: `http://YOUR_SERVER_IP:8090`
- **Config Editor**: `http://YOUR_SERVER_IP:5000`

### **Option 2: Development Deployment**

```bash
# Deploy development version with external access
make quick-all

# Check logs
make logs

# Stop services
make stop
```

**Access URLs:**
- **Astro Dev**: `http://YOUR_SERVER_IP:4321`
- **Config Editor**: `http://YOUR_SERVER_IP:5000`

## 🛠️ **Key Changes Made**

### **1. Flask App Configuration**
```python
# app.py - Now uses environment variables
host = os.environ.get('FLASK_HOST', '0.0.0.0')
port = int(os.environ.get('FLASK_PORT', 5000))
app.run(debug=debug, host=host, port=port)
```

### **2. Docker Compose Port Binding**
```yaml
# docker-compose.yml - Explicitly bind to all interfaces
ports:
  - "0.0.0.0:5000:5000"  # Instead of "5000:5000"
```

### **3. Environment Variables**
```yaml
environment:
  - FLASK_HOST=0.0.0.0
  - FLASK_PORT=5000
```

## 🌐 **Server Configuration**

### **Firewall Setup (Ubuntu/Debian)**
```bash
# Allow ports through firewall
sudo ufw allow 5000/tcp  # Config Editor
sudo ufw allow 8090/tcp  # Astro Production
sudo ufw allow 4321/tcp  # Astro Development (if needed)

# Check firewall status
sudo ufw status
```

### **Firewall Setup (CentOS/RHEL)**
```bash
# Allow ports through firewall
sudo firewall-cmd --permanent --add-port=5000/tcp
sudo firewall-cmd --permanent --add-port=8090/tcp
sudo firewall-cmd --permanent --add-port=4321/tcp
sudo firewall-cmd --reload

# Check firewall status
sudo firewall-cmd --list-ports
```

## 🔍 **Troubleshooting**

### **Check if services are running:**
```bash
# Check Docker containers
docker ps

# Check port binding
netstat -tlnp | grep -E "(5000|8090|4321)"

# Check Docker logs
docker logs config-editor
docker logs astro-prod
```

### **Test connectivity:**
```bash
# Test from server
curl http://localhost:5000
curl http://localhost:8090

# Test from external machine
curl http://YOUR_SERVER_IP:5000
curl http://YOUR_SERVER_IP:8090
```

### **Common Issues:**

1. **Port not accessible externally**
   - Check firewall settings
   - Verify Docker port binding: `docker ps`
   - Ensure `0.0.0.0:PORT:PORT` format in docker-compose.yml

2. **Flask app not starting**
   - Check logs: `docker logs config-editor`
   - Verify environment variables
   - Ensure config.json exists and is readable

3. **Permission issues**
   - Check file permissions: `ls -la landing-page-book-astro-tailwind/src/config.json`
   - Ensure Docker has access to mounted volumes

## 📁 **File Structure for Deployment**

```
sell-your-ebook/
├── docker-compose.yml          # Development setup
├── docker-compose.prod.yml     # Production setup
├── Makefile                    # Deployment commands
├── landing-page-book-astro-tailwind/
│   └── src/config.json         # Editable via Flask app
└── config-editor/              # Flask app
    ├── app.py                  # Updated with 0.0.0.0 binding
    ├── requirements.txt
    └── templates/
```

## 🚀 **Quick Deployment Commands**

```bash
# 1. Clone/upload your project to server
git clone YOUR_REPO_URL
cd sell-your-ebook

# 2. Deploy production version
make prod-deploy

# 3. Check if everything is running
docker ps

# 4. Test access
curl http://YOUR_SERVER_IP:5000
curl http://YOUR_SERVER_IP:8090

# 5. View logs if needed
make prod-logs
```

## 🔒 **Security Considerations**

1. **Change default ports** if needed:
   ```yaml
   ports:
     - "0.0.0.0:8080:5000"  # Config Editor on port 8080
     - "0.0.0.0:9090:4321"  # Astro on port 9090
   ```

2. **Add authentication** to Flask app for production use

3. **Use HTTPS** with reverse proxy (nginx/traefik)

4. **Restrict access** with firewall rules

## 📞 **Support**

If you encounter issues:
1. Check the logs: `make prod-logs`
2. Verify port binding: `docker ps`
3. Test connectivity: `curl http://localhost:PORT`
4. Check firewall: `sudo ufw status`

The config editor should now be accessible from external IPs! 🎉
