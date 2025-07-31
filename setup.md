# Quick Setup Guide

## 1. Environment Setup

Create a `.env` file in the root directory with your MongoDB connection string:

```bash
# Copy the example and configure with your credentials
cp .env.example .env
```

Edit the `.env` file:
```env
MONGODB_URI=mongodb+srv://yourusername:yourpassword@yourcluster.mongodb.net/chatapp?retryWrites=true&w=majority
```

## 2. Start the Application

### Backend (Terminal 1)
```bash
./mvnw spring-boot:run
```

### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm start
```

## 3. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

## 4. Test the Application

1. Open http://localhost:3000 in your browser
2. Enter a username to login
3. Start chatting in the global room
4. Try private messaging with other users

## Troubleshooting

- **MongoDB Connection Error**: Check your `.env` file and MongoDB credentials
- **Port Already in Use**: React will automatically suggest an alternative port
- **Build Errors**: Ensure Java 17+ and Node.js 16+ are installed

For detailed instructions, see the main [README.md](README.md) file. 