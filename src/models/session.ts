import { IUser } from "./user";

export interface ISession {
  id: string;
  users?: IUser[];
  createdAt?: Date;
  updatedAt?: Date;
}
