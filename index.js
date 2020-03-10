const express = require('express');
const app = express();

const PORT = 2000;

app.get('/', (req, res) => {
	res.send('hello world');
});

app.get('/api/user', (req, res) => {
	res.json({ username: 'Kevin' });
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
