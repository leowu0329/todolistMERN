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
export async function login(reg, res, next) {
  const data = reg.body;
  console.log(data);
  if (!data.email || !data.password) {
    return next(createError(400, 'Missing fields'));
  }
  await connectDB();
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(createError(404, 'Invalid credentials'));
  }
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password,
  );
  if (!isPasswordValid) {
    return next(createError(404, 'Invalid credentials'));
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT);
  console.log(token);
  res
    .cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    .status(200)
    .json({
      status: 'success',
      message: 'User logged in Successfully',
      data: user,
    });
}
export async function logout(reg, res, next) {
  res
    .clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    .status(200)
    .json({
      status: 'success',
      message: 'User logged out Successfully',
    });
}
