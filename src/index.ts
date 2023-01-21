import express from 'express';

import { listings } from './listings';

const app = express();
const port = 9000;

app.use(express.json());
app.listen(port);

app.get('/listings', (req, res) => {
  res.send(listings);
});

// Что за ужас в курсе
app.post('/delete-listings', (req, res) => {
  const id: string = req.body.id;

  for (let i = 0; i < listings.length; i++) {
    if (listings[i].id === id) {
      return res.send(listings.splice(i, 1));
    }
  }
  return res.send('failed to delete listing');
});
