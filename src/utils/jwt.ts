import config from "./config";
import jwt from "jsonwebtoken";

const secretKey = config.KEY

export function signToken(userId: string): string {
    return jwt.sign(
        { userId: userId },
        (secretKey),
        { expiresIn: '24h' }
    )
}

export function verifyToken(token: string) {
    return jwt.verify(token, secretKey)
}