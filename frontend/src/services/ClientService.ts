import { BaseService } from "./BaseService";
import { Client } from "@/types/api/Client";

class ClientService extends BaseService {
  constructor() {
    super("client");
  }

  async getAll(): Promise<Client[]> {
    return await this.get<Client[]>("");
  }

  async getbyDocument(document:string): Promise<Client[]> {
    return await this.get<Client[]>('search', {document: document});
  }

  async create(client: Client): Promise<string> {
    return await this.post<Client, string>("", client);
  }

  async getById(id: string): Promise<Client> {
    return await this.get<Client>(id);
  }

  async update(id: string, client: Client): Promise<void> {
    return await this.put<Client, void>(id, client);
  }
   
  async import(base64: ({csvFile:string})): Promise<void> {
    return await this.post<{csvFile:string}, void>("import", base64);
  }

   async deleteClient(id: string): Promise<void> {
    return await this.delete(id);
  }
}

export default new ClientService();