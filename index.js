import cors from "cors";
import express from "express";
import sequelize from "./database.js"; //required
import Area from "./models/areas.js";
import Goal from "./models/goals.js";
import Note from "./models/notes.js";
import Project from "./models/projects.js";
import Resource from "./models/resources.js";
import Task from "./models/tasks.js"
import Middleware from "./middleware/firebase/index.js";

const app = express();
const port = process.env.PORT || 8080;
const middleware = new Middleware();

app.use(express.json());
app.use(cors());
//app.use(middleware.decodeToken.bind(middleware));

//#region Areas
// Define a GET route to retrieve all areas
app.get("/api/areas", async (req, res) => {
    try {
        const areas = await Area.findAll();
        res.json(areas);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

// Define a POST route to create a new area
app.post("/api/areas", async (req, res) => {
    try {
        const { name, description, image, belongs_to } = req.body;
        const area = await Area.create({ name, description, image, belongs_to });
        res.status(201).json(area);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

//Define a GET route to retrieve a specific area
app.get("/api/areas/:id", async (req, res) => {
    try {
        const area = await Area.findOne({ where: { id: req.params.id } });
        if (!area) {
            return res.status(404).json({ error: "Area not found" });
        }
        res.json(area);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Define a PUT route to update a specific area
app.put("/api/areas/:id", async (req, res) => {
    try {
        const area = await Area.findOne({ where: { id: req.params.id } });

        if (!area) {
            return res.status(404).json({ error: "Area not found" });
        }

        const updatedArea = await area.update(req.body);
        res.json(updatedArea);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Define a DELETE route to remove a specific area
app.delete("/api/areas/:id", async (req, res) => {
    try {
        const area = await Area.findOne({ where: { id: req.params.id } });

        if (!area) {
            return res.status(404).json({ error: "Area not found" });
        }

        await area.destroy();
        res.sendStatus(204);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
//#endregion

//#region Goals
// Define a POST route to create a new goal
app.post("/api/goals", async (req, res) => {
    try {
        const { name, description, due_date, last_updated, priority, area_id, belongs_to } = req.body;
        const goal = await Goal.create({ name, description, due_date, last_updated, priority, area_id, belongs_to });
        res.status(201).json(goal);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

// Define a GET route to retrieve all goals
app.get("/api/goals", async (req, res) => {
    try {
        const goal = await Goal.findAll();
        res.status(201).json(goal);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

// Define a GET route to retrieve all goals within a specific area
app.get("/api/areas/:areaId/goals", async (req, res) => {
    try {
        const areaId = req.params.areaId;

        // Query the projects based on the specified area ID
        const goals = await Goal.findAll({ where: { area_id: areaId } });

        res.json(goals);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

//Define a DELETE route to remove a specific goal
app.delete("/api/goals/:id", async (req, res) => {
    try {
        const goal = await Goal.findOne({ where: { id: req.params.id } });
        if (!goal) {
            return res.status(404).json({ error: "Goal not found" });
        }
        await goal.destroy();
        res.sendStatus(204);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
//#endregion

//#region Notes
// Define a GET route to retrieve all notes
app.get("/api/notes", async (req, res) => {
    try {
        const notes = await Note.findAll();
        res.json(notes);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

// Define a GET route to retrieve all notes within a specific area
app.get("/api/areas/:areaId/notes", async (req, res) => {
    try {
        const areaId = req.params.areaId;

        // Query the notes based on the specified area ID
        const notes = await Note.findAll({ where: { area_id: areaId } });

        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

// Define a GET route to retrieve all notes within a specific project
app.get("/api/projects/:projectId/notes", async (req, res) => {
    try {
        const projectId = req.params.projectId;

        // Query the notes based on the specified area ID
        const notes = await Note.findAll({ where: { project_id: projectId } });

        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

// Define a POST route to create a new note
app.post("/api/notes", async (req, res) => {
    try {
        const { title, type, content, source, last_updated, project_id, area_id, resource_id, belongs_to } = req.body;
        const note = await Note.create({ title, type, content, source, last_updated, project_id, area_id, resource_id, belongs_to });
        res.status(201).json(note);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

//Define a PUT route to update a specific note
app.put("/api/notes/:id", async (req, res) => {
    try {
        const note = await Note.findOne({ where: { id: req.params.id } });

        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        const updatedNote = await note.update(req.body);
        res.json(updatedNote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
//#endregion

//#region Projects
// Define a GET route to retrieve all projects
app.get("/api/projects", async (req, res) => {
    try {
        const projects = await Project.findAll();
        res.json(projects);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

// Define a GET route to retrieve all projects within a specific area
app.get("/api/areas/:areaId/projects", async (req, res) => {
    try {
        const areaId = req.params.areaId;

        // Query the projects based on the specified area ID
        const projects = await Project.findAll({ where: { area_id: areaId } });

        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

//Define a GET route to retrieve a specific project
app.get("/api/projects/:id", async (req, res) => {
    try {
        const project = await Project.findOne({ where: { id: req.params.id } });
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        res.json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Define a POST route to create a new project
app.post("/api/projects", async (req, res) => {
    try {
        const { name, description, image, start_date, end_date, status, last_updated, priority, area_id, goal_id, belongs_to } = req.body;
        const project = await Project.create({ name, description, image, start_date, end_date, status, last_updated, priority, area_id, goal_id, belongs_to });
        res.status(201).json(project);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

//Define a PUT route to update a specific project
app.put("/api/projects/:id", async (req, res) => {
    try {
        const project = await Project.findOne({ where: { id: req.params.id } });

        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        const updatedProject = await project.update(req.body);
        res.json(updatedProject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Define a DELETE route to remove a specific project
app.delete("/api/projects/:id", async (req, res) => {
    try {
        const project = await Project.findOne({ where: { id: req.params.id } });
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        await project.destroy();
        res.sendStatus(204);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
//#endregion

//#region Resources
// Define a GET route to retrieve all resources
app.get("/api/resources", async (req, res) => {
    try {
        const resources = await Resource.findAll();
        res.json(resources);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

// Define a GET route to retrieve all resources within a specific area
app.get("/api/areas/:areaId/resources", async (req, res) => {
    try {
        const areaId = req.params.areaId;

        // Query the resources based on the specified area ID
        const resources = await Resource.findAll({ where: { area_id: areaId } });

        res.json(resources);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

// Define a POST route to create a new area
app.post("/api/resources", async (req, res) => {
    try {
        const { name, description, image, area_id, belongs_to } = req.body;
        const resource = await Resource.create({ name, description, image, area_id, belongs_to });
        res.status(201).json(resource);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});
//#endregion

//#region Tasks
// Define a GET route to retrieve all tasks
app.get("/api/tasks", async (req, res) => {
    try {
        const tasks = await Task.findAll();
        res.json(tasks);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

// Define a GET route to retrieve all tasks within a project
app.get("/api/projects/:id/tasks", async (req, res) => {
    try {
        const id = req.params.id;

        // Retrieve tasks associated with the specified project ID
        const tasks = await Task.findAll({ where: { id } });

        res.json(tasks);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

// Define a POST route to create a new task
app.post("/api/tasks", async (req, res) => {
    try {
        const { name, description, start_date, due_date, priority, recurrence, recurrence_unit, is_finished, project_id, goal_id, belongs_to } = req.body;
        const task = await Task.create({ name, description, start_date, due_date, priority, recurrence, recurrence_unit, is_finished, project_id, goal_id, belongs_to });
        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

//Define a PUT route to update a specific task
app.put("/api/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findOne({ where: { id: req.params.id } });

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        const updatedTask = await task.update(req.body);
        res.json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Define a DELETE route to remove a specific task
app.delete("/api/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findOne({ where: { id: req.params.id } });
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        await task.destroy();
        res.sendStatus(204);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
//#endregion

app.listen(port, () => {
    console.log(`Leo API listening on port ${port}`);
});