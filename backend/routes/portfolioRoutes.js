const router = require('express').Router();
const { getAll, getById, getBySlug, create, update, remove } = require('../controllers/portfolioController');
const { protect } = require('../middleware/auth');

router.route('/').get(getAll).post(protect ,create);
router.get('/slug/:slug', getBySlug);
router.route('/:id').get(getById).put(protect, update).delete(protect, remove);

module.exports = router;
