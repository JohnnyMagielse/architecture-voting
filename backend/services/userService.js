import bcrypt from 'bcrypt';
import User from '../models/userModel.js';

export const register = async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const newUser = {
    ...user,
    password: hashedPassword
  };
  await User.create(newUser);
  return { message: 'Registration successful' };
};

export const getProfile = async (email) => {
  const user = await User.findByEmail(email);
  if (user) {
    const { password, ...profile } = user;
    return profile;
  } else {
    return null;
  }
};
