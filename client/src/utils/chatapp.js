//create a websocket to open communication between client and server
const chatapp = new WebSocket(`ws://localhost:4000`);

chatapp.onopen = () => {
    console.log(`[open] Successfully connected to the chat server.`);
};

chatapp.onclose = () => {
    console.log(`[close] Connection to server is lost.`);
};

chatapp.onerror = (error) => {
    console.log(`[error] Something went wrong on the server: ${JSON.stringify(error)}.`);
};

export default chatapp;