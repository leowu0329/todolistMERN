import { createError } from '../utils/error.js';
import { connectDB } from '../utils/connect.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

export async function register(reg, res, next) {
  const data = reg.body;
  console.log(data);

  if (!data.email || !data.password) {
    return next(createError(400, 'Missing fields'));
  }
  await connectDB();
  const alreadyRegistered = await User.exists({ email: data.email });
  if (alreadyRegistered) {
    return next(createError(400, 'User already registered'));
  }
  const salt = bcrypt.genSalt(10);
  const hash = bcrypt.hashSync(q.body.password, salt);
  const newUser = new User({
    ...req.body,
    password: hash,
  });
  await newUser.save();
  res.status(201).json({
    status: 'success',
    message: 'User created Successfully',
    data: newUser,
  });
}
export async function login(reg, res, next) {}
export async function logout(reg, res, next) {}
