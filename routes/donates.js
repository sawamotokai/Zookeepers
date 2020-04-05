const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const con = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
});

//new
router.get('/', (req, res) => {
	let promises = [];
	promises.push(
		new Promise((resolve, reject) => {
			const q = 'SELECT * FROM donates';
			con.query(q, (error, results, fields) => {
				if (error) reject(error);
				console.log(results);
				resolve({ donates: results });
				//return res.status(200).render('donates', {donates: results, clickHandler: 'func1()'});
			});
		})
	);
	promises.push(
		new Promise((resolve, reject) => {
			const q = `SELECT * FROM guest ORDER BY Entry_Number`;
			con.query(q, (error, results, fields) => {
				if (error) reject(error);
				console.log(results);
				resolve({ guest: results });
			});
		})
	);
	promises.push(
		new Promise((resolve, reject) => {
			const q = `SELECT * FROM charity`;
			con.query(q, (error, results, fields) => {
				if (error) reject(error);
				console.log(results);
				resolve({ charities: results });
			});
		})
	);
	Promise.all(promises)
		.then((results) => {
			let arg = {};
			results.forEach((result) => {
				arg = { ...arg, ...result };
			});
			res.render('donates', arg);
		})
		.catch((err) => console.error(err));
});

const executeQuery = async function(sql) {
	return await con.query(sql);
};

const charityExists = async function(charityName) {
	const sql = `SELECT * FROM zookeeper.charity WHERE charity_name='${charityName}'`;
	return Boolean(await executeQuery(sql));
};

const addCharity = async function(charityName) {
	const sql = `INSERT INTO zookeeper.charity(charity_name) VALUES('${charityName}')`;
	return await executeQuery(sql);
};

const addDonation = async function(guestId, charityName, donationAmount) {
	const sql = `INSERT INTO zookeeper.donates(Guest_Entry_Number, Charity_Name, Amount) VALUES(${guestId}, '${charityName}', ${donationAmount})`;
	return await executeQuery(sql);
};

router.post('/new', async (req, res) => {
	const { guestNumber, Charity_Name, amount } = req.body;

	if (!await charityExists(Charity_Name)) {
		await addCharity(Charity_Name);
	}
	await addDonation(guestNumber, Charity_Name, amount);

	return res.status(200).redirect('/donates');
});

router.get('/sort', (req, res) => {
	let promises = [];
	promises.push(
		new Promise((resolve, reject) => {
			const q = 'SELECT Charity_Name, SUM(Amount) AS Total FROM donates GROUP BY Charity_Name';
			con.query(q, (error, results, fields) => {
				if (error) reject(error);
				console.log(results);
				resolve({ donates: results });
				//return res.status(200).render('donates', {donates: results, clickHandler: 'func1()'});
			});
		})
	);
	/*promises.push(
            		new Promise((resolve, reject) => {
            			const q = `SELECT * FROM guest ORDER BY Entry_Number`;
            			con.query(q, (error, results, fields) => {
            				if (error) reject(error);
            				console.log(results);
            				resolve({ guest: results });
            			});
            		})
            	);*/
	Promise.all(promises)
		.then((results) => {
			let arg = {};
			results.forEach((result) => {
				arg = { ...arg, ...result };
			});
			res.render('donates_sort', arg);
		})
		.catch((err) => console.error(err));
	/*con.query('SELECT Charity_Name, SUM(Amount) FROM donates GROUP BY Charity_Name', (error, results, fields) => {
		if (error) throw error;
		console.log(results);
		return res.status(200).render('donates_sort', {guests: results, clickHandler: 'func1()'});
	});*/
});

router.get('/most', (req, res) => {
	let promises = [];
	promises.push(
		new Promise((resolve, reject) => {
			const q =
				'SELECT Charity_Name, SUM(Amount) AS Total FROM donates GROUP BY Charity_Name ORDER BY Total DESC LIMIT 1';
			con.query(q, (error, results, fields) => {
				if (error) reject(error);
				console.log(results);
				resolve({ donates: results });
				//return res.status(200).render('donates', {donates: results, clickHandler: 'func1()'});
			});
		})
	);
	Promise.all(promises)
		.then((results) => {
			let arg = {};
			results.forEach((result) => {
				arg = { ...arg, ...result };
			});
			res.render('donates_most', arg);
		})
		.catch((err) => console.error(err));
});

router.get('/avg', (req, res) => {
	let promises = [];
	promises.push(
		new Promise((resolve, reject) => {
			const q = 'SELECT Guest_Entry_Number, AVG(Amount) AS Avg FROM donates GROUP BY Guest_Entry_Number';
			con.query(q, (error, results, fields) => {
				if (error) reject(error);
				console.log(results);
				resolve({ donates: results });
				//return res.status(200).render('donates', {donates: results, clickHandler: 'func1()'});
			});
		})
	);
	Promise.all(promises)
		.then((results) => {
			let arg = {};
			results.forEach((result) => {
				arg = { ...arg, ...result };
			});
			res.render('donates_avg', arg);
		})
		.catch((err) => console.error(err));
});

router.get('/topdonors', (req, res) => {
	let promises = [];
	promises.push(
		new Promise((resolve, reject) => {
			const q =
				'SELECT DISTINCT x.Guest_Entry_Number FROM donates AS x WHERE NOT EXISTS(SELECT * FROM charity AS y WHERE NOT EXISTS(SELECT z.Charity_Name FROM donates AS z WHERE z.Guest_Entry_Number = x.Guest_Entry_Number AND z.Charity_Name = y.charity_name))';
			con.query(q, (error, results, fields) => {
				if (error) reject(error);
				console.log(results);
				resolve({ donates: results });
				//return res.status(200).render('donates', {donates: results, clickHandler: 'func1()'});
			});
		})
	);
	Promise.all(promises)
		.then((results) => {
			let arg = {};
			results.forEach((result) => {
				arg = { ...arg, ...result };
			});
			res.render('donates_topdonors', arg);
		})
		.catch((err) => console.error(err));
});

router.get('/alldonors', (req, res) => {
	let promises = [];
	promises.push(
		new Promise((resolve, reject) => {
			const q =
				'SELECT DISTINCT Guest_Entry_Number FROM donates';
			con.query(q, (error, results, fields) => {
				if (error) reject(error);
				console.log(results);
				resolve({ donates: results });
				//return res.status(200).render('donates', {donates: results, clickHandler: 'func1()'});
			});
		})
	);
	Promise.all(promises)
		.then((results) => {
			let arg = {};
			results.forEach((result) => {
				arg = { ...arg, ...result };
			});
			res.render('donates_alldonors', arg);
		})
		.catch((err) => console.error(err));
});

router.get('/charitieswithdonations', (req, res) => {
	let promises = [];
	promises.push(
		new Promise((resolve, reject) => {
			const q =
				'SELECT DISTINCT Charity_Name FROM donates';
			con.query(q, (error, results, fields) => {
				if (error) reject(error);
				console.log(results);
				resolve({ donates: results });
				//return res.status(200).render('donates', {donates: results, clickHandler: 'func1()'});
			});
		})
	);
	Promise.all(promises)
		.then((results) => {
			let arg = {};
			results.forEach((result) => {
				arg = { ...arg, ...result };
			});
			res.render('donates_charitieswithdonations', arg);
		})
		.catch((err) => console.error(err));
});

module.exports = router;
