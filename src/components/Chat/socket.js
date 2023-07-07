import io from "socket.io-client";
import constants from "../../config/constants";

let socket;
export const initiateSocket = (userId) => {
  socket = io(constants.BASE_URL.replace('api/v1', ''), {transports : ['websocket'], query: {userId}});
};

export const disconnectSocket = () => {
  if(socket) socket.disconnect();
};

export const refreshMessages = (cb) => {
  if (socket) socket.on('refreshConversation', cb);
};

export const createChat = (data) => {
  if (socket) socket.emit('createChat', data);
};

export const newChat = (cb) => {
  if (socket) socket.on('newChat', cb);
};
