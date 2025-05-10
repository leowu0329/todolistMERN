import express from 'express';
import {
  getAllTodos,
  getTodo,
  updateTodo,
  deleteTodo,
  addTodo,
} from '../controllers/todo.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// 添加日志中间件
router.use((req, res, next) => {
  console.log('Todo route accessed:', {
    method: req.method,
    path: req.path,
    body: req.body,
    user: req.user,
  });
  next();
});

router.get('/', verifyToken, getAllTodos);

router.post('/', verifyToken, addTodo);

router.put('/:id', verifyToken, updateTodo);

router.get('/:id', verifyToken, getTodo);

router.delete('/:id', verifyToken, deleteTodo);

export default router;
