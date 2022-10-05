const express = require('express');
const app = express();
const scraper = require("./scraper");
const cors = require('cors');

const port = 5000;
app.use(cors());

app.get('/', async (req, res) => {
  const country = req.query.country;
  const comp = req.query.comp;

  data = scraper.getDataFromCompName(country, comp);
  console.log(data);
  res.status(200).send(JSON.stringify(data));
})


app.listen(port, () => console.log(`🚀 Server ready at http://localhost:8000/`));