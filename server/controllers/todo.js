import { connectToDB } from '../utils/connect.js';
import { createError } from '../utils/error.js';
import Todo from '../models/todoModel.js';

export async function getAllTodos(res, req, next) {
  await connectToDB();
  const todos = await Todo.find({ userId: req.user.id });
  res.status(200).send(todos);
}
export async function getTodo(res, req, next) {
  try {
    await connectToDB();
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return next(createError(404, 'Todo not found!'));
    }
    if (todo.userID.toString() !== req.user.id) {
      return next(createError(403, 'You are not authorized!'));
    }
    res.status(200).send(todo);
  } catch (error) {
    next(createError(400, 'Todo not found!'));
  }
}
export async function updateTodo(res, req, next) {
  const id = req.params.id;
  if (!req.body) {
    return next(createError(404, 'Missing fields!'));
  }
  try {
    await connectToDB();
    const todo = await Todo.findById(id);
    if (todo.userID.toString() !== req.user.id) {
      return next(createError(404, 'Not authorized!'));
    }
    todo.title = req.body.title || todo.title;
    if (req.body.isCompleted !== undefined) {
      todo.isCompleted = req.body.isCompleted;
    }
    await todo.save();
    res.status(200).json({ message: 'Todo updated successfully' });
  } catch (error) {
    return next(createError(404, 'Todo not found!'));
  }
}
export async function deleteTodo(res, req, next) {
  try {
    await connectToDB();
    const todo = await Todo.deleteOne({
      _id: req.params.id,
      userID: req.user.id,
    });
    if (!todo.deletedCount) {
      return next(createError(404, 'Todo not found!'));
    }
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    return next(createError(404, 'Todo not found!'));
  }
}
export async function addTodo(res, req, next) {
  console.log(req.body);
  if (!req.body || !req.body.title) {
    return next(createError(400, 'Title is required!'));
  }
  await connectToDB();
  const newTodo = new Todo({
    title: req.body.title,
    userID: req.user.id,
  });
  await newTodo.save();
  res.status(201).json(newTodo);
}
