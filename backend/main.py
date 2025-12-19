from fastapi import FastAPI, HTTPException, Query, Form, Body
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from typing import List, Optional
from bson import ObjectId
from dotenv import load_dotenv
import os
import datetime

# Load environment variables from .env file
load_dotenv()

app = FastAPI()
# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for simplicity; adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
client = MongoClient(os.getenv("MONGO_URI"))
db = client["notes-app"]
user_db = db["users"]
notes_db = db["notes"]


# Pydantic models
class User(BaseModel):
    username: str
    email: str
    password: str
@app.post("/users/", 
          description="Create a new user")
def create_user(user: User):
    username_exists = user_db.find_one({"username": user.username})
    if username_exists:
        raise ValueError("Username already exists")
    email_exists = user_db.find_one({"email": user.email})
    if email_exists:
        raise ValueError("Email already exists")
    
    
    user_data = user.dict()
    user_db.insert_one(user_data)
    user_data["_id"] = str(user_data["_id"])
    return {"meessage": "User created successfully", "user": user_data}


@app.post("/users/login",
          description="Login a user")
def login_user(user: User):
    user_data = user_db.find_one({"username": user.username, "password": user.password})
    if not user_data:
        raise ValueError("Invalid username or password")
    
    user_data["_id"] = str(user_data["_id"])
    return {"message": "Login successful", "user": user_data}


class NoteBase(BaseModel):
    userId: str
    title: str
    type_: str
    content: str
    tags: Optional[List[str]] = []
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
@app.post("/notes/personal/",
          description="Create a personal note")
def create_personal_note(note: NoteBase):
    note_data = note.dict()
    note_data["created_at"] = datetime.datetime.utcnow().isoformat()
    note_data["updated_at"] = datetime.datetime.utcnow().isoformat()
    notes_db.insert_one(note_data)
    note_data["_id"] = str(note_data["_id"])
    return {"message": "Personal note created successfully", "note": note_data}



@app.get("/notes/personal/{userId}", description="Get all personal notes")
def get_personal_notes(userId: str):
    try:
        # Optional: validate ObjectId if needed (depends on how `userId` is stored)
        ObjectId(userId)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID format")

    notes = list(notes_db.find({"userId": userId, "type_": "personal"}))

    for note in notes:
        note["_id"] = str(note["_id"])
        note["shared_with"] = [str(uid) for uid in note.get("shared_with", [])]

    return {
        "message": "Personal notes retrieved successfully",
        "notes": notes
    }

@app.get("/notes/projects/{userId}", description="Get all project notes")
def get_project_notes(userId: str):
    try:
        ObjectId(userId)  # optional validation if stored as ObjectId
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID format")

    notes = list(notes_db.find({"userId": userId, "type_": "project"}))

    for note in notes:
        note["_id"] = str(note["_id"])
        note["shared_with"] = [str(uid) for uid in note.get("shared_with", [])]

    return {
        "message": "Project notes retrieved successfully",
        "notes": notes
    }


@app.get("/note/{noteId}", description="Get a note by ID")
def get_note_by_id(noteId: str):
    try:
        note_obj_id = ObjectId(noteId)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid note ID format")
    
    note = notes_db.find_one({"_id": note_obj_id})
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    note["_id"] = str(note["_id"])
    note["shared_with"] = [str(uid) for uid in note.get("shared_with", [])]

    return {"message": "Note retrieved successfully", "note": note}


@app.put("/note/{noteId}", description="Update a note by ID")
def update_note(noteId: str, note: NoteBase):
    try:
        note_obj_id = ObjectId(noteId)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid note ID format")

    note_data = note.dict()
    note_data["updated_at"] = datetime.datetime.utcnow().isoformat()

    result = notes_db.update_one({"_id": note_obj_id}, {"$set": note_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Note not found")

    note_data["_id"] = noteId  # keep ID for response
    return {"message": "Note updated successfully", "note": note_data}

@app.delete("/note/{noteId}",
          description="Delete a note by ID")
def delete_note(noteId: str):
    result = notes_db.delete_one({"_id": ObjectId(noteId)})
    if result.deleted_count == 0:
        raise ValueError("Note not found")
    
    return {"message": "Note deleted successfully"}


class ShareNote(BaseModel):
    email: str
@app.post("/share-note/{noteId}", description="Share a note with another user")
def share_note(noteId: str, share_note: ShareNote):
    note = notes_db.find_one({"_id": ObjectId(noteId)})
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    user = user_db.find_one({"email": share_note.email})
    if not user:
        raise HTTPException(status_code=404, detail="User with this email does not exist")
    
    shared_with = note.get("shared_with", [])
    if user["_id"] not in shared_with:
        shared_with.append(user["_id"])
    
    notes_db.update_one(
        {"_id": ObjectId(noteId)},
        {"$set": {"shared_with": shared_with}}
    )

    # Serialize ObjectIds to strings before returning
    note["_id"] = str(note["_id"])
    note["shared_with"] = [str(uid) for uid in shared_with]

    return {"message": "Note shared successfully", "note": note}

@app.get("/shared-notes/{userId}", description="Get all notes shared with a user")
def get_shared_notes(userId: str):
    try:
        user_obj_id = ObjectId(userId)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID format")
    
    notes = list(notes_db.find({"shared_with": user_obj_id}))
    
    for note in notes:
        note["_id"] = str(note["_id"])
        # Convert shared_with ObjectIds to strings for response
        note["shared_with"] = [str(uid) for uid in note.get("shared_with", [])]
    
    return {
        "message": "Shared notes retrieved successfully",
        "notes": notes
    }



@app.post("/notes/tags/{userId}", description="Get all notes by tags")
def get_notes_by_tags(userId: str, tags: List[str] = Body(...)): # <--- CHANGE THIS LINE
    try:
        user_obj_id = ObjectId(userId)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID format")

    # Notes created by user
    user_notes = list(notes_db.find({"userId": userId, "tags": {"$in": tags}}))

    # Notes shared with user
    shared_notes = list(notes_db.find({"shared_with": user_obj_id, "tags": {"$in": tags}}))

    # Combine and serialize
    all_notes = user_notes + shared_notes
    for note in all_notes:
        note["_id"] = str(note["_id"])
        if "shared_with" in note and note["shared_with"] is not None:
            note["shared_with"] = [str(uid) for uid in note.get("shared_with", [])]
        else:
            note["shared_with"] = []


    return {
        "message": "Notes by tags retrieved successfully",
        "notes": all_notes
    }


@app.post("/notes/search/{userId}", description="Search notes by title or content")
def search_notes(userId: str, query: str = Form(...)): # <--- Change this line
    try:
        user_obj_id = ObjectId(userId)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID format")

    # Search personal notes
    personal_notes = list(notes_db.find({
        "userId": userId, # Assuming userId in notes_db is stored as a string
        "$or": [
            {"title": {"$regex": query, "$options": "i"}},
            {"content": {"$regex": query, "$options": "i"}}
        ]
    }))

    # Search shared notes
    shared_notes = list(notes_db.find({
        "shared_with": user_obj_id,
        "$or": [
            {"title": {"$regex": query, "$options": "i"}},
            {"content": {"$regex": query, "$options": "i"}}
        ]
    }))

    # Combine and serialize
    all_notes = personal_notes + shared_notes
    for note in all_notes:
        note["_id"] = str(note["_id"])
        if "shared_with" in note and note["shared_with"] is not None:
             note["shared_with"] = [str(uid) for uid in note.get("shared_with", [])]
        else:
            note["shared_with"] = []


    return {
        "message": "Notes search results",
        "notes": all_notes
    }

