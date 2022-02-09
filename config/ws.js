const { WebSocketServer } = require("ws");

let sockets = [];

module.exports = (app) => {
    //create a websocket server using the http server.
    const wss = new WebSocketServer({
        server: app,
        clientTracking: false,
    });

    //set up all the events for wss.
    wss.on('connection', (ws) => {

        //Add the new socket to the list of all the sockets.
        sockets = [
            ...sockets,
            ws
        ];

        console.log(`[connection] Number of clients connected to the server: ${sockets.length}`);

        // sending message
        ws.on("message", (data, isBinary) => {
            console.log(`[connection] Client has sent a message.`);
            sockets.forEach(socket => {
                if ((socket !== ws) && (socket.readyState === socket.OPEN)) {
                    socket.send(data, {
                        binary: isBinary
                    });
                }
            });
        });

        // handling client connection error
        ws.on('error', (error) => {
            console.log(`[connection] Some error occurred: ${JSON.stringify(error)}`);
        });

        // handling what to do when clients disconnects from server
        ws.on("close", () => {
            console.log(`[connection] A client has been disconnected from the server.`);
            sockets = sockets.filter(socket => {
                return (socket !== ws);
            })
            console.log(`[connection] Number of clients connected to the server: ${sockets.length}`)
        });
    });

    wss.on('error', (error) => {
        console.log(`[error] Error connecting to the server ${error}.`);
    });

    wss.on('listening', () => {
        console.log(`[listening] Listening to the Server.`);
    });

    wss.on('close', () => {
        console.log(`[close] The Server is closed.`);
    });
};

//https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code