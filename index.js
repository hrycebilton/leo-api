import express from 'express';
import mysql from 'mysql2';
import sequelize from './database.js';
import Area from './models/areas.js';
import Goal from './models/goals.js';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.listen(port, () => {
    console.log(`Leo API listening on port ${port}`);
});

//#region Areas
// Define a GET route to retrieve all areas
app.get('/areas', async (req, res) => {
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
app.post('/areas', async (req, res) => {
    try {
        const { name, description, image } = req.body;
        const area = await Area.create({ name, description, image });
        res.status(201).json(area);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

//Define a GET route to retrieve a specific area
app.get('/areas/:id', async (req, res) => {
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
app.put('/areas/:id', async (req, res) => {
    try {
        const area = await Area.findOne({ where: { id: req.params.id } });
        if (!area) {
            return res.status(404).json({ error: 'Area not found' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Define a DELETE route to remove a specific area
app.delete('/areas/:id', async (req, res) => {
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
// Define a GET route to retrieve all goals
app.get('/goals', async (req, res) => {
    try {
        const goals = await Goal.findAll();
        res.json(goals);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

// Define a POST route to create a new area
app.post('/goals', async (req, res) => {
    try {
        const { name, description, dueDate, image } = req.body;
        const area = await Area.create({ name, description, image });
        res.status(201).json(area);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

//Define a GET route to retrieve a specific area
app.get('/areas/:id', async (req, res) => {
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
app.put('/areas/:id', async (req, res) => {
    try {
        const area = await Area.findOne({ where: { id: req.params.id } });
        if (!area) {
            return res.status(404).json({ error: 'Area not found' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Define a DELETE route to remove a specific area
app.delete('/areas/:id', async (req, res) => {
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

//create goal
//create note
//create resource
//create project
//create task

//read all projects in a certain area
//read all resources in a certain area
//read all tasks in a certain project
//read all goals in a certain area

//read all notes in a certain area
//read all notes in a certain project
//read all notes in a certain resource


//update goal
//update note
//update resource
//update project
//update task

//delete goal
//delete note
//delete resource
//delete project
//delete task