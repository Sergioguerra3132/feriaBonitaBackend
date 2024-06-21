const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const WebSocketSingleton = require('../middlewares/WebSocketSingleton');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');

const startServer = (app) => {

  // https.createServer({
  //   key: fs.readFileSync('/etc/letsencrypt/live/api.truecity.texelbit.com/privkey.pem'),
  //   cert: fs.readFileSync('/etc/letsencrypt/live/api.truecity.texelbit.com/cert.pem'),
  //   ca: fs.readFileSync('/etc/letsencrypt/live/api.truecity.texelbit.com/chain.pem')

  // }, app).listen(process.env.PORT, function(){
  //   console.log("My HTTPS server listening on port " + process.env.PORT + "...");
  // });
  
  const port = process.env.PORT || 3000;
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  WebSocketSingleton.init(server);
};




module.exports = () => {
  const app = express();

  app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

  app.use(express.json());
  //app.use(helmet());
  app.use(cors());
  app.use(express.static('public'));
  // Start the server
  startServer(app);

  return app;
};
