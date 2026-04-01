const router = require('express').Router();
const { getAll, getBySlug, create, update, remove } = require('../controllers/caseStudyController');
const { protect } = require('../middleware/auth');

router.route('/').get(getAll).post(protect, create);
router.route('/:slug').get(getBySlug);
router.route('/:id').put(protect, update).delete(protect, remove);

module.exports = router;
