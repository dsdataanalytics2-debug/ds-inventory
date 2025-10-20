# 🚀 Render Free Tier Deployment Guide

## ✅ **Ready to Deploy - All Files Configured**

Your inventory automation project is now fully configured for Render free tier deployment. All necessary files have been created and updated.

---

## 📁 **Deployment Files Added/Updated**

### **Backend Files:**
- ✅ `backend/render.yaml` - Render service configuration
- ✅ `backend/Dockerfile` - Docker configuration (optional)
- ✅ `backend/runtime.txt` - Python version specification
- ✅ `backend/build.sh` - Build script
- ✅ `backend/requirements.txt` - Updated with all dependencies
- ✅ `backend/.env.example` - Environment variables template
- ✅ `backend/main.py` - Updated CORS for Render URLs
- ✅ `backend/add_name_column.py` - Database migration script

### **Frontend Files:**
- ✅ `frontend/render.yaml` - Frontend service configuration
- ✅ `frontend/utils/auth.ts` - Updated for environment-based API URLs
- ✅ `frontend/utils/config.ts` - Configuration utility
- ✅ `frontend/pages/profile.tsx` - Updated API calls
- ✅ `.gitignore` - Proper ignore rules

---

## 🚀 **Step-by-Step Deployment**

### **1. Prepare Your Repository**

1. **Push to GitHub/GitLab:**
   ```bash
   git add .
   git commit -m "Configure for Render deployment"
   git push origin main
   ```

### **2. Deploy Backend to Render**

1. **Sign up/Login** to [Render](https://render.com)
2. **Create New Web Service:**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - **Root Directory**: `backend`
   - **Environment**: `Python`
   - **Build Command**: 
     ```bash
     pip install --upgrade pip setuptools wheel && pip install --prefer-binary -r requirements.txt && python add_name_column.py
     ```
   - **Start Command**: 
     ```bash
     uvicorn main:app --host 0.0.0.0 --port $PORT
     ```

3. **Environment Variables** (Add in Render dashboard):
   ```
   SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
   PYTHONPATH=/opt/render/project/src
   ```

4. **Deploy** - Render will build and start your backend
5. **Note the URL**: e.g., `https://ds-inventory-server.onrender.com`

### **3. Deploy Frontend to Render**

1. **Create Another Web Service:**
   - **Root Directory**: `frontend`
   - **Environment**: `Node`
   - **Build Command**: 
     ```bash
     npm install && npm run build
     ```
   - **Start Command**: 
     ```bash
     npm start
     ```

2. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://ds-inventory-server.onrender.com
   NODE_ENV=production
   ```

3. **Deploy** - Frontend will build and start
4. **Note the URL**: e.g., `https://ds-inventory-frontend.onrender.com`

### **4. Update CORS Configuration**

After getting your frontend URL, update the backend CORS:

1. **Go to your backend service** in Render dashboard
2. **Update Environment Variables**:
   ```
   FRONTEND_URL=https://ds-inventory-frontend.onrender.com
   ```
3. **Redeploy** the backend service

---

## 🔧 **Configuration Details**

### **Backend Configuration (`backend/render.yaml`):**
```yaml
services:
  - type: web
    name: ds-inventory-server
    env: python
    region: oregon
    plan: free
    buildCommand: |
      pip install --upgrade pip setuptools wheel
      pip install --prefer-binary -r requirements.txt
      python add_name_column.py
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: SECRET_KEY
        value: your-secret-key-change-this-in-production-render-deployment
      - key: PYTHONPATH
        value: /opt/render/project/src
```

### **Frontend Configuration (`frontend/render.yaml`):**
```yaml
services:
  - type: web
    name: ds-inventory-frontend
    env: node
    region: oregon
    plan: free
    buildCommand: |
      npm install
      npm run build
    startCommand: npm start
    envVars:
      - key: NEXT_PUBLIC_API_URL
        value: https://ds-inventory-server.onrender.com
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
```

---

## 🛡️ **Security & Environment Variables**

### **Required Environment Variables:**

**Backend:**
- `SECRET_KEY`: JWT secret key (generate a strong one!)
- `PYTHONPATH`: Python path for imports

**Frontend:**
- `NEXT_PUBLIC_API_URL`: Your backend's Render URL
- `NODE_ENV`: Set to `production`

### **Generate Secure Secret Key:**
```python
import secrets
print(secrets.token_urlsafe(32))
```

---

## 📊 **Free Tier Limitations**

- **RAM**: 512MB per service
- **Sleep**: Services sleep after 15 minutes of inactivity
- **Build Time**: 10 minutes max
- **Bandwidth**: 100GB/month
- **Storage**: Ephemeral (files reset on restart)

---

## 🧪 **Testing Your Deployment**

### **1. Backend Health Check:**
Visit: `https://your-backend.onrender.com/`
Should return: `{"message": "Inventory Management API is running!"}`

### **2. Frontend Access:**
Visit: `https://your-frontend.onrender.com/`
Should load the login page

### **3. Test Login:**
- Username: `superadmin`
- Password: `admin123`

### **4. Test Profile Page:**
- Click username in navbar
- Should load profile page
- Try updating name/username

---

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **Build Fails:**
   - Check build logs in Render dashboard
   - Ensure all dependencies in `requirements.txt`
   - Verify Python version compatibility

2. **CORS Errors:**
   - Update CORS origins in `main.py`
   - Add your frontend URL to allowed origins
   - Redeploy backend after changes

3. **API Connection Issues:**
   - Verify `NEXT_PUBLIC_API_URL` environment variable
   - Check network tab in browser dev tools
   - Ensure backend is running and accessible

4. **Database Issues:**
   - Migration script runs during build
   - SQLite file is ephemeral on free tier
   - Consider PostgreSQL for persistent data

### **Logs Access:**
- **Render Dashboard** → Your Service → Logs tab
- Real-time logs for debugging

---

## 🎯 **Post-Deployment Checklist**

- ✅ Backend service running and accessible
- ✅ Frontend service running and accessible
- ✅ CORS configured correctly
- ✅ Environment variables set
- ✅ Database migration completed
- ✅ Login functionality working
- ✅ Profile page accessible
- ✅ API calls working between frontend/backend

---

## 🔄 **Updating Your Deployment**

1. **Make changes** to your code locally
2. **Test locally** to ensure everything works
3. **Commit and push** to your repository
4. **Render auto-deploys** from your main branch
5. **Monitor logs** for any deployment issues

---

## 💡 **Production Recommendations**

For production use, consider:

1. **Database**: Upgrade to PostgreSQL (Render offers free PostgreSQL)
2. **Environment**: Use separate staging/production environments
3. **Monitoring**: Set up health checks and alerts
4. **Security**: Use strong secret keys and HTTPS only
5. **Backup**: Regular database backups
6. **Performance**: Monitor and optimize for better response times

---

## 🎉 **You're Ready to Deploy!**

All configuration files are in place. Simply follow the deployment steps above, and your inventory automation system will be live on Render's free tier!

**Estimated Deployment Time**: 10-15 minutes
**Cost**: Free (with limitations)
**Maintenance**: Auto-deploys on git push

---

*Deployment guide created on October 20, 2025*
*All files configured for Render free tier deployment*
