import { User } from "@/types/api/User";
import { BaseService } from "./BaseService";

class UserService extends BaseService {
  constructor() {
    super("user");
  }

  async getAll(): Promise<User[]> {
    return await this.get<User[]>("");
  }

  async create(user: User): Promise<string> {
    return await this.post<User, string>("", user);
  }

  async update(id: string, user: User): Promise<void> {
    return await this.put<User, void>(id, user);
  }

   async import(base64: ({csvFile:string})): Promise<void> {
    return await this.post<{csvFile:string}, void>("import", base64);
  }

   async getbyName(userName:string): Promise<User[]> {
      return await this.get<User[]>('search', {userName: userName});
    }
}

export default new UserService();