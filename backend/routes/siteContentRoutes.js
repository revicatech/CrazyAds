const router = require('express').Router();
const { getAll, getByKey, upsert, bulkUpsert } = require('../controllers/siteContentController');
const { protect } = require('../middleware/auth');

router.route('/').get(getAll).put(protect, bulkUpsert);
router.route('/:key').get(getByKey).put(protect, upsert);

module.exports = router;
