import express from 'express';
import sequelize from './database.js';
import Area from './models/areas.js';
import Project from './models/projects.js';
import Middleware from './middleware/firebase/index.js';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8080;
const middleware = new Middleware();

app.use(express.json());
app.use(cors());
app.use(middleware.decodeToken.bind(middleware));

//#region Areas
// Define a GET route to retrieve all areas
app.get('/api/areas', async (req, res) => {
    try {
        const areas = await Area.findAll();
        res.json(areas);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

// Define a POST route to create a new area
app.post('/api/areas', async (req, res) => {
    try {
        const { name, description, image, belongs_to } = req.body;
        const area = await Area.create({ name, description, image, belongs_to });
        res.status(201).json(area);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

//Define a GET route to retrieve a specific area
app.get('/api/areas/:id', async (req, res) => {
    try {
        const area = await Area.findOne({ where: { id: req.params.id } });
        if (!area) {
            return res.status(404).json({ error: 'Area not found' });
        }
        res.json(area);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Define a PUT route to update a specific area
app.put('/api/areas/:id', async (req, res) => {
    try {
        const area = await Area.findOne({ where: { id: req.params.id } });

        if (!area) {
            return res.status(404).json({ error: 'Area not found' });
        }

        const updatedArea = await area.update(req.body);
        res.json(updatedArea);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Define a DELETE route to remove a specific area
app.delete('/api/areas/:id', async (req, res) => {
    try {
        const area = await Area.findOne({ where: { id: req.params.id } });
        if (!area) {
            return res.status(404).json({ error: 'Area not found' });
        }
        await area.destroy();
        res.sendStatus(204);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
//#endregion

//#region Goals
//#endregion

//#region Notes
//#endregion

//#region Projects
// Define a GET route to retrieve all projects
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.findAll();
        res.json(projects);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});
//#endregion

//#region Resources
//#endregion

//#region Tasks
//#endregion

app.listen(port, () => {
    console.log(`Leo API listening on port ${port}`);
});