import express from 'express';
import mysql from 'mysql2';
import sequelize from './database.js';
import Area from './models/areas.js';

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

        const updatedArea = await area.update(req.body);
        res.json(updatedArea);
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
//#endregion

//#region Notes
//#endregion

//#region Projects
//#endregion

//#region Resources
//#endregion

//#region Tasks
//#endregion