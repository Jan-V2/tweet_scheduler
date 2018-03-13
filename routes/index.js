let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});


router.get('/tweets', function(req, res, next) {
    res.render('tweet_list');
});

module.exports = router;
