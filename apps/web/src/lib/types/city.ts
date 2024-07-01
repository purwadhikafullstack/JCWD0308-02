export interface City {
  id: number;
  name: string;
  provinceId: number;
  postalCode: number;
  type: "KOTA" | "Kabupaten"
}