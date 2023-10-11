const express = require('express');
const router = express.Router();
const isUserAuthenticated = require('../helpers/auth');

// Controller
const ThoughtsController = require('../controllers/ThoughtsController');

router.get('/add', isUserAuthenticated, ThoughtsController.createThought);
router.post('/add', isUserAuthenticated, ThoughtsController.saveThought);
router.get('/edit/:id', isUserAuthenticated, ThoughtsController.editThought);
router.post('/edit', isUserAuthenticated, ThoughtsController.updateThought);
router.get(
  '/dashboard',
  isUserAuthenticated,
  ThoughtsController.showThoughtsDashboard
);
router.post('/remove', isUserAuthenticated,ThoughtsController.deleteThought);
router.get('/', ThoughtsController.showThoughts);

module.exports = router;
