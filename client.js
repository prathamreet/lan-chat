const WebSocket = require("ws");
const os = require("os");

const SERVER_URL = "ws://localhost:8080";
const socket = new WebSocket(SERVER_URL);

const peerName = "Electro"; // Set your name
const systemName = os.hostname(); // Get system name

socket.on("open", () => {
    console.log("✅ Connected to server");
    socket.send(`PEER_UPDATE|${peerName}|${systemName}`);
});

socket.on("message", (msg) => {
    console.log("📩 Server:", msg.toString());
});

socket.on("close", () => {
    console.log("❌ Disconnected from server");
});

// **Send test message from terminal**
process.stdin.on("data", (data) => {
    socket.send(data.toString().trim());
});
