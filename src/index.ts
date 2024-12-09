import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket,
    roomId: string
}

let allUser: User[] = [];

wss.on("connection", (socket) => {
    socket.on("error", console.log);
    socket.on("message", (message) => {
        //@ts-ignore
        const parsedMsg = JSON.parse(message);

        if(parsedMsg.type === "join"){
            allUser.push(
                {socket, 
                roomId: parsedMsg.payload.roomId
            })
        }

        if(parsedMsg.type === "chat")
        {
            const user = allUser.find((x) => x.socket == socket)
            if (!user) {
                socket.send(JSON.stringify({type: "error", payload: "User not found"}))
                return;
            }
            const roomId = user.roomId;

            const usersInRoom = allUser.filter((x) => x.roomId === roomId);
            usersInRoom.forEach((user) => {
                user.socket.send(JSON.stringify({ type: "chat", payload: chatMessage }));
            })
        }
    })
})
