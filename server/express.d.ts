declare namespace Express {
  export interface Request {
    projectPathDecoded: string;
    yarnLock: boolean;
  }
}
