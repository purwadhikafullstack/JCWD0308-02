import { City } from "./city";

export interface Address {
  id: string;
  labelAddress: string;
  recipientName: string;
  phone: string;
  userId: string;
  isMainAddress: boolean;
  address: string;
  cityId: number;
  note: string | null;
  coordinate: string;
  latitude: string | null;
  longitude: string | null;
  updatedAt: Date;
  createdAt: Date;
  city: City | null
}