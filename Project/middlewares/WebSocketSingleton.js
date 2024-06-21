let wss = null;

exports.init = (server) => {
  const WebSocketServer = require('../config/WebSocketServer'); // Make sure this path is correct
  wss = new WebSocketServer(server);
};

exports.getWebSocketServer = () => {
    if (!wss) {
      throw new Error('WebSocketServer has not been initialized yet.');
    }
    return wss;
  };

