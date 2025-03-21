# LAN Chat Application

A lightweight, real-time LAN-based chat application using WebSockets and UDP Broadcast for peer discovery. This allows users on the same network to communicate without requiring a central server or internet access.

## Features

✅ Real-time chat using WebSockets✅ Automatic peer discovery with UDP Broadcast✅ Supports multiple clients on the same network✅ Displays system name, username, and IP address✅ Terminal-based chat interface✅ Minimal dependencies & easy setup

## Installation & Setup

1️⃣ Clone the Repository
```
git clone https://github.com/your-username/lan-chat.git
cd lan-chat
```
2️⃣ Install Dependencies
```
npm install
```
3️⃣ Run the Server
```
node server.js
```
4️⃣ Run the Client 
On each device, run:
```
node client.js
```
Now, you can chat with others on the same network! 🎉

## How It Works

### Peer Discovery

Uses UDP Broadcast to announce each client’s presence to others on the network.

Clients listen for broadcast messages to detect available peers.

### Messaging

Clients establish WebSocket connections with the discovered server.

Messages are sent and received in real time.

Usernames and device names are displayed instead of IP addresses.

### Example Output

On Server Start:
```
🚀 WebSocket Server running on ws://192.168.1.10:8080
🔍 Listening for peers...
```
When a Client Connects:
```
👤 New Client Connected: Electro (LAPTOP-XYZ) @ 192.168.1.12
Total Clients: 2
```
Chat Example:
```
[Electro]: Hey, what's up?
[Astra]: All good! You?
```
Dependencies

- ws (WebSockets)

- dgram (UDP Broadcasting)

- os (System Info)

- bonjour

- bonjour-service

- multicast-dns

- readline

### Contributing

Pull requests are welcome! Feel free to submit bug reports, feature requests, or contribute improvements. 😊







