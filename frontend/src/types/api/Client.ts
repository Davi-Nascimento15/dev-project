import { Address } from "./Address";

export interface Client {
  id?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  birthDate?: Date;
  documentNumber: string;
  address: Address;
}