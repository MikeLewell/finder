import { v4 as uuidv4 } from "uuid";

export const createId = (): string => {
  return uuidv4();
};

export const createShortId = (idLength = 5): string => {
  const base64Chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  const createRandomIndexNumber = (): number =>
    Math.floor(Math.random() * base64Chars.length);

  let id = "";

  for (let i = 0; i < idLength; i++) {
    id = id + base64Chars.charAt(createRandomIndexNumber());
  }

  return id;
};
