const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const con = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
});

router.post('/', (req, res) => {
	const { name } = req.body;
	const q = `INSERT INTO staff (Name) VALUES ("${name}")`;
	con.query(q, (error, result) => {
		if (error) throw error;
		// console.log(result);
	});
	return res.status(200).redirect('/staff');
});

router.get('/', (req, res) => {
	let promises = [];
	promises.push(
		new Promise((resolve, reject) => {
			const q = `SELECT * FROM staff ORDER BY Name`;
			con.query(q, (error, results, fields) => {
				if (error) reject(error);
				console.log(results);
				resolve({ staffs: results });
			});
		})
	);
	promises.push(
		new Promise((resolve, reject) => {
			const q = `SELECT * FROM animal`;
			con.query(q, (error, results, fields) => {
				if (error) reject(error);
				console.log(results);
				resolve({ animals: results });
			});
		})
	);
	promises.push(
		new Promise((resolve, reject) => {
			const q = `SELECT * FROM cage`;
			con.query(q, (error, results, fields) => {
				if (error) reject(error);
				console.log(results);
				resolve({ cages: results });
			});
		})
	);
	Promise.all(promises)
		.then((results) => {
			let arg = {};
			results.forEach((result) => {
				arg = { ...arg, ...result };
			});
			res.render('staff', arg);
		})
		.catch((err) => console.error(err));
});

router.post('/delete/:id', (req, res) => {
	const { id } = req.params;
	const q = `DELETE FROM staff where ID=${id}`;
	con.query(q, (error, result) => {
		if (error) throw error;
		// console.log(result);
	});
	return res.status(200).redirect('/staff');
});

module.exports = router;
