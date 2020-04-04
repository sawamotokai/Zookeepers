const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const con = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
});

router.get('/', (req, res) => {
	con.query('SELECT * FROM guest', (error, results, fields) => {
		if (error) throw error;
		console.log(results);
		return res.status(200).render('guest', { guests: results, clickHandler: 'func1()' });
	});
});

router.post('/new', (req, res) => {
	const { age, payment_method } = req.body;
	const q = `INSERT INTO guest (Age, Payment_Method) VALUES (${age}, "${payment_method}")`;
	con.query(q, (error, result) => {
		if (error) throw error;
		console.log(result);
	});
	return res.status(200).redirect('/guest');
});

router.get('/count', (req, res) => {
	con.query('SELECT COUNT(*) FROM guest', (error, results, fields) => {
		if (error) throw error;
		console.log(results);
		return res.status(200).render('guest_total', { guests: results, clickHandler: 'func1()' });
	});
});

router.get('/demographic', (req, res) => {
	con.query('SELECT count(g) FROM Ticket as t, Guest as g GROUP BY Ticket.Age_Range', (error, results, fields) => {
		if (error) throw error;
		console.log(results);
		return res.status(200).render('demographic', { guests: results, clickHandler: 'func1()' });
	});
});

router.get('/min', (req, res) => {
	con.query('SELECT MIN(age) FROM guest', (error, results, fields) => {
		if (error) throw error;
		console.log(results);
		return res.status(200).render('guest_min', { guests: results, clickHandler: 'func1()' });
	});
});

router.get('/max', (req, res) => {
	con.query('SELECT MAX(age) FROM guest', (error, results, fields) => {
		if (error) throw error;
		console.log(results);
		return res.status(200).render('guest_max', { guests: results, clickHandler: 'func1()' });
	});
});

module.exports = router;
