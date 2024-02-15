# Leo API

This is the backend API for my Electron app Leo. It provides endpoints for managing tasks, projects, and other productivity-related data.

## Table of Contents

- [Endpoints](#endpoints)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)

## Endpoints

### Areas

- `GET /api/areas`: Retrieve all areas.
- `GET /api/areas/:id`: Retrieve a specific area.
- `GET /api/archived/areas`: Retrieve archived areas.
- `POST /api/areas`: Create a new area.
- `PUT /api/areas/:id`: Update a specific area.
- `DELETE /api/areas/:id`: Remove a specific area.

### Goals

- `POST /api/goals`: Create a new goal.
- `GET /api/goals`: Retrieve all goals.
- `GET /api/areas/:areaId/goals`: Retrieve all goals within a specific area.
- `GET /api/archived/goals`: Retrieve archived goals.
- `PUT /api/goals/:id`: Update a specific goal.
- `DELETE /api/goals/:id`: Remove a specific goal.

### Notes

- `GET /api/notes`: Retrieve all notes.
- `GET /api/areas/:areaId/notes`: Retrieve all notes within a specific area.
- `GET /api/projects/:projectId/notes`: Retrieve all notes within a specific project.
- `GET /api/resources/:resourceId/notes`: Retrieve all notes within a specific resource.
- `GET /api/archived/notes`: Retrieve archived notes.
- `POST /api/notes`: Create a new note.
- `PUT /api/notes/:id`: Update a specific note.
- `DELETE /api/notes/:id`: Remove a specific note.

### Projects

- `GET /api/projects`: Retrieve all projects.
- `GET /api/areas/:areaId/projects`: Retrieve all projects within a specific area.
- `GET /api/archived/projects`: Retrieve archived projects.
- `GET /api/projects/:id`: Retrieve a specific project by ID.
- `POST /api/projects`: Create a new project.
- `PUT /api/projects/:id`: Update a project by ID.
- `DELETE /api/projects/:id`: Delete a project by ID.

### Resources
- `GET /api/resources`: Retrieve all resources.
- `GET /api/resources/:id`: Retrieve a specific resource.
- `GET /api/areas/:areaId/resources`: Retrieve all resources within a specific area.
- `GET /api/archived/resources`: Retrieve archived resources.
- `PUT /api/resources/:id`: Update a specific resource.
- `POST /api/resources`: Create a new resource.
  
### Tasks

- `GET /api/tasks`: Retrieve all tasks.
- `GET /api/projects/:id/tasks`: Retrieve all tasks within a project.
- `GET /api/archived/tasks`: Retrieve archived tasks.
- `POST /api/tasks`: Create a new task.
- `GET /tasks/:id`: Retrieve a specific task by ID.
- `PUT /api/tasks/:id`: Update a task by ID.
- `DELETE /api/tasks/:id`: Delete a task by ID.

## Authentication

This API uses Firebase Authentication tokens for authorization. 

## Contributing

Contributions are welcome! If you find a bug or want to add a new feature, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
