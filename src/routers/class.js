const express = require('express');
const router = express.Router();
const classController = require('../controllers/class');
const { verifyToken, isAdmin } = require('../middlewares/auth');

router.post('/', verifyToken, isAdmin, classController.createClass);
router.put('/:id/assign-teacher', verifyToken, isAdmin, classController.assignTeacher);
router.get('/', verifyToken, classController.getAllClasses);
router.put('/:id', verifyToken, isAdmin, classController.updateClass);
router.delete('/:id', verifyToken, isAdmin, classController.deleteClass);

module.exports = router;