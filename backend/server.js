const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require("./routes/authRoutes");


// charger les variables d'environnement
dotenv.config();

const app = express()
const port = 4000

app.use(cors());  // autorise toutes les requêtes
app.use(express.static('public'))


app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`serveur lancé sur le port  : ${port}`)
})
