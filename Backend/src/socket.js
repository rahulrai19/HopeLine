import { Server } from 'socket.io';
import { Message } from './models/Message.js';
import jwt from 'jsonwebtoken';

let io;

export function initializeSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "*", // allow all or restrict to frontend URL
      methods: ["GET", "POST"]
    }
  });

  // Optional: add socket middleware to verify JWT
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      socket.user = decoded; // { id, role, ... }
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.id} (${socket.user.role})`);

    // Join a specific chat room
    socket.on('join_room', async (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.user.id} joined room ${roomId}`);
    });

    // Handle sending a message
    socket.on('send_message', async (data) => {
      // data: { roomId, text, senderName }
      const { roomId, text, senderName } = data;

      try {
        // Save message to DB
        const newMessage = new Message({
          roomId,
          senderId: socket.user.id,
          senderName,
          senderRole: socket.user.role,
          text
        });
        await newMessage.save();

        // Broadcast to everyone in the room, including sender
        io.to(roomId).emit('receive_message', {
          _id: newMessage._id,
          roomId: newMessage.roomId,
          senderId: newMessage.senderId,
          senderName: newMessage.senderName,
          senderRole: newMessage.senderRole,
          text: newMessage.text,
          createdAt: newMessage.createdAt
        });
      } catch (err) {
        console.error("Socket error saving message:", err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.id}`);
    });
  });

  return io;
}
