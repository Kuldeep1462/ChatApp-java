# Real-Time Chat Application

A modern real-time chat application built with Spring Boot (Java) backend and React frontend. Features include global chat rooms, private messaging, user authentication, and persistent message storage using MongoDB.

## 🚀 Features

- **Real-time Messaging**: Instant message delivery using WebSocket technology
- **Global Chat Room**: Public chat room for all users
- **Private Messaging**: Direct messaging between users
- **Message Persistence**: All messages are stored in MongoDB
- **User Authentication**: Secure user login system
- **Responsive Design**: Modern, mobile-friendly UI
- **Message History**: View past conversations and global chat history

## 🛠️ Tech Stack

### Backend
- **Spring Boot 3.3.5** - Java framework
- **Java 17** - Programming language
- **WebSocket** - Real-time communication
- **MongoDB** - NoSQL database
- **Maven** - Build tool
- **Lombok** - Java annotation processor

### Frontend
- **React 19** - JavaScript library
- **CSS3** - Styling
- **npm** - Package manager

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Java 17** or higher
- **Node.js 16** or higher
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)
- **Maven** (optional, project includes Maven wrapper)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/real-time-chat-app.git
cd real-time-chat-app
```

### 2. Set Up MongoDB

You can use either a local MongoDB instance or MongoDB Atlas (cloud):

#### Option A: Local MongoDB
1. Install MongoDB on your system
2. Start MongoDB service
3. Create a database named `chatapp`

#### Option B: MongoDB Atlas (Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp?retryWrites=true&w=majority
```

**Important**: Replace `username`, `password`, and `cluster.mongodb.net` with your actual MongoDB credentials.

### 4. Start the Backend

```bash
# Navigate to the project root
cd chatapp-java

# Run the Spring Boot application
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

### 5. Start the Frontend

Open a new terminal window:

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

The frontend will start on `http://localhost:3000`

## 📁 Project Structure

```
chatapp-java/
├── src/
│   └── main/
│       ├── java/com/chat/app/
│       │   ├── AppApplication.java          # Main Spring Boot application
│       │   ├── config/
│       │   │   └── WebSocketConfig.java     # WebSocket configuration
│       │   ├── controller/
│       │   │   ├── ChatController.java      # Chat API endpoints
│       │   │   └── UserController.java      # User management
│       │   ├── model/
│       │   │   ├── ChatMessage.java         # Message entity
│       │   │   └── User.java                # User entity
│       │   └── repository/
│       │       ├── ChatMessageRepository.java
│       │       └── UserRepository.java
│       └── resources/
│           ├── application.properties       # Application configuration
│           └── templates/
│               └── chat.html                # Chat template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js                     # Login component
│   │   │   ├── Navbar.js                    # Navigation bar
│   │   │   └── Sidebar.js                   # Chat sidebar
│   │   ├── style/
│   │   │   ├── chat.css                     # Chat styles
│   │   │   ├── login.css                    # Login styles
│   │   │   ├── navbar.css                   # Navbar styles
│   │   │   └── sidebar.css                  # Sidebar styles
│   │   └── App.js                           # Main React component
│   └── package.json                         # Frontend dependencies
├── pom.xml                                  # Maven configuration
└── README.md                                # This file
```

## 🔧 Configuration

### Backend Configuration

The main configuration file is `src/main/resources/application.properties`:

```properties
spring.application.name=app
spring.data.mongodb.uri=${MONGODB_URI}
```

### Frontend Configuration

The frontend is configured to proxy API requests to the backend. See `frontend/package.json`:

```json
{
  "proxy": "http://localhost:8080"
}
```

## 📡 API Endpoints

### WebSocket Endpoints
- `/topic/global` - Global chat messages
- `/topic/messages` - Private messages
- `/app/sendMessage` - Send message endpoint

### REST API Endpoints
- `GET /api/chat/history/{user}` - Get user's chat history
- `GET /api/chat/history/global` - Get global chat history
- `GET /api/chat/contacts/{user}` - Get user's contacts

## 🎯 Usage

1. **Login**: Enter your username to join the chat
2. **Global Chat**: Send messages to the global chat room
3. **Private Messages**: Click on a user in the sidebar to start a private conversation
4. **Message History**: View your previous conversations

## 🔒 Security Notes

- Never commit your `.env` file to version control
- Use strong passwords for your MongoDB database
- Consider implementing JWT authentication for production use
- Enable HTTPS in production

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify your MongoDB URI in the `.env` file
   - Ensure MongoDB is running
   - Check network connectivity

2. **Port Already in Use**
   - Backend: Change port in `application.properties`
   - Frontend: React will automatically suggest an alternative port

3. **Build Errors**
   - Ensure Java 17+ is installed
   - Run `./mvnw clean install` to rebuild
   - Check Maven dependencies

### Logs

Check the console output for detailed error messages and debugging information.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the amazing frontend library
- MongoDB for the robust database solution

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed information

---

**Happy Chatting! 🎉** 
