const router = require('express').Router();
const { getAll, getBySlug, create, update, remove } = require('../controllers/caseStudyController');

router.route('/').get(getAll).post(create);
router.route('/:slug').get(getBySlug);
router.route('/:id').put(update).delete(remove);

module.exports = router;
