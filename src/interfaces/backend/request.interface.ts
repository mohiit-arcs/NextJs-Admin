import { NextRequest } from "next/server";
import { TokenData } from "./token.interface";

export interface ApiRequest extends NextRequest {
  user?: TokenData;
}
