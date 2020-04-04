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

//load routes
const animal = require('./routes/animal'); //modulized all routes to /ideas
const staff = require('./routes/staff');
const guest = require('./routes/guest');
const show = require('./routes/show');
const cage = require('./routes/cage');
const donates = require('./routes/donates');
// Use routes
app.use('/animal', animal); // anything that goes after /ideas/ pertains to ideas file
app.use('/staff', staff);
app.use('/guest', guest);
app.use('/show', show);
app.use('/cage', cage);
app.use('/donates', donates);

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
