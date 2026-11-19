import { io } from 'socket.io-client';

const SERVER_URL = 'http://' + window.location.hostname + ':3001';

export const socket = io(SERVER_URL);
export default socket;