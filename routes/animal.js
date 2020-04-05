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
	let promises = [];
	promises.push(
		new Promise((resolve, reject) => {
			const q = `SELECT * FROM staff ORDER BY Name`;
			con.query(q, (error, results, fields) => {
				if (error) reject(error);
				// console.log(results);
				resolve({ staffs: results });
			});
		})
	);
	promises.push(
		new Promise((resolve, reject) => {
			const q = `SELECT * FROM animal`;
			con.query(q, (error, results, fields) => {
				if (error) reject(error);
				// console.log(results);
				resolve({ animals: results });
			});
		})
	);
	promises.push(
		new Promise((resolve, reject) => {
			const q = `SELECT * FROM cage`;
			con.query(q, (error, results, fields) => {
				if (error) reject(error);
				// console.log(results);
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
			res.render('animal', arg);
		})
		.catch((err) => console.error(err));
	// con.query('SELECT * FROM animal', (error, results, fields) => {
	// 	if (error) throw error;
	// 	// console.log(results);
	// 	return res.status(200).render('animal', { animals: results });
});

router.post('/', (req, res) => {
	const { name, age, kind, area, zookeeperId, vetId, gender } = req.body;
	const q = `INSERT INTO animal (Name, Age, Species, Cage_ID, Vet_ID, Zookeeper_ID, Gender) VALUES ("${name}", ${age}, "${kind}", ${area}, ${vetId}, ${zookeeperId}, '${gender}')`;
	con.query(q, (error, result) => {
		if (error) throw error;
		// console.log(result);
	});
	return res.status(200).redirect('/animal');
});

router.get('/cage/:cageId', (req, res) => {
	const { cageId } = req.params;
	con.query(
		`SELECT * FROM animal RIGHT OUTER JOIN cage ON animal.Cage_ID=cage.ID WHERE cage.ID=${cageId}`,
		(error, results, fields) => {
			if (error) throw error;
			console.log(results);
			return res.status(200).render('animalCage', { animals: results });
		}
	);
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
			// console.log(result);
			return res.status(200).redirect('/animal');
		});
	});
});

router.get('/edit/:id', (req, res) => {
	const { id } = req.params;
	const q = `SELECT * FROM animal WHERE ID=${id}`;
	con.query(q, (error, results, fields) => {
		if (error) throw error;
		// console.log(results);
		return res.status(200).render('animalEdit', { animal: results[0] });
	});
});

router.post('/edit/:id', (req, res) => {
	const { id } = req.params;
	const { name, age, species } = req.body;
	const q = `UPDATE animal SET Name='${name}', Age=${age}, Species='${species}' WHERE ID=${id}`;
	con.query(q, (error, results) => {
		if (error) throw error;
		// console.log(results);
		return res.status(200).redirect('/animal');
	});
});

router.get('/animalstofeed', (req, res) => {
	// query returns animals that have not been fed in 6hrs regardless of type of food
	const q =
		`SELECT DISTINCT a.Name, DATE_FORMAT(am.Time, "%H:%i %M %D %a") AS Time, am.Type FROM animal a, animal_meal am` +
		` WHERE a.ID=am.Animal_ID and a.ID NOT IN (SELECT am2.Animal_ID FROM animal_meal am2 WHERE am2.Time > ADDDATE(NOW(), INTERVAL -6 HOUR))`;
	con.query(q, (error, results, fields) => {
		if (error) throw error;
		// console.log(results);
		res.render('animal_feed', { animals: results });
	});
});

module.exports = router;
