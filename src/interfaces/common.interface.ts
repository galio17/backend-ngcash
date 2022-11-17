import { JwtPayload } from "jsonwebtoken";

export interface IDecoded extends JwtPayload {
  username?: string;
}
