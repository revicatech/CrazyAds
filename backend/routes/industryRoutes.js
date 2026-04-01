const router = require('express').Router();
const { getAll, getById, create, update, remove } = require('../controllers/industryController');
const { protect } = require('../middleware/auth');

router.route('/').get(getAll).post(protect, create);
router.route('/:id').get(getById).put(protect, update).delete(protect, remove);

module.exports = router;
