import { createError } from '../utils/error.js';
import { connectToDB } from '../utils/connect.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function register(req, res, next) {
  console.log('Register attempt:', {
    body: req.body,
    headers: req.headers,
  });

  const data = req.body;
  if (!data.email || !data.password) {
    console.log('Missing fields:', {
      email: !!data.email,
      password: !!data.password,
    });
    return next(createError(400, 'Missing fields'));
  }

  try {
    await connectToDB();
    console.log('Database connected successfully');

    const alreadyRegistered = await User.exists({ email: data.email });
    if (alreadyRegistered) {
      console.log('User already exists:', data.email);
      return next(createError(400, 'User already registered'));
    }

    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hash,
    });

    const savedUser = await newUser.save();
    console.log('User registered successfully:', savedUser);

    res.status(201).json({
      status: 'success',
      message: 'User created Successfully',
      data: savedUser,
    });
  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
}

export async function login(req, res, next) {
  console.log('Login attempt:', {
    body: req.body,
    headers: req.headers,
    cookies: req.cookies,
  });

  const data = req.body;
  if (!data.email || !data.password) {
    console.log('Missing fields:', {
      email: !!data.email,
      password: !!data.password,
    });
    return next(createError(400, 'Missing fields'));
  }

  try {
    await connectToDB();
    console.log('Database connected successfully');

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.log('User not found:', req.body.email);
      return next(createError(404, 'Invalid credentials'));
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!isPasswordValid) {
      console.log('Invalid password for user:', req.body.email);
      return next(createError(404, 'Invalid credentials'));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT);
    console.log('Login successful, token generated:', token);

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
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
}

export async function logout(req, res, next) {
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

export async function check(req, res, next) {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, 'Not authenticated'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(createError(404, 'User not found'));
    }
    res.status(200).json({
      status: 'success',
      message: 'User is authenticated',
      data: user,
    });
  } catch (err) {
    return next(createError(401, 'Invalid token'));
  }
}
