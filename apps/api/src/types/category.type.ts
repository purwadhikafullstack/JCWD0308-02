export interface CreateCategoryRequest {
  name: string;
  iconUrl?: string;
  imageUrl?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  iconUrl?: string;
  imageUrl?: string;
}
