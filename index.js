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
// Use routes
app.use('/animal', animal); // anything that goes after /ideas/ pertains to ideas file
app.use('/staff', staff);
app.use('/guest', guest);
app.use('/show', show);
app.use('/cage', cage);

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

app.get('/guest', (req, res) => {
	con.query('SELECT * FROM guest', (error, results, fields) => {
		if (error) throw error;
		console.log(results);
		return res.status(200).render('guest', { guests: results, clickHandler: 'func1()' });
	});
});


app.post('/cleanCage', (req, res) => {
	const { cleaningStaff, cageToClean } = req.body;
	const q = `REPLACE INTO Cleans (Zookeeper_ID, Cage_ID) VALUES (${cleaningStaff}, ${cageToClean})`;
	con.query(q, (error, result) => {
		if (error) throw error;
		console.log(result);
		return res.status(200).redirect('/');
	});
});

//new
app.get('/donates', (req,res) => {
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

const executeQuery = function(sql) {
    let retVal;
	con.query(sql, (error, result) => {
		if (error) {
            throw error;
        }
		retVal = result;
    });
    return retVal;
};

const charityExists = function(charityName) {
    const sql = `SELECT * FROM zookeeper.charity WHERE charity_name='${charityName}'`;
    return Boolean(executeQuery(sql));
};

const addCharity = function(charityName) {
    const sql = `INSERT INTO zookeeper.charity(charity_name) VALUES('${charityName}')`;
    return executeQuery(sql);
};

const addDonation = function(guestId, charityName, donationAmount) {
    const sql = `INSERT INTO zookeeper.donates(Guest_Entry_Number, Charity_Name, Amount) VALUES(${guestId}, '${charityName}', ${donationAmount})`;
    return executeQuery(sql);
};

app.post('/donates/new', (req, res) => {
    const {guestNumber, name, amount} = req.body;
    if (!charityExists(name)) {
        addCharity(name)
    }
    addDonation(guestNumber, name, amount);
	return res.status(200).redirect('/donates');
});

app.get('/donates/sort', (req,res) => {
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

app.get('/donates/most', (req,res) => {
		let promises = [];
        	promises.push(
        		new Promise((resolve, reject) => {
        			const q = 'SELECT Charity_Name, SUM(Amount) AS Total FROM donates GROUP BY Charity_Name ORDER BY Total DESC LIMIT 1';
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

app.post('/cage/clean', (req, res) => {
	const { cleaningStaff, cageToClean } = req.body;
	const q = `REPLACE INTO Cleans (Zookeeper_ID, Cage_ID) VALUES (${cleaningStaff}, ${cageToClean})`;
	con.query(q, (error, result) => {
		if (error) throw error;
		console.log(result);
		return res.status(200).redirect('/');
	});