# FastAPI Notes Application

A backend API for a notes application built with FastAPI and MongoDB. This application allows users to register, log in, create personal and project-specific notes, share notes with other users, and search/filter their notes.

## Features

*   **User Management**:
    *   User Registration
    *   User Login
*   **Note Management**:
    *   Create Personal Notes
    *   Create Project Notes (distinguished by `type_` field)
    *   Retrieve all personal notes for a user
    *   Retrieve all project notes for a user
    *   Retrieve a specific note by its ID
    *   Update an existing note
    *   Delete a note
*   **Note Sharing**:
    *   Share a note with another user via their email
    *   Retrieve all notes shared with the current user
*   **Note Discovery**:
    *   Filter notes (owned or shared) by tags
    *   Search notes (owned or shared) by title or content

## Technologies Used

*   **Backend**: Python 3.11
*   **Framework**: FastAPI
*   **Database**: MongoDB (with PyMongo driver)
*   **Data Validation**: Pydantic
*   **Environment Variables**: `python-dotenv`
*   **ASGI Server**: Uvicorn
*   **Containerization**: Docker

## Prerequisites

*   Python 3.11+
*   Pip (Python package installer)
*   MongoDB instance (local or cloud-hosted, e.g., MongoDB Atlas)
*   Docker (optional, for containerized deployment)

## Setup and Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Astaiss/notes-app-docker.git
    cd notes-app-docker
    ```

2.  **Create a virtual environment (recommended)**:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up environment variables**:
    Create a `.env` file in the root directory of the project and add your MongoDB connection URI:
    ```env
    MONGO_URI=your_mongodb_connection_string
    ```
    Example for a local MongoDB instance:
    `MONGO_URI=mongodb://localhost:27017/`

    The application will create a database named `notes-app` with collections `users` and `notes` if they don't already exist.

## Running the Application

### 1. Directly with Uvicorn (for development)

From the project's root directory:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Using Docker
- The provided Dockerfile allows you to build and run the application in a container.
Build the Docker image:
    ```
    docker build -t notes-api 
    ```

- Run the Docker container:
Make sure your .env file is present in the root directory, as the Dockerfile copies it. Alternatively, pass environment variables directly.
    ```
    docker run -d -p 8000:8000 --env-file .env notes-api
    ```
    Or, if you want to pass the MONGO_URI directly:
    ```
    docker run -d -p 8000:8000 -e MONGO_URI="your_mongodb_connection_string" notes-api
    ```
The API will be accessible at http://localhost:8000.
And you can find the api documentation at  http://localhost:8000/docs