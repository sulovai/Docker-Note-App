# FastAPI Notes Application - React Frontend

This is the React frontend for the FastAPI Notes Application. It provides a user interface for interacting with the backend API, allowing users to manage their notes, including creation, viewing, editing, deletion, sharing, and searching.

## Features

*   **User Authentication**:
    *   User Registration page
    *   User Login page
    *   Protected routes for authenticated users
*   **Dashboard**:
    *   View a list of personal, project, and shared notes.
    *   Links to create new notes.
*   **Note Management**:
    *   Create new notes (personal/project).
    *   View detailed information for a specific note.
    *   Edit existing notes.
    *   Delete notes.
*   **Note Sharing**:
    *   UI to share notes with other users by email.
*   **Note Discovery**:
    *   Search notes by title or content.
    *   Filter notes by tags.
*   **Responsive Design**: Built with Tailwind CSS for adaptability across devices.
*   **Navigation**: Clear navigation using React Router.
*   **Context API**: Manages global authentication state.

## Technologies Used

*   **Framework/Library**: React (v18+)
*   **Language**: TypeScript
*   **Routing**: React Router DOM (v6)
*   **Styling**: Tailwind CSS
*   **State Management**: React Context API (for authentication)
*   **HTTP Client**: Axios (or `fetch` API - assumed for API calls)
*   **Build Tool**: Vite (commonly used with `npm run dev` and `npm run build`) or Create React App
*   **Package Manager**: npm (or yarn)
*   **Containerization**: Docker (with Nginx for serving)

## Prerequisites

*   Node.js (v18 or later recommended, as per Dockerfile)
*   npm (comes with Node.js) or yarn
*   Docker
*   A running instance of the [FastAPI Notes Backend API](link-to-your-backend-repo-if-it-exists-or-just-mention-it).

## Setup and Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Astaiss/notes-app-docker.git
    cd notes-app-docker
    ```

2.  **Install dependencies (for local development)**:
    ```bash
    npm install
    ```
    (or `yarn install` if you prefer yarn)

3.  **Set up environment variables**:
    Create a `.env` file in the root directory of the frontend project. This file will store the base URL for your backend API.
    ```env
    # For Vite projects (common)
    VITE_API_BASE_URL=http://localhost:8000

    # For Create React App projects
    # REACT_APP_API_BASE_URL=http://localhost:8000
    ```
    **Important**:
    *   Replace `http://localhost:8000` with the actual URL where your backend API is running.
    *   This URL is used by the frontend code when making API calls. The Dockerized frontend will also need to be able to reach this backend URL. If running both frontend and backend in Docker, ensure they are on the same Docker network and use appropriate service names for communication.

## Running the Application

### 1. Local Development (without Docker)

1.  **Ensure the backend API is running.**
2.  **Start the React development server**:
    If using Vite:
    ```bash
    npm run dev
    ```
    If using Create React App:
    ```bash
    npm start
    ```
    The application will typically open in your browser at `http://localhost:5173` (for Vite) or `http://localhost:3000` (for CRA).

### 2. Running with Docker (Production Build)

This method builds your React application for production and serves it using Nginx within a Docker container.

1.  **Ensure the backend API is running** and accessible from where your Docker container will run. If your backend is also Dockerized, ensure they can communicate (e.g., by being on the same Docker network).

2.  **Create/Update `Dockerfile`**:
    Ensure you have a `Dockerfile` in your project's root directory similar to the multi-stage example provided above (which builds the React app and then sets up Nginx to serve it).
    *   **Important**: In the `Dockerfile`, the line `COPY --from=build /app/dist /usr/share/nginx/html` assumes your build output is in the `dist` folder. If you are using Create React App, this is typically `build`, so you would change it to `COPY --from=build /app/build /usr/share/nginx/html`.

3.  **(Optional) Nginx Configuration for SPA Routing**:
    For Single Page Applications (SPAs) like those built with React Router, you often need to configure Nginx to redirect all non-file requests to `index.html`. Create an `nginx.conf` file in your project root (see the `Dockerfile` comments for an example configuration) and uncomment the `COPY nginx.conf ...` line in your `Dockerfile`.

4.  **Build the Docker image**:
    From your project's root directory:
    ```bash
    docker build -t my-notes-frontend .
    ```
    (Replace `my-notes-frontend` with your preferred image name).

5.  **Run the Docker container**:
    ```bash
    docker run -d -p 8080:80 my-notes-frontend
    ```
    *   `-d`: Runs the container in detached mode (in the background).
    *   `-p 8080:80`: Maps port 8080 on your host machine to port 80 inside the Docker container (where Nginx is listening).
    *   `my-notes-frontend`: The name of the image you built.

    Your frontend application should now be accessible at `http://localhost:8080` in your browser.

## Building for Production (Static Files Only)

If you only want to generate the static production assets without immediately containerizing them for serving:
```bash
npm run build
```