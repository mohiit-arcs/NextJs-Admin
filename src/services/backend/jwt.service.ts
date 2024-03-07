import { TokenData } from "@/interfaces/backend/token.interface";
import { HttpStatusCode } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { promisify } from "util";
import { config } from "@/config/index.config";
const jwt = require("jsonwebtoken");
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export const verifyToken = async (token: string): Promise<TokenData | null> => {
  if (!token) {
    throw new ApiError(HttpStatusCode.Unauthorized, "Invalid User");
  }

  let tokenData: TokenData | null = null;
  try {
    let decodedToken: TokenData;
    try {
      decodedToken = await verifyAsync(token, config.jwt.secret);
    } catch (e: any) {
      throw new ApiError(HttpStatusCode.Unauthorized, "Invalid Token");
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
    throw new ApiError(HttpStatusCode.Unauthorized, "Invalid User Profile");
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
    token = await signAsync(userInfoForToken, config.jwt.secret);
  } catch (e: any) {
    throw e;
  }

  return token;
};
