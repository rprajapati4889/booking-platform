const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

router.post(
  '/',
  auth,
  [
    body('customerName').trim().notEmpty(),
    body('customerEmail').isEmail(),
    body('bookingDate').isDate(),
    body('bookingType').isIn(['Full Day', 'Half Day', 'Custom']),
    body('bookingSlot').optional().isIn(['First Half', 'Second Half']),
    body('bookingTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  ],
  bookingController.createBooking
);

router.get('/', auth, bookingController.getBookings);

router.delete('/:id', auth, bookingController.deleteBooking);

module.exports = router;
