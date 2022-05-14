import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader.split('Bearer ')[1];

  try {
    const verify = jwt.verify(token, process.env.JWT_KEY);
    return res.status(200).json(verify);
  } catch (error) {
    return res.status(401).json(error);
  }
}
