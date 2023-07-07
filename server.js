const next = require('next')
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const socket = require('./src/config-api/socket');

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()


app.prepare()
.then(() => {
  const server = express()

  server.set('views', path.join(__dirname + "\\src", 'views'));
  server.set('view engine', 'jade');
  
  server.use(logger('dev'));
  server.use(express.json());
  server.use(express.urlencoded({ extended: false }));
  server.use(cookieParser());
  server.use(cors());

  const mongoUri = process.env.MONGODB_URL;
  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
  require('./src/models/User');
  require("./src/config-api/passport");

  server.use(require("./src/routes"));
  
  // catch 404 and forward to error handler
  // server.use(function(req, res, next) {
  //   next(createError(404));
  // });
  
  // error handler
  server.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  
  const port = process.env.PORT || 3000;
  
  server.get('*', (req, res) => {
    return handle(req, res)
  })
  const listenedServer = server.listen(port, () => {console.log(`listening on *:${port}`);});
  socket(listenedServer);
  
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
