const Booking = require('../models/booking');

exports.createBooking = async (req, res) => {
  try {
    const { customerName, customerEmail, bookingDate, bookingType, bookingSlot, bookingTime } = req.body;
    const userId = req.user.userId;

    // Convert ISO date to YYYY-MM-DD format if needed
    const formattedDate = bookingDate.includes('T') 
      ? new Date(bookingDate).toISOString().split('T')[0]
      : bookingDate;

    console.log('Creating booking:', {
      userId,
      customerName,
      customerEmail,
      bookingDate: formattedDate,
      bookingType,
      bookingSlot,
      bookingTime
    });

    // Check for booking conflicts
    const hasConflict = await Booking.checkConflict(formattedDate, bookingType, bookingSlot, bookingTime);
    console.log('Conflict check result:', hasConflict);
    
    if (hasConflict) {
      return res.status(400).json({ error: 'This time slot is already booked' });
    }

    // Create booking
    const bookingId = await Booking.create(
      userId,
      customerName,
      customerEmail,
      formattedDate,
      bookingType,
      bookingSlot,
      bookingTime
    );

    console.log('Booking created:', { bookingId });

    res.status(201).json({
      message: 'Booking created successfully',
      bookingId
    });
  } catch (error) {
    console.error('Error in createBooking:', error);
    res.status(500).json({ error: 'Error creating booking' });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Fetching bookings for user:', userId);
    
    const bookings = await Booking.getBookingsByUserId(userId);
    console.log('Found bookings:', bookings.length);
    
    res.json(bookings);
  } catch (error) {
    console.error('Error in getBookings:', error);
    res.status(500).json({ error: 'Error fetching bookings' });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.userId;
    
    console.log('Deleting booking:', { bookingId, userId });
    
    // Check if booking exists and belongs to user
    const booking = await Booking.getBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    if (booking.user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this booking' });
    }
    
    // Delete the booking
    await Booking.delete(bookingId);
    
    console.log('Booking deleted successfully');
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error in deleteBooking:', error);
    res.status(500).json({ error: 'Error deleting booking' });
  }
};
