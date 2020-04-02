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
	const q = `INSERT INTO animal (Name, Age, Species) VALUES ("${name}", ${age}, "${kind}")`;
	con.query(q, (error, result) => {
		if (error) throw error;
		console.log(result);
	});
	return res.status(200).redirect('/');
});

app.get('/animal', (req, res) => {
	const q = `SELECT * FROM animal a LEFT JOIN animal_meal am ON a.id=am.Animal_ID ORDER BY TIME`
	con.query(q, (error, results, fields) => {
		if (error) throw error;
		console.log(results);
		return res.render('animal', {animals: results});
	});
});

app.get('/staff', (req,res) => {
	con.query('SELECT * FROM staff', (error, results, fields) => {
		if (error) throw error;
		return res.status(200).render('staff', {staffs: results, clickHandler: 'func1()'});
	});
});

app.get('/guest', (req,res) => {
	con.query('SELECT * FROM guest', (error, results, fields) => {
		if (error) throw error;
		console.log(results);
		return res.status(200).render('guest', {guests: results, clickHandler: 'func1()'});
	});
});

app.post('/guest/new', (req, res) => {
	const {age, payment_method} = req.body;
	const q = `INSERT INTO guest (Age, Payment_Method) VALUES (${age}, "${payment_method}")`;
	con.query(q, (error, result) => {
		if (error) throw error;
		console.log(result);	
	});
	return res.status(200).redirect('/guest');
});

app.get('/guest/count', (req,res) => {
	con.query('SELECT COUNT(*) FROM guest', (error, results, fields) => {
		if (error) throw error;
		console.log(results);
		return res.status(200).render('guest_total', {guests: results, clickHandler: 'func1()'});
	});
});

app.get('/guest/min', (req,res) => {
	con.query('SELECT MIN(age) FROM guest', (error, results, fields) => {
		if (error) throw error;
		console.log(results);
		return res.status(200).render('guest_min', {guests: results, clickHandler: 'func1()'});
	});
});

app.get('/guest/max', (req,res) => {
	con.query('SELECT MAX(age) FROM guest', (error, results, fields) => {
		if (error) throw error;
		console.log(results);
		return res.status(200).render('guest_max', {guests: results, clickHandler: 'func1()'});
	});
});

// app.delete('/staff', (req,res) => {
	
// 	con.query(`DELETE FROM staff WHERE ID=${id}`, (error, results, fields) => {
// 		if (error) throw error;
// 		return res.status(200).render('staff', {staffs: results});
// 	});
// });

app.post('/staff/new', (req, res) => {
	const { name } = req.body;
	const q = `INSERT INTO staff (Name) VALUES ("${name}")`;
	con.query(q, (error, result) => {
		if (error) throw error;
		console.log(result);
	});
	return res.status(200).redirect('/staff');
});
