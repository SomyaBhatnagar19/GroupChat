/* /server/server.js */

require('dotenv').config(); 
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to your server!!');
});
const PORT = process.env.PORT || 4000; 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
