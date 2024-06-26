import { TokenData } from "@/interfaces/backend/token.interface";
import { promisify } from "util";
import { config } from "@/config/index.config";
import { unauthorized } from "@/core/errors/http.error";
const jwt = require("jsonwebtoken");
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export const verifyToken = async (token: string): Promise<TokenData | null> => {
  if (!token) {
    throw unauthorized("Invalid Token. Please log in again");
  }

  let tokenData: TokenData | null = null;
  try {
    let decodedToken: TokenData;
    try {
      decodedToken = await verifyAsync(token, config.jwt.secret);
    } catch (e: any) {
      throw unauthorized("Invalid Token. Please log in again");
    }
    if (decodedToken?.id) {
      tokenData = Object.assign({
        id: decodedToken.id,
        email: decodedToken.email,
        role: decodedToken.role,
      });
    }
  } catch (e: any) {
    throw e;
  }
  return tokenData;
};

export const generateToken = async (tokenData: TokenData): Promise<string> => {
  if (!tokenData) {
    throw unauthorized("Invalid Token. Please log in again");
  }

  let userInfoForToken = {};
  if (tokenData?.id) {
    userInfoForToken = {
      id: tokenData.id,
      email: tokenData.email,
      role: tokenData.role,
    };
  }
  let token: string;
  try {
    token = await signAsync(userInfoForToken, config.jwt.secret, {
      expiresIn: Number(config.jwt.expiry),
    });
  } catch (e: any) {
    throw e;
  }

  return token;
};
