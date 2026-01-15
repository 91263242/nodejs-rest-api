const express = require('express');
const router = express.Router();
const {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getCategories,
} = require('../controllers/itemController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.get('/categories', getCategories);
router.get('/', getItems);
router.get('/:id', getItem);
router.post('/', createItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports = router;
