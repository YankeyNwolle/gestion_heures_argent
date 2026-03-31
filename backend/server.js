const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require("./src/routes/authRoutes");


// charger les variables d'environnement
dotenv.config();

const app = express()
const port = 5000


//  Autoriser les requêtes venant de React (port 5173 ou 3000)
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.static('public'))

// routes
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`serveur lancé sur le port  : ${port}`)
})
