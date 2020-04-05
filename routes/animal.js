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
	con.query('SELECT * FROM animal', (error, results, fields) => {
		if (error) throw error;
		console.log(results);
		return res.status(200).render('animal', { animals: results });
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

router.get('/animalstofeed', (req, res) => {
	// query returns animals that have not been fed in 6hrs regardless of type of food
	const q =
		`SELECT DISTINCT a.Name, DATE_FORMAT(am.Time, "%H:%i %M %D %a") AS Time, am.Type FROM animal a, animal_meal am` +
		` WHERE a.ID=am.Animal_ID and a.ID NOT IN (SELECT am2.Animal_ID FROM animal_meal am2 WHERE am2.Time > ADDDATE(NOW(), INTERVAL -6 HOUR))`;
	con.query(q, (error, results, fields) => {
		if (error) throw error;
		console.log(results);
		res.render('animal_feed', { animals: results });
	});
});

module.exports = router;
