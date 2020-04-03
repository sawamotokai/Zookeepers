const express = require('express');
const app = express();
const mysql = require('mysql');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const uuid = require('uuid');

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

// app.post('/animal/feed', (req, res) => {
// 	const { animalId } = req.body;
// 	const q = `REPLACE INTO Cleans (Animal_ID) VALUES (${animalId})`;
// 	con.query(q, (error, result) => {
// 		if (error) throw error;
// 		console.log(result);
// 		return res.status(200).redirect('/');
// 	});
// });

app.post('/staff', (req, res) => {
	const { name } = req.body;
	const q = `INSERT INTO staff (Name) VALUES ("${name}")`;
	con.query(q, (error, result) => {
		if (error) throw error;
		console.log(result);
	});
	return res.status(200).redirect('/');
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

app.get('/guest/demographic', (req,res) => {
	con.query('SELECT count(*) FROM Ticket', (error, results, fields) => {
		if (error) throw error;
		console.log(results);
		return res.status(200).render('demographic', {guests: results, clickHandler: 'func1()'});
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

app.get('/show', (req,res) => {
	con.query('SELECT show_name, show_time FROM shows', (error, results, fields) => {
		if (error) throw error;
		console.log(results);
		return res.status(200).render('shows', {shows: results, clickHandler: 'func1()'});
	});
});

app.get('/show/popular', (req,res) => {
	con.query('SELECT Show_Name, COUNT(Guest_ID) FROM Watches GROUP BY Show_Name HAVING COUNT(Guest_ID) > 2', (error, results, fields) => {
		if (error) throw error;
		console.log(results);
		return res.status(200).render('shows_popular', {shows: results, clickHandler: 'func1()'});
	});
});

// app.delete('/staff', (req,res) => {
// 	con.query(`DELETE FROM staff WHERE ID=${id}`, (error, results, fields) => {
// 		if (error) throw error;
// 		return res.status(200).render('staff', {staffs: results});
// 	});
// });

app.post('/cage/clean', (req, res) => {
	const { cleaningStaff, cageToClean } = req.body;
	const q = `REPLACE INTO Cleans (Zookeeper_ID, Cage_ID) VALUES (${cleaningStaff}, ${cageToClean})`;
	con.query(q, (error, result) => {
		if (error) throw error;
		console.log(result);
		return res.status(200).redirect('/');
	});
});

app.get('/cage/dirty', (req, res) => {
	const q =
		`SELECT c.Location, DATE_FORMAT(cl.Date_Time, "%H:%i %M %D %a") AS Date_Time, c.Size FROM cage c, cleans cl` +
		` WHERE c.ID=cl.Cage_ID and c.ID NOT IN (SELECT cl2.Cage_ID FROM Cleans cl2 WHERE cl2.Date_Time > ADDDATE(NOW(), INTERVAL -1 DAY))`;
	con.query(q, (error, results, fields) => {
		if (error) throw error;
		console.log(results);
		res.render('dirtyCage', { cages: results });
	});
});
