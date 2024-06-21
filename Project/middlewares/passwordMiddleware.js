const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Middleware to hash password
exports.hashPassword = async (password) => {

  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.log(error);
    throw new Error('Failed to hash password');
  }
};

exports.generateRandomCode= async (req) =>{
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = req;
  for (let i = 0; i < charactersLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  console.log(result)
  return result;
}


exports.generateJWT = (payload, expiresIn) => {
  // expiresIn can be something like '1h', '2d', '10m', etc.
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  return token;
};

exports.generateCurrencyJWT = (payload, expiresIn) => {
  // expiresIn can be something like '1h', '2d', '10m', etc.
  const token = jwt.sign(payload, process.env.CURRENCY_SECRET, { expiresIn });
  return token;
};

exports.generateRandomWebSocketId= async (req) =>{
  return uuidv4();
}



