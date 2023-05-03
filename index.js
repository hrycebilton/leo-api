import express from 'express';
import mysql from 'mysql2';
import Sequelize from 'sequelize';

const app = express();

const sequelize = new Sequelize('secondbrain_db', 'leo-api', '$sH!t6&*UA$u@jxKXjB2u5KhTdbHhwbdhBZi@tfdyUyZYrtCHh7tSGgmLK$3W7sJhnu^Q&PzkJV8*jqngyZjwKh@wpQKuNyapT&$%%2bGXnVhVk5QwhFMWQDk3WsM#9S', {
    host: 'localhost',
    dialect: 'mysql'
});

app.use(express.json());

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Leo API listening on port ${port}`);
});

app.get("/", async (req, res) => {
    res.json({ status: "Test response!" });
});
