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

app.listen(process.env.PORT || PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
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
			res.render('home', arg);
		})
		.catch((err) => console.error(err));
});

app.post('/animal', (req, res) => {
	const { name, age, kind } = req.body;
	const q = `INSERT INTO animal (Name, Age, Species) VALUES ("${name}", ${age}, "${kind}")`;
	con.query(q, (error, result) => {
		if (error) throw error;
		console.log(result);
	});
	return res.status(200).redirect('/');
});

app.post('/staff', (req, res) => {
	const { name } = req.body;
	const q = `INSERT INTO staff (Name) VALUES ("${name}")`;
	con.query(q, (error, result) => {
		if (error) throw error;
		console.log(result);
	});
	return res.status(200).redirect('/');
});

// app.delete('/staff', (req,res) => {
// 	con.query(`DELETE FROM staff WHERE ID=${id}`, (error, results, fields) => {
// 		if (error) throw error;
// 		return res.status(200).render('staff', {staffs: results});
// 	});
// });

app.post('/cleanCage', (req, res) => {
	const { cleaningStaff, cageToClean } = req.body;
	const q = `REPLACE INTO Cleans (Zookeeper_ID, Cage_ID) VALUES (${cleaningStaff}, ${cageToClean})`;
	con.query(q, (error, result) => {
		if (error) throw error;
		console.log(result);
		return res.status(200).redirect('/');
	});
});
