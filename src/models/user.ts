export interface IUser {
  id: string;
  sessionId: string;
  name: string;
  coords: { longitude: number; latitude: number };
  createdAt?: Date;
  updatedAt?: Date;
}
