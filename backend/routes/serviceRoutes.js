const router = require('express').Router();
const { getAll, getById, create, update, remove } = require('../controllers/serviceController');

router.route('/').get(getAll).post(create);
router.route('/:id').get(getById).put(update).delete(remove);

module.exports = router;
