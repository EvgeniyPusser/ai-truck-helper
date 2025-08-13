# 🧙‍♂️ HolyMove - Render Deployment Guide

## ✅ Pre-Deployment Checklist

### 1. **Environment Variables (Set in Render Dashboard)**
```bash
NODE_ENV=production
PORT=10000
JWT_SECRET=your_jwt_secret_here
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=openrouter/anthropic/claude-3.5-sonnet
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1/chat/completions
CLIENT_ORIGIN=https://your-app-name.onrender.com
```

### 2. **Render Settings**
- **Build Command**: `npm ci`
- **Start Command**: `node server/index.js`
- **Node Version**: 18+ (automatically detected from package.json engines)
- **Environment**: Node
- **Health Check Path**: `/health`

### 3. **Repository Setup**
- ✅ Push all changes to GitHub
- ✅ Connect GitHub repo to Render
- ✅ Branch: `main` or `dev`

### 4. **Files Ready for Deployment**
- ✅ `package.json` - optimized for production
- ✅ `render.yaml` - deployment configuration
- ✅ `Procfile` - backup start command
- ✅ `server/index.js` - binds to 0.0.0.0
- ✅ CORS configured for .onrender.com domains

### 5. **Manual Deploy Steps**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - **Name**: `holymove-api`
   - **Branch**: `main` or `dev`
   - **Build Command**: `npm ci`
   - **Start Command**: `node server/index.js`
5. Add Environment Variables (see section 1)
6. Click "Create Web Service"

### 6. **Common Issues & Solutions**

**Build Fails:**
- Check Node.js version compatibility
- Ensure all dependencies are in `dependencies`, not `devDependencies`

**Start Fails:**
- Verify start command points to correct file
- Check if all required environment variables are set

**CORS Issues:**
- Add your Render domain to `CLIENT_ORIGIN`
- Check `allowedOrigins` in `server/app.js`

**API Not Responding:**
- Check health endpoint: `https://your-app.onrender.com/health`
- Verify server binds to `0.0.0.0`, not `localhost`

### 7. **Post-Deployment Testing**
```bash
# Test health endpoint
curl https://your-app-name.onrender.com/health

# Test login
curl -X POST https://your-app-name.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client1@test.com","password":"password123"}'
```

### 8. **Frontend Configuration**
Update `public/app.js` baseURL for production:
```javascript
this.baseURL = 'https://your-app-name.onrender.com/api';
```

## 🎉 Success!
Your HolyMove AI Moving Assistant should now be live on Render!
