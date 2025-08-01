# Deployment Guide for Render

This guide will help you deploy your ChatApp Java application to Render.

## Prerequisites

1. A GitHub repository with your code
2. A MongoDB Atlas account (free tier available)
3. A Render account (free tier available)

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a new cluster (free tier)
3. Create a database user with read/write permissions
4. Get your connection string from the "Connect" button
5. Replace `<password>` with your actual password

## Step 2: Deploy to Render

### Option A: Using Render Dashboard

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `chatapp-java` (or your preferred name)
   - **Environment**: `Java`
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/app-0.0.1-SNAPSHOT.jar`
   - **Plan**: Free

5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JAVA_VERSION`: `17`
   - `SPRING_PROFILES_ACTIVE`: `production`
   - `PORT`: `8080`

6. Click "Create Web Service"

### Option B: Using render.yaml (Recommended)

The project already includes a `render.yaml` file. Simply:

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Add your `MONGODB_URI` environment variable
6. Deploy

## Step 3: Configure Environment Variables

In your Render service dashboard, add these environment variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/chatapp?retryWrites=true&w=majority` | Your MongoDB connection string |
| `JAVA_VERSION` | `17` | Java runtime version |
| `SPRING_PROFILES_ACTIVE` | `production` | Spring Boot profile |
| `PORT` | `8080` | Application port |

## Step 4: Deploy Frontend (Optional)

If you want to deploy the React frontend as well:

1. Create a new "Static Site" service in Render
2. Connect to the same repository
3. Configure:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
4. Add environment variable:
   - `REACT_APP_API_URL`: Your backend service URL

## Troubleshooting

### Common Issues

1. **Build Fails with JAVA_HOME Error**
   - Ensure `JAVA_VERSION=17` is set in environment variables
   - The `system.properties` file should specify `java.runtime.version=17`
   - If using Maven wrapper, ensure `maven-wrapper.jar` is present in `.mvn/wrapper/`
   - Try using `mvn clean package -DskipTests` instead of `./mvnw` if wrapper fails

2. **MongoDB Connection Error**
   - Verify your `MONGODB_URI` is correct
   - Ensure your MongoDB Atlas cluster is accessible
   - Check if your IP is whitelisted in MongoDB Atlas

3. **Port Issues**
   - Render automatically sets the `PORT` environment variable
   - Your app should use `${PORT:8080}` in application.properties

4. **Maven Build Issues**
   - The project includes Maven wrapper files
   - If issues persist, try using `mvn clean package -DskipTests` instead of `./mvnw`

### Logs

Check the logs in your Render dashboard for detailed error messages.

## Environment Variables Reference

```bash
# Required
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp?retryWrites=true&w=majority

# Optional (with defaults)
JAVA_VERSION=17
SPRING_PROFILES_ACTIVE=production
PORT=8080
```

## Security Notes

- Never commit sensitive information like database passwords
- Use environment variables for all configuration
- Enable HTTPS in production (Render provides this automatically)
- Consider implementing proper authentication for production use

## Support

If you encounter issues:

1. Check the Render logs in your dashboard
2. Verify all environment variables are set correctly
3. Ensure your MongoDB Atlas cluster is running and accessible
4. Check the troubleshooting section above

Your application should be accessible at `https://your-app-name.onrender.com` once deployed successfully. 