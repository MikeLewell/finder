export interface ISession {
  id: string;
  users: IUser[];
}

export interface IUser {
  id: string;
  name: string;
  coords: ICoords;
}

export interface ICoords {
  longitude: number;
  latitude: number;
}

export interface ICreateSession {
  name: string;
  coords: ICoords;
}

export interface IJoinSession {
  sessionId: string;
  name: string;
  coords: ICoords;
}
