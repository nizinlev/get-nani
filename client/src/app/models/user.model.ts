import { Rate } from "./rate.model";

export interface User {
  id: number;
  UserName: string;
  password: string;
  hashPass: string;
  email: string;
  phonNumber: number;
  lastEntry: Date;
}
