const WebSocket = require("ws");
const os = require("os");
const bonjour = require("bonjour")();
const readline = require("readline");

let ws;
let username;

// Create a readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Prompt user for a username
rl.question("Enter your username: ", (name) => {
    username = name.trim() || `Guest-${Math.floor(Math.random() * 1000)}`;
    connectToServer();
});

function connectToServer() {
    // Discover WebSocket server using Bonjour
    bonjour.find({ type: "ws" }, (service) => {
        console.log(`✅ Found server at ws://${service.referer.address}:${service.port}`);
        ws = new WebSocket(`ws://${service.referer.address}:${service.port}`);

        ws.on("open", () => {
            console.log("🔗 Connected to the chat server!");
            ws.send(JSON.stringify({
                type: "userDetails",
                username,
                device: os.hostname(), // Send device name
            }));

            // Start reading messages
            startChat();
        });

        ws.on("message", (data) => {
            try {
                const msg = JSON.parse(data);
                if (msg.type !== "requestDetails") {
                    console.log(`📩 ${msg.sender}: ${msg.message}`);
                }
            } catch (error) {
                console.error("❌ Error parsing message:", error);
            }
        });

        ws.on("close", () => {
            console.log("❌ Disconnected from server.");
            rl.close();
        });
    });
}

// Function to handle user input and send messages
function startChat() {
    rl.on("line", (input) => {
        const message = input.trim();
        if (message && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "message", text: message }));
        }
    });
}
