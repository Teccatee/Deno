import User from "../../models/User.ts";

export interface IUserService {

  createUser(user: User, db: string): void;
  updateUser(user: User, db: string): void;
  deleteUser(user: User, db: string): void;
  findUserById(id: string, db: string): Promise<User>;
  findAllUsers(db: string): Promise<User[]>;
  findUserByEmail(email: string, db: string): Promise<User>;

}
