declare namespace Express {
  export interface Response {
    respond: (data: any) => void;
  }
  export interface Request {
    currentUser: import('@prisma/client').User;
  }
}
