const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use(cors());
app.use(express.json());

app.use("/api/sos", require("./routes/sos"));

io.on("connection", (socket) => {
  socket.on("location", (data) => {
    io.emit("location-update", data);
  });
});

server.listen(process.env.PORT, () => {
  console.log("Server running");
});
