const express = require('express');
const app = express();
const mysql = require('mysql');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
const PORT = 2000;

const con = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
});

app.get('/', (req, res) => {
	res.render('home');
});

app.get('/api/user', (req, res) => {
	res.json({ username: 'Kevin' });
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

app.post('/animal/new', (req, res) => {
	const { name, age, kind } = req.body;
	const q = `INSERT INTO animal (name, age, kind) VALUES ("${name}", ${age}, "${kind}")`;
	con.query(q, (error, result) => {
		if (error) throw error;
		console.log(result);
	});
	return res.status(200).redirect('/');
});

app.get('/animal', (req, res) => {
	con.query('SELECT * FROM animal', (error, results, fields) => {
		if (error) throw error;
		console.log(results[0].id);
		res.status(200).json(results);
	});
});
