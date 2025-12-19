// src/types/index.ts
export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface Note {
  _id: string;
  userId: string;
  title: string;
  type_: "personal" | "project";
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  shared_with?: string[]; // Array of user IDs
}

export interface ApiErrorResponse {
  detail?: string; // FastAPI's HTTPException
  message?: string; // Custom messages
  error?: string; // General error
}