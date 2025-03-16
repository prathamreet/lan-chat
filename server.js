const WebSocket = require("ws");

const PORT = 8080;
const server = new WebSocket.Server({ port: PORT });

let clients = {}; // Store connected clients { ip: { name, system, socket } }

// **Handle new connections**
server.on("connection", (socket, req) => {
    const ip = req.socket.remoteAddress;
    console.log(`✅ New connection from ${ip}`);

    // **Track client details (set default if discovery didn't update)**
    clients[ip] = { name: "Unknown", system: "Unknown", socket };

    // **Send welcome message with stats**
    updateClientStats();

    // **Handle messages from clients**
    socket.on("message", (msg) => {
        const message = msg.toString();
        console.log(`📩 Message from ${ip}:`, message);

        // **Check if it's an update from peer discovery**
        if (message.startsWith("PEER_UPDATE|")) {
            const [, name, system] = message.split("|");
            clients[ip].name = name;
            clients[ip].system = system;
            console.log(`🔄 Updated Peer: ${name} (${system}) @ ${ip}`);
            updateClientStats();
            return;
        }

        // **Broadcast messages to all clients**
        broadcastMessage(ip, message);
    });

    // **Handle disconnection**
    socket.on("close", () => {
        console.log(`❌ Disconnected: ${clients[ip]?.name || "Unknown"} (${ip})`);
        delete clients[ip];
        updateClientStats();
    });
});

// **Broadcast function**
function broadcastMessage(senderIP, message) {
    Object.keys(clients).forEach((ip) => {
        if (ip !== senderIP) {
            clients[ip].socket.send(`📢 ${clients[senderIP].name}: ${message}`);
        }
    });
}

// **Update all clients with stats**
function updateClientStats() {
    const clientList = Object.values(clients).map(
        (c) => `${c.name} (${c.system})`
    );

    const statsMessage = `👥 Active Users: ${clientList.length}\n${clientList.join("\n")}`;
    console.log(statsMessage);

    // **Send stats to all connected clients**
    Object.values(clients).forEach((c) => c.socket.send(statsMessage));
}

// **Start server**
console.log(`🚀 Server running on ws://localhost:${PORT}`);
