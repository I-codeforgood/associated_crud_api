const controller = require('../controller/category.contoller')
const router = require('express').Router();
const verifyToken = require('../middleware/auth.middleware');

router.get('/', verifyToken, controller.getAllCategories);
router.post('/', verifyToken, controller.addCategory);
router.put('/:categoryId', verifyToken, controller.updateCategory);
router.delete('/:categoryId', verifyToken, controller.deleteCategory);
router.post('/:categoryId/service', verifyToken, controller.addService);
router.get('/:categoryId/services', verifyToken, controller.getAllServices);
router.delete('/:categoryId/services/:serviceId', verifyToken, controller.deleteService);
router.put('/:categoryId/services/:serviceId', verifyToken, controller.updateService);


module.exports = router;