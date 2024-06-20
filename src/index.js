try {
  const logger = require('./middleware/logger.js');
  const http = require('http');
  const { createServer } = http;

  const { Server } = require('socket.io');
  const { initializeSocketIO } = require('./lib/socket/socket-manager.js');
  const app = require('./app.js');
  const config = require('./config/config.js');

  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    pingTimeout: 60000,
    cors: {
      origin: '*',
      credentials: true,
    },
  });

  initializeSocketIO(io);

  app.set('io', io); // using set method to mount the `io` instance on the app to avoid usage of `global`

  httpServer.listen(config.port, () => {
    logger.log('info', `Server is running on Port: ${config.port}`);
  });

  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received.');
    logger.info('Closing http server.');
    httpServer.close((err) => {
      logger.info('Http server closed.');
      process.exit(err ? 1 : 0);
    });
  });
} catch (err) {
  console.log(err);
}
