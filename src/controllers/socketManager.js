import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  // Making connection
  io.on("connection", (socket) => {
    // calls on socket
    socket.on("join-call", (path) => {
      if (!connections[path]) {
        connections[path] = [];
      }

      connections[path].push(socket.id);
      timeOnline[socket.id] = new Date();

      // Notify existing users
      connections[path].forEach((id) => {
        io.to(id).emit("user-joined", socket.id, connections[path]);
      });

      if (!messages[path]) {
        messages[path] = [];
      }

      // Send chat history to the new user
      messages[path].forEach((msg) => {
        io.to(socket.id).emit(
          "chat-message",
          msg["data"],
          msg["sender"],
          msg["socket-id-sender"]
        );
      });
    });

    // signal on socket
    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    // chat on socket
    socket.on("chat-message", (data, sender) => {
      let matchingRoom = null;

      for (const [roomKey, users] of Object.entries(connections)) {
        if (users.includes(socket.id)) {
          matchingRoom = roomKey;
          break;
        }
      }

      if (matchingRoom) {
        if (!messages[matchingRoom]) {
          messages[matchingRoom] = [];
        }

        const msgObj = {
          sender,
          data,
          "socket-id-sender": socket.id,
        };

        messages[matchingRoom].push(msgObj);
        console.log("message", matchingRoom, ":", sender, data);

        connections[matchingRoom].forEach((id) => {
          io.to(id).emit("chat-message", data, sender, socket.id);
        });
      }
    });

    // disconnect socket
    socket.on("disconnect", () => {
      const diffTime = Math.abs(new Date() - timeOnline[socket.id]);
      console.log(`Socket ${socket.id} was online for ${diffTime}ms`);

      for (const [roomKey, users] of Object.entries(connections)) {
        if (users.includes(socket.id)) {
          // Notify others in the room
          users.forEach((id) => {
            io.to(id).emit("user-left", socket.id);
          });

          // Remove user
          connections[roomKey] = users.filter((id) => id !== socket.id);

          // If no one left, clean up
          if (connections[roomKey].length === 0) {
            delete connections[roomKey];
          }
        }
      }

      delete timeOnline[socket.id];
    });
  });

  return io;
};
