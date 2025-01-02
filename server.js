const log = console.log;
const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const port = '3456';
const cookieParser = require('cookie-parser');

const ejs = require('ejs');
ejs.delimiter='?';

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use('/order', require('./src/router/shared'));
app.use('/', require('./src/router/router'));
app.listen(port, ()=>log(`Server running at http://localhost:${port} PID: ${process.pid} `));

module.exports=app;