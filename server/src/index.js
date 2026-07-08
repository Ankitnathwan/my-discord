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

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

io.on('connection', (socket) => {
  console.log('User connected: ', socket.id)

  socket.on('join_channel', (channelId) => {
    socket.join(channelId);
  })

  socket.on('send_message', async ({ channelId, content, userId }) => {
    try {
      const message = await prisma.message.create({
        data: { channelId, userId, content },
        include: {
          user: {
            select: { id: true, username: true, displayName: true }
          }
        }
      })
      io.to(channelId).emit('new_message', message)
    } catch (err) {
      console.error('Message error:', err)
    }
  })

  socket.on('disconnect', () => {
    console.log('User disconnected: ', socket.id)
  })
})

const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})