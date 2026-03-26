const router = require('express').Router();
const { getAll, create, update, remove } = require('../controllers/portfolioCategoryController');

router.route('/').get(getAll).post(create);
router.route('/:id').put(update).delete(remove);

module.exports = router;
