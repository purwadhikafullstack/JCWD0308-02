import { User } from "@/app/(admin)/type";

export interface Store {
  id: string;
  name: string;
  slug: string;
  superAdminId: string;
  status: "DRAFT" | "INACTIVE" | "PUBLISHED" | "SUSPENDED";
  imageUrl: string;
  address: string;
  coordinate: string;
  latitude: string;
  longitude: string;
  cityId: number;
  updatedAt: string;
  createdAt: string;
  stocks: any
  City: {
    id: number;
    name:string
    provinceId: number;
    postalCode: number;
    type: "KOTA" | "KABUPATEN"
  }
}

export interface StoreAdmin {
  id: string,
  storeId: string,
  storeAdminId: string,
  updatedAt: Date,
  createdAt: Date,
  storeAdmin: User
}