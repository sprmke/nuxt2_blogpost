const express = require('express');
const router = express.Router();
const app = express();

// map req and res so we can use the same syntax
// that express provide us
router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request);
  Object.setPrototypeOf(req, app.response);
  req.res = res;
  res.req = req;
  next();
});

// tack analytics data
router.post('/track-data', (req, res) => {
  res.status(200).json({message: 'Success!'});
});

// export module
module.exports = {
  path: '/api',
  handler: router
}