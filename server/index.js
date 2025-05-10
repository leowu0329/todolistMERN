import express from 'express';
import AuthRoute from './routes/auth.js';
import TodoRoute from './routes/todo.js';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectToDB } from './utils/connect.js';

const app = express();
const PORT = 3000;

dotenv.config();

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

// 添加请求日志中间件
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api/auth', AuthRoute);
app.use('/api/todos', TodoRoute);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// 错误处理中间件
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  console.error('Error:', err);
  res.status(statusCode).json({ error: message });
});

// 404 处理中间件
app.use((req, res) => {
  console.log('404 Not Found:', req.method, req.path);
  res.status(404).json({ error: 'Not Found' });
});

// 启动服务器
const startServer = async () => {
  try {
    await connectToDB();
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
