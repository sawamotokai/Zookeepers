const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const { v4: uuidv4 } = require('uuid');

const con = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
});

router.get('/', (req, res) => {
	con.query('SELECT * FROM shop', (error, results, fields) => {
		if (error) throw error;
		console.log(results);
		return res.status(200).render('shop', { shops: results });
	});
});

router.post('/', (req, res) => {
	const { name, age, kind } = req.body;
	const q = `INSERT INTO animal (Name, Age, Species) VALUES ("${name}", ${age}, "${kind}")`;
	con.query(q, (error, result) => {
		if (error) throw error;
		console.log(result);
	});
	return res.status(200).redirect('/');
});

router.post('/feed', (req, res) => {
	const { animalToFeed, mealAmount, mealType } = req.body;
	const ID = uuidv4();
	con.query(`SELECT DISTINCT Zookeeper_ID FROM animal WHERE ID=${animalToFeed}`, (error, results, fields) => {
		if (error) throw error;
		const { Zookeeper_ID } = results[0];
		const q =
			`INSERT INTO Animal_Meal (Animal_ID, ID, Amount, Zookeeper_ID, Type) ` +
			`VALUES (${animalToFeed}, "${ID}", ${mealAmount}, ${Zookeeper_ID}, "${mealType}")`;
		con.query(q, (error, result) => {
			if (error) throw error;
			console.log(result);
			return res.status(200).redirect('/');
		});
	});
});

module.exports = router;
