# Full-Stack Notes Application (FastAPI & React)

This project is a full-stack notes application featuring a Python FastAPI backend and a React (Vite + TypeScript) frontend. The entire application is designed to be run easily using Docker Compose.

## Core Components

1.  **Backend**:
    *   Built with **FastAPI** (Python).
    *   Uses **MongoDB** as the database.
    *   Provides RESTful APIs for user authentication, note creation, management, sharing, and searching.
    *   [Detailed Backend README](./backend/README.md)

2.  **Frontend**:
    *   Built with **React**, **Vite**, and **TypeScript**.
    *   Styled with **Tailwind CSS**.
    *   Consumes the backend APIs to provide a user interface for all note-taking functionalities.
    *   Includes features like user login/registration, dashboard, note detail view, and note creation/editing forms.
    *   [Detailed Frontend README](./frontend/README.md)

## Key Features (Overall Application)

*   User Registration and Login
*   Create, Read, Update, Delete (CRUD) operations for personal and project notes
*   Share notes with other users via email
*   View notes shared with you
*   Filter notes by tags
*   Search notes by title or content

## Technologies (Full Stack)

*   **Backend**: Python, FastAPI, Pydantic, MongoDB (PyMongo), Uvicorn
*   **Frontend**: React, Vite, TypeScript, React Router, Tailwind CSS, Axios (or fetch)
*   **Containerization**: Docker, Docker Compose
*   **Environment Management**: `python-dotenv` (backend), `.env` files (frontend)

## Prerequisites

*   Docker
*   Docker Compose (usually comes with Docker Desktop)
*   Git (for cloning)

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Astaiss/notes-app-docker.git
    cd notes-app-docker
    ```

2.  **Set up Environment Variables**:

    *   **Backend**:
        Navigate to the `backend` directory and create a `.env` file (`backend/.env`) based on `backend/.env.example` (if you create one) or by adding:
        ```env
        MONGO_URI=mongodb://mongo:27017/notes-app
        # If running MongoDB outside Docker Compose, adjust the URI accordingly
        # e.g., MONGO_URI=mongodb://localhost:27017/notes-app (if backend runs locally not in Docker)
        # or your MongoDB Atlas string.
        # For Docker Compose, 'mongo' will be the service name of your MongoDB container
        # if you add one. If connecting to an external MongoDB, use its actual URI.
        ```
        *(Note: The provided `docker-compose.yml` doesn't include a MongoDB service, so `MONGO_URI` should point to an accessible MongoDB instance, e.g., a local instance or MongoDB Atlas. If you add a Mongo service to `docker-compose.yml` named `mongo`, then `mongodb://mongo:27017/notes-app` would be correct.)*

    *   **Frontend**:
        Navigate to the `frontend` directory and create a `.env` file (`frontend/.env`) based on `frontend/.env.example` (if you create one) or by adding:
        ```env
        # For Vite projects
        VITE_API_BASE_URL=http://localhost:8000
        # This URL should point to where the backend API is accessible FROM THE USER'S BROWSER.
        # Since the backend is exposed on port 8000 on the host via Docker Compose,
        # localhost:8000 is correct.
        ```

3.  **Run the application using Docker Compose**:
    From the root directory of the project (where `docker-compose.yml` is located):
    ```bash
    docker-compose up --build
    ```
    *   `--build`: Forces Docker Compose to rebuild the images if there are changes.
    *   The backend will be accessible at `http://localhost:8000`.
    *   The frontend (Vite dev server) will be accessible at `http://localhost:5173`.

4.  **Accessing the Applications**:
    *   Backend API Docs (Swagger UI): `http://localhost:8000/docs`
    *   Frontend Application: `http://localhost:5173`

5.  **Stopping the application**:
    Press `Ctrl+C` in the terminal where `docker-compose up` is running.
    To remove the containers (and networks, volumes if specified):
    ```bash
    docker-compose down
    ```

## Project Structure
```
├── backend/
│ ├── main.py
│ ├── Dockerfile
│ ├── requirements.txt
│ ├── .env # (Gitignored) Backend environment variables
│ └── README.md # Detailed backend documentation
├── frontend/
│ ├── src/
│ ├── Dockerfile
│ ├── package.json
│ ├── .env # (Gitignored) Frontend environment variables
│ └── README.md # Detailed frontend documentation
├── docker-compose.yml
├── .gitignore
└── README.md # This file (Top-level project overview)
```

## Development Notes

*   **Frontend Hot Reloading**: The frontend service in `docker-compose.yml` is configured to run `npm run dev` and mounts the `./frontend` directory into the container. This means changes made to your frontend code will trigger a hot reload in your browser automatically.
*   **Backend Auto-Reload**: The backend's `Dockerfile` uses `uvicorn main:app --host 0.0.0.0 --port 8000`. If you want auto-reload for backend development, you would typically add the `--reload` flag to the `CMD` in `backend/Dockerfile` (e.g., `CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]`). Be mindful that `--reload` is generally for development.

## Further Information

For more detailed information about each component, please refer to their respective README files:

*   [Backend README](./backend/README.md)
*   [Frontend README](./frontend/README.md)
## LICENSE
This project is under [MIT LICENSE](./LICENSE.md)
