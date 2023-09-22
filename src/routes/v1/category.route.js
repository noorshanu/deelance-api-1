const express = require('express');
const validate = require('../../middlewares/validate');
const router = express.Router();
const categoryController = require("../../modules/category/controller")
const categoryValidation = require("../../modules/category/category.validation");
const auth = require('../../middlewares/auth');

router.get('/all-category', auth('manageUsers'), validate(categoryValidation.listCategory), categoryController.getAllCategory);

router.post('/add-category', auth('manageUsers'), validate(categoryValidation.addCategory), categoryController.addCategory);

router.put('/update/:id', auth('manageUsers'), validate(categoryValidation.updateCategory), categoryController.updateCategory);

router.get('/:id', auth('manageUsers'), validate(categoryValidation.getCategoryById), categoryController.getCategoryById);


module.exports = router;