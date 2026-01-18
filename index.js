const express = require('express');
const reservationsRouter = require('./routes/reservations');

const app = express();
const PORT = 3000;

app.use(express.json());

// Routes
app.use('/reservations', reservationsRouter);

// Health check (optional but nice)
app.get('/', (req, res) => {
  res.send('Reservation API is running');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
