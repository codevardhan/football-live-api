import express from 'express';
import cors from 'cors';
import { getDataFromCompName } from './scraper.js';

const app = express();
const PORT = process.env.PORT || 5009;

app.use(cors());

app.get('/:country/:comp', async (req, res, next) => {
  try {
    const { country, comp } = req.params;
    const data = await getDataFromCompName(country, comp);
    console.log(data)
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

app.listen(PORT, () => console.log(`🚀 Server ready at http://localhost:${PORT}/`));
