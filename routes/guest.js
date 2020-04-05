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
	const q =
		`SELECT COUNT(*) AS Total, ` +
		`CASE WHEN Age >= 0 AND Age <= 5 THEN '0-5' ` +
		`WHEN Age >= 6 AND Age <= 17 THEN '6-17' ` +
		`WHEN Age >= 18 AND Age <= 65 THEN '18-65' ` +
		`ELSE '65+' END AS AgeRange FROM Guest GROUP BY AgeRange`;
	con.query(q, (error, results, fields) => {
		if (error) throw error;
		console.log(results);
		return res.status(200).render('demographic', { guests: results });
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
