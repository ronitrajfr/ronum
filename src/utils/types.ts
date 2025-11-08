export interface Paper {
  id: string;
  name: string;
  url: string;
  author: string;
  colorScheme: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface LibraryCategory {
  id: string;
  name: string;
  description: string;
  colorScheme: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  paper: Paper[];
}
