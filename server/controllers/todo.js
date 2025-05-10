import { connectToDB } from '../utils/connect.js';
import { createError } from '../utils/error.js';
import Todo from '../models/todoModel.js';

export async function getAllTodos(req, res, next) {
  try {
    await connectToDB();
    console.log('User from request:', req.user);
    const todos = await Todo.find({ userID: req.user.id });
    res.status(200).json({ todos });
  } catch (error) {
    console.error('Error in getAllTodos:', error);
    next(error);
  }
}

export async function getTodo(req, res, next) {
  try {
    await connectToDB();
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return next(createError(404, 'Todo not found!'));
    }
    if (todo.userID.toString() !== req.user.id) {
      return next(createError(403, 'You are not authorized!'));
    }
    res.status(200).json({ todo });
  } catch (error) {
    console.error('Error in getTodo:', error);
    next(error);
  }
}

export async function updateTodo(req, res, next) {
  try {
    const id = req.params.id;
    if (!req.body) {
      return next(createError(400, 'Missing fields!'));
    }

    await connectToDB();
    const todo = await Todo.findById(id);

    if (!todo) {
      return next(createError(404, 'Todo not found!'));
    }

    if (todo.userID.toString() !== req.user.id) {
      return next(createError(403, 'Not authorized!'));
    }

    if (req.body.title) {
      todo.title = req.body.title;
    }

    if (req.body.isCompleted !== undefined) {
      todo.isCompleted = req.body.isCompleted;
    }

    const updatedTodo = await todo.save();
    res.status(200).json({
      message: 'Todo updated successfully',
      todo: updatedTodo,
    });
  } catch (error) {
    console.error('Error in updateTodo:', error);
    next(error);
  }
}

export async function deleteTodo(req, res, next) {
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
    console.error('Error in deleteTodo:', error);
    next(error);
  }
}

export async function addTodo(req, res, next) {
  try {
    console.log('Add todo request:', {
      body: req.body,
      user: req.user,
    });

    if (!req.body || !req.body.title) {
      return next(createError(400, 'Title is required!'));
    }

    await connectToDB();
    const newTodo = new Todo({
      title: req.body.title,
      userID: req.user.id,
      isCompleted: false,
    });

    const savedTodo = await newTodo.save();
    console.log('New todo created:', savedTodo);

    res.status(201).json({
      message: 'Todo created successfully',
      todo: savedTodo,
    });
  } catch (error) {
    console.error('Error in addTodo:', error);
    next(error);
  }
}
