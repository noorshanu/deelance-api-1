const express = require('express');
const validate = require('../../middlewares/validate');
const CollectionController = require('../../modules/collections/controller')
const Collectionvalidation = require('../../modules/collections/validation')
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/addcollection', auth("manageUsers"), validate(Collectionvalidation.addCollection), CollectionController.addCollection);
router.get('/getCollection/:id', auth("manageUsers"), CollectionController.getAllCollection);

module.exports = router;

