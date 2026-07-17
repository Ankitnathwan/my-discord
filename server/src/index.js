require('dotenv').config()
const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const serverRoutes = require('./routes/servers')
const channelRoutes = require('./routes/channels')
const messageRoutes = require('./routes/messages')
const http = require('http')
const { Server } = require('socket.io')
const prisma = require('./config/prisma')
const uploadRoutes = require("./routes/uploads");

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST']
  }
})

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}))

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/servers', serverRoutes)
app.use('/api/channels', channelRoutes)
app.use('/api/messages', messageRoutes)
app.use("/api/uploads", uploadRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

const onlineUsers = new Map();

io.on('connection', (socket) => {
  socket.on('join_channel', (channelId) => {
    socket.join(channelId);
  });

  socket.on("user_online", (userId) => {
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    onlineUsers.get(userId).add(socket.id);

    io.emit("online_users", [...onlineUsers.keys()]);
  });

  socket.on("get_online_users", () => {
    socket.emit("online_users", [...onlineUsers.keys()]);
  });

  socket.on("typing_start", ({ channelId, user }) => {
    socket.to(channelId).emit("user_typing", user);
  });

  socket.on("typing_stop", ({ channelId, user }) => {
    socket.to(channelId).emit("user_stop_typing", user);
  });

  socket.on("send_message", async ({ channelId, content, imageUrl, userId }) => {
    try {
      if (!content?.trim() && !imageUrl) {
        return;
      }

      const message = await prisma.message.create({
        data: {
          channelId,
          userId,
          content: content?.trim() || "",
          imageUrl,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
            },
          },
        },
      });

      io.to(channelId).emit("new_message", message);
    } catch (err) {
      console.error("Message error:", err);
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, sockets] of onlineUsers.entries()) {
      sockets.delete(socket.id);

      if (sockets.size === 0) {
        onlineUsers.delete(userId);
      }
    }

    io.emit("online_users", [...onlineUsers.keys()]);
  });

})

const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
