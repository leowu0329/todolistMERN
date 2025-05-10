import express from 'express';
import AuthRoute from './routes/auth.js';
import TodoRoute from './routes/todo.js';

const app = express();
const PORT = 3000;

app.use('/api/auth', AuthRoute);
app.use('/api/todos', TodoRoute);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
