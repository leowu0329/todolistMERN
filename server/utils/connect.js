import mongoose from 'mongoose';

const connection = { isConnected: null };

export const connectToDB = async () => {
  try {
    if (connection.isConnected) {
      console.log('Using existing database connection');
      return;
    }

    // 打印连接URI（隐藏敏感信息）
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    console.log('Connecting to MongoDB...', uri.replace(/\/\/.*@/, '//*****@'));

    const db = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    connection.isConnected = db.connections[0].readyState;
    console.log('MongoDB Connection State:', connection.isConnected);

    // 添加数据库事件监听器
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      connection.isConnected = false;
    });
  } catch (error) {
    console.error('Could not connect to database:', error);
    connection.isConnected = false;
    throw error;
  }
};
