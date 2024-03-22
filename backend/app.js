import path , { dirname }  from 'path';
import fs from 'node:fs/promises';

import bodyParser from 'body-parser';
import express from 'express';


import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const app = express();

app.use(express.static('./images'));
app.use(bodyParser.json());

// CORS

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // allow all domains
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  next();
});

app.get('/places', async (req, res) => {
//  const fileContent = await fs.readFile('./backend/data/places.json');
    const placesFilePath = path.resolve(__dirname, './data/places.json');
    const fileContent = await fs.readFile(placesFilePath);


  const placesData = JSON.parse(fileContent);

  res.status(200).json({ places: placesData });
});

app.get('/user-places', async (req, res) => {
//  const fileContent = await fs.readFile('./backend/data/user-places.json');
  const placesFilePath = path.resolve(__dirname, './data/user-places.json');
  const fileContent = await fs.readFile(placesFilePath);

  const places = JSON.parse(fileContent);

  res.status(200).json({ places });
});

app.put('/user-places', async (req, res) => {
  const places = req.body.places;
  console.log(" places  : ",places)
  const placesFilePath = path.resolve(__dirname, './data/user-places.json');
  await fs.writeFile(placesFilePath, JSON.stringify(places));

  res.status(200).json({ message: 'User places updated!' });
});

// 404
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  res.status(404).json({ message: '404 - Not Found' });
});

app.listen(3000);
