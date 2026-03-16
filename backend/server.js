const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');


// charger les variables d'environnement
dotenv.config();

const app = express()
const port = 4000

app.use(cors());
app.use(express.static('public'))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`l application sera lancer sur le port : ${port}`)
})
