const express = require("express");
const morgan = require("morgan");
const employeeRouter = require('./routes/employeeRoute');
const eventRouter = require('./routes/eventRoute');
const adminRouter = require('./routes/adminRoute');
const globalErrorHandler = require("./controller/errorController");
const attendance = require('./routes/attendenceRoute');
const multer = require('multer');

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // File name
  },
});
const upload = multer({ storage: storage });


// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/employee',employeeRouter);
app.use('/api/v1/event',eventRouter);
app.use('/api/v1/admin',adminRouter);
app.use('/api/v1/attendance',attendance);


app.post('/api/testing', upload.single('file'), (req, res) => {
  console.log(req.url);
  console.log(req.body);
  console.log(req.file);
  console.log('File Data:', req.file); 
  res.send('Welcome to the Employee Management System!');
});

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });

app.use(globalErrorHandler);
  
module.exports = app;
  