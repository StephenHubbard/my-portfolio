require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true}));
// app.use(bodyParser.json());
app.use(express.static('./'))


app.listen(4545, () => {
    console.log("Listening on port 4545")
})