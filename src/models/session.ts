export interface ISession {
  id: string;
  users?: IUser[];
}

export interface IUser {
  id: string;
  sessionId?: string;
  name: string;
  coords: ICoords;
}

export interface ICoords {
  longitude: number;
  latitude: number;
}
