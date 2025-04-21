const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());
// Middleware
app.use(express.json());

// In-memory store for user preferences and feedback
let userPreferences = {}; // { email: { preferences } }
let feedbackStore = []; // [{ email, message }]

// Helper function to calculate break times
const calculateBreaks = (start, end, style, crashTime, preferences = {}) => {
  const startTime = new Date(`2025-04-21 ${start}`);
  const endTime = new Date(`2025-04-21 ${end}`);
  const crash = new Date(`2025-04-21 ${crashTime}`);

  let breakCount, breakDuration;
  switch (style) {
    case 'deep':
      breakCount = 3;
      breakDuration = 20;
      break;
    case 'casual':
      breakCount = 5;
      breakDuration = 10;
      break;
    case 'mixed':
      breakCount = 4;
      breakDuration = 15;
      break;
    default:
      breakCount = 3;
      breakDuration = 20;
  }

  // Adjust based on user preferences (from questionnaire)
  if (preferences.tooFewBreaks === 'yes') breakCount += 1;
  if (preferences.tooManyBreaks === 'yes') breakCount = Math.max(1, breakCount - 1);
  if (preferences.wereBreaksLongEnough === 'no') breakDuration += 5;
  if (preferences.feltCrushed === 'yes' && preferences.crashTime) {
    const userCrash = new Date(`2025-04-21 ${preferences.crashTime}`);
    if (userCrash > startTime && userCrash < endTime) crash.setTime(userCrash.getTime());
  }

  const totalWorkMinutes = (endTime - startTime) / (1000 * 60);
  const interval = totalWorkMinutes / (breakCount + 1);
  
  // Ensure a break is scheduled before crash time
  const breaks = [];
  let currentTime = new Date(startTime);
  for (let i = 0; i < breakCount; i++) {
    currentTime.setMinutes(currentTime.getMinutes() + interval);
    if (currentTime > crash && !breaks.some(b => b.time < crashTime)) {
      breaks.push({
        time: crash.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: breakDuration + 5, // Extra time before crash
      });
      currentTime.setTime(crash.getTime()); // Reset to after crash
    }
    breaks.push({
      time: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: breakDuration,
    });
  }

  return breaks.filter(b => new Date(`2025-04-21 ${b.time}`) <= endTime);
};

// Endpoint to calculate breaks
app.post('/schedule', (req, res) => {
  const { start, end, style, crashTime } = req.body;
  const email = req.headers['x-user-email'] || 'default@example.com'; // Simulated auth
  const preferences = userPreferences[email] || {};
  const breaks = calculateBreaks(start, end, style, crashTime, preferences);
  res.json(breaks);
});

// Endpoint to save user preferences (from questionnaire)
app.post('/user-preferences', (req, res) => {
  console.log('Request body:', req.body); // Debug-Log
  if (!req.body) {
    return res.status(400).json({ error: 'Request body is missing' });
  }
  const { email, preferences } = req.body;
  if (!email || !preferences) {
    return res.status(400).json({ error: 'Email and preferences are required' });
  }
  userPreferences[email] = preferences;
  console.log('Updated preferences:', userPreferences); // Debug-Log
  res.json({ success: true });
});

// Endpoint to save feedback
app.post('/feedback', (req, res) => {
  console.log('Feedback body:', req.body); // Debug-Log
  if (!req.body) {
    return res.status(400).json({ error: 'Request body is missing' });
  }
  const { email, message } = req.body;
  if (!email || !message) {
    return res.status(400).json({ error: 'Email and message are required' });
  }
  feedbackStore.push({ email, message, timestamp: new Date() });
  console.log('Feedback store:', feedbackStore); // Debug-Log
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});