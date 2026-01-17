const express = require('express');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(express.json());

// Utility
function isFuture(date) {
  return new Date(date) > new Date();
}

// 1️⃣ Create Reservation
app.post('/reservations', (req, res) => {
  const { room_id, user_name, start_time, end_time } = req.body;

  if (!room_id || !user_name || !start_time || !end_time) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  if (new Date(start_time) >= new Date(end_time)) {
    return res.status(400).json({ error: 'Start time must be before end time' });
  }

  if (!isFuture(start_time)) {
    return res.status(400).json({ error: 'Reservations must be in the future' });
  }

  // Overlap check
  const overlapQuery = `
    SELECT * FROM reservations
    WHERE room_id = ?
    AND (
      start_time < ?
      AND end_time > ?
    )
  `;

  db.get(overlapQuery, [room_id, end_time, start_time], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (row) {
      return res.status(409).json({
        error: 'Room already reserved for this time period'
      });
    }

    db.run(
      `INSERT INTO reservations (room_id, user_name, start_time, end_time)
       VALUES (?, ?, ?, ?)`,
      [room_id, user_name, start_time, end_time],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
          id: this.lastID,
          room_id,
          user_name,
          start_time,
          end_time
        });
      }
    );
  });
});

// 2️⃣ List All Reservations
app.get('/reservations', (req, res) => {
  db.all(
    `SELECT * FROM reservations ORDER BY start_time`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

app.get('/reservations/room/:roomId', (req, res) => {
  const { roomId } = req.params;

  db.all(
    `
    SELECT *
    FROM reservations
    WHERE room_id = ?
    ORDER BY start_time
    `,
    [roomId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows); // empty array if none found
    }
  );
});


// 3️⃣ Delete Reservation
app.delete('/reservations/:id', (req, res) => {
  const { id } = req.params;

  db.run(
    `DELETE FROM reservations WHERE id = ?`,
    [id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Reservation not found' });
      }
      res.json({ message: 'Reservation deleted' });
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`Reservation API running on http://localhost:${PORT}`);
});
