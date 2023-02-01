import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;
const generateToken = (data:Object) => {
    return jwt.sign(data, secret);

}

const verifyToken = (token:string) => {
    return jwt.verify(token, secret);
}

export { generateToken, verifyToken };
