import { Socket, io } from "socket.io-client";

const socket: Socket = io(`${process.env.REACT_APP_API}`);

console.log("socket init");

export default socket;
