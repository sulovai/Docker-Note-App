// src/services/api.ts
import axios from 'axios';
import type { User, Note, ApiErrorResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
});

// Helper to extract error message
const getErrorMessage = (error: any): string => {
  if (axios.isAxiosError(error) && error.response) {
    const data = error.response.data as ApiErrorResponse;
    return data.detail || data.message || data.error || error.message || 'An unknown error occurred';
  }
  return error.message || 'An unknown error occurred';
};


// User API
export const createUser = async (userData: Omit<User, '_id'> & { password: string }) => {
  try {
    const response = await apiClient.post<{ message: string; user: User }>('/users/', userData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const loginUser = async (credentials: { username: string; password: string }) => {
  try {
    // Backend expects full User model for login, but only uses username/password
    // Sending a dummy email to satisfy the model, backend should ideally have a LoginCredentials model
    const response = await apiClient.post<{ message: string; user: User }>('/users/login', { ...credentials, email: "login@example.com" });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Notes API
export const createPersonalNote = async (noteData: Omit<Note, '_id' | 'created_at' | 'updated_at' | 'shared_with'>) => {
  try {
    const response = await apiClient.post<{ message: string; note: Note }>('/notes/personal/', noteData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getPersonalNotes = async (userId: string) => {
  try {
    const response = await apiClient.get<{ message: string; notes: Note[] }>(`/notes/personal/${userId}`);
    return response.data.notes;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getProjectNotes = async (userId: string) => {
  try {
    const response = await apiClient.get<{ message: string; notes: Note[] }>(`/notes/projects/${userId}`);
    return response.data.notes;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getNoteById = async (noteId: string) => {
  try {
    const response = await apiClient.get<{ message: string; note: Note }>(`/note/${noteId}`);
    return response.data.note;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateNote = async (noteId: string, noteData: Omit<Note, '_id' | 'created_at' | 'updated_at' | 'shared_with'>) => {
  try {
    const response = await apiClient.put<{ message: string; note: Note }>(`/note/${noteId}`, noteData);
    return response.data.note;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteNote = async (noteId: string) => {
  try {
    const response = await apiClient.delete<{ message: string }>(`/note/${noteId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const shareNote = async (noteId: string, email: string) => {
  try {
    const response = await apiClient.post<{ message: string; note: Note }>(`/share-note/${noteId}`, { email });
    return response.data.note;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getSharedNotes = async (userId: string) => {
  try {
    const response = await apiClient.get<{ message: string; notes: Note[] }>(`/shared-notes/${userId}`);
    return response.data.notes;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getNotesByTags = async (userId: string, tags: string[]) => {
  try {
    // The backend endpoint is POST, so we send tags in the body.
    // FastAPI's Query for List[str] in POST usually means form data or JSON list in body.
    // Assuming JSON list in body for tags.
    const response = await apiClient.post<{ message: string; notes: Note[] }>(`/notes/tags/${userId}`, tags);
    return response.data.notes;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};


export const searchNotes = async (userId: string, query: string) => {
  try {
    // Backend uses POST, query is path param, need to send query string in body?
    // The backend code shows `query: str` as a simple path parameter, not in body.
    // This means the endpoint should be `/notes/search/{userId}/{query}` or use query params.
    // Let's assume it's `/notes/search/{userId}?query={query_string}` if it were GET
    // Or if it must be POST, `query` should be in the body.
    // The provided backend: `def search_notes(userId: str, query: str):` implies `query` is a path parameter.
    // This is unusual for search terms. Let's fix this on backend or adapt.
    // Assuming backend is changed to accept query as a request body for POST or query param for GET.
    // For now, let's assume the backend is `/notes/search/{userId}` and `query` is in the body.
    // If `query` is a path parameter: `/notes/search/${userId}/${encodeURIComponent(query)}`
    // The FastAPI code shows `query: str` as a simple parameter, NOT a body.
    // This means it expects `query` to be part of the path if it's POST with only 2 path params.
    // Let's assume the backend meant `query: str = Query(...)` for GET or `query: str = Body(...)` for POST.
    // Given the backend is POST and `query` is not a `Body()`, it might be a form field.
    // For now, I'll assume the backend expects a JSON body for `query`: `{"query": "search term"}`.
    // *Correction*: The backend `search_notes` takes `query: str` which usually implies a form field or path param.
    // Since it's a POST, FastAPI will try to parse it from the body if it's the only non-path param.
    // Let's send it as JSON: { "query_string": query } and adjust backend or pass as form data.
    // The FastAPI function signature `def search_notes(userId: str, query: str):` for a POST route without `Body()` for `query`
    // means FastAPI expects `query` to be a form field if `Content-Type` is `application/x-www-form-urlencoded` or `multipart/form-data`.
    // If `Content-Type` is `application/json`, it would expect `query: QueryModel`.
    // Given the other POST routes use Pydantic models for JSON, let's assume `query` is sent as a form field or we adjust backend.
    // *Simplest fix for frontend:* send as `application/x-www-form-urlencoded`.
    // Or change backend: `class SearchQuery(BaseModel): query_str: str` and then `search_notes(userId: str, search_body: SearchQuery)`.
    // For this example, I'll send it as a query parameter, assuming the backend route is adjusted to e.g. `/notes/search/{userId}?q={query}`
    // If the backend must remain POST /notes/search/{userId} with `query: str` as body, use:
    // `const response = await apiClient.post(..., query, { headers: {'Content-Type': 'text/plain'} });`
    // Or more likely, `const response = await apiClient.post(..., { "query_string_param_name_on_backend": query });`
    // The current backend `search_notes(userId: str, query: str)` with POST suggests FastAPI expects `query` as a form field.
    // Let's adapt to send it as a form field.
    
    const formData = new FormData();
    formData.append('query', query); // FastAPI will pick this up for `query: str`

    const response = await apiClient.post<{ message: string; notes: Note[] }>(
        `/notes/search/${userId}`, 
        formData,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }} // Or multipart/form-data
    );
    return response.data.notes;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};