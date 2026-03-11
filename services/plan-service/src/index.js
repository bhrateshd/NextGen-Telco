// NextGen Telco Plan Service
// Manages mobile plans, pricing, and plan features

const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'plan-service' });
});

app.get('/ready', (req, res) => {
  res.json({ ready: true });
});

// Plan endpoints
app.get('/plans', (req, res) => {
  // Get all plans
  res.json({ plans: [] });
});

app.get('/plans/:planId', (req, res) => {
  // Get specific plan
  res.json({ planId: req.params.planId });
});

app.post('/plans', (req, res) => {
  // Create new plan
  res.status(201).json({ message: 'Plan created' });
});

app.listen(PORT, () => {
  console.log(`Plan Service listening on port ${PORT}`);
});
