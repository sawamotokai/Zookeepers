const express = require('express');
const app = express();
const mysql = require('mysql');
const dotenv = require('dotenv');
app.use(express.json());

dotenv.config();

const PORT = 2000;

app.get('/', (req, res) => {
	res.send('hello world');
});

app.get('/api/user', (req, res) => {
	res.json({ username: 'Kevin' });
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

app.post('/animal/new', (req, res) => {});

app.get('/animal', (req, res) => {
	con.query('SELECT * FROM animal', (error, results, fields) => {
		if (error) throw error;
		console.log(results[0].id);
		res.status(200).json(results);
	});
});
