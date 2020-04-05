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

router.get('/allPurchases', (req, res) => {
	con.query('SELECT gift_shop_item.Name, buys.product_ID, DATE_FORMAT(buys.time, "%H:%i %M %D %a") as time, buys.payment_method FROM zookeeper.Gift_Shop_Item, zookeeper.Buys WHERE Gift_Shop_Item.Product_ID = Buys.Product_ID', (error, results, fields) => {
		if (error) throw error;
		console.log(results);
		return res.status(200).render('allPurchases', { sales: results });
	});
});


router.get('/popularItems', (req, res) => {
	con.query('SELECT Name, COUNT(*) FROM zookeeper.Gift_Shop_Item INNER JOIN zookeeper.Buys ON gift_shop_item.Product_ID = Buys.Product_ID group by Buys.Product_ID ORDER BY Count(*) DESC', (error, results, fields) => {
		if (error) throw error;
		console.log(results);
		return res.status(200).render('popularItems', { popular: results });
	});
});
module.exports = router;
