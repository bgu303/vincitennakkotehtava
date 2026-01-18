const express = require('express');
const router = express.Router();
const db = require('../database');

// Create reservation
router.post('/', (req, res) => {
  const { room_id, user_name, start_time, end_time } = req.body;

  if (!room_id || !user_name || !start_time || !end_time) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  if (new Date(start_time) >= new Date(end_time)) {
    return res.status(400).json({ error: 'Start time must be before end time' });
  }

  if (new Date(start_time) <= new Date()) {
    return res.status(400).json({ error: 'Reservations must be in the future' });
  }

  const overlapQuery = `
    SELECT 1 FROM reservations
    WHERE room_id = ?
    AND start_time < ?
    AND end_time > ?
  `;

  db.get(overlapQuery, [room_id, end_time, start_time], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    if (row) {
      return res.status(409).json({
        error: 'Room already reserved for this time period'
      });
    }

    db.run(
      `
      INSERT INTO reservations (room_id, user_name, start_time, end_time)
      VALUES (?, ?, ?, ?)
      `,
      [room_id, user_name, start_time, end_time],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });

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

// List all reservations
router.get('/', (req, res) => {
  db.all(
    `SELECT * FROM reservations ORDER BY start_time`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// List reservations by room
router.get('/room/:roomId', (req, res) => {
  db.all(
    `
    SELECT *
    FROM reservations
    WHERE room_id = ?
    ORDER BY start_time
    `,
    [req.params.roomId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Delete reservation
router.delete('/:id', (req, res) => {
  db.run(
    `DELETE FROM reservations WHERE id = ?`,
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Reservation not found' });
      }

      res.json({ message: 'Reservation deleted' });
    }
  );
});

module.exports = router;
