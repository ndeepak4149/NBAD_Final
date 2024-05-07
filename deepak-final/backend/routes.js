const express = require('express');
const router = express.Router();
const jwtCheck = require('./jwtCheck');
const controller=require('./controller');

// Authentication Routes
router.post("/login", controller.login);
router.post("/signup", controller.signUp);
router.post("/refreshToken", controller.newToken);

// General Routes
router.get('/categories', controller.getListCategories);

// Budget Routes
router.post('/budget', jwtCheck, controller.addB);
router.get('/budget', jwtCheck, controller.getB);
router.put('/budget/:id', jwtCheck, controller.updateB);
router.delete('/budget/:id', jwtCheck, controller.deleteB);

// Expense Routes
router.post('/expense', jwtCheck, controller.addE);
router.get('/expense', jwtCheck, controller.getE);
router.put('/expense/:id', jwtCheck, controller.updateE);
router.delete('/expense/:id', jwtCheck, controller.deleteE);
router.get('/expense/monthly', jwtCheck, controller.monthly);

module.exports = router;
