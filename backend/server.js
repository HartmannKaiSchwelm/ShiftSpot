const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

app.post('/schedule', (req, res) => {
  const breaks = calculateBreaks(); // No extra object wrapper
  res.json(breaks); // Just the array
});

function calculateBreaks() {
  const now = new Date();
  const soon = new Date(now.getTime() + 2 * 60000); // 2 mins from now
  return [{
    time: soon.toTimeString().slice(0, 5), // e.g., "12:42"
    duration: '5 mins'
  }];
}

app.listen(3000, () => console.log('Shift Spot running'));