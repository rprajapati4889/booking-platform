const db = require('../config/db');

class Booking {
  static async create(userId, customerName, customerEmail, bookingDate, bookingType, bookingSlot = null, bookingTime = null) {
    try {
      console.log('Creating booking with data:', {
        userId,
        customerName,
        customerEmail,
        bookingDate,
        bookingType,
        bookingSlot,
        bookingTime
      });

      const [result] = await db.execute(
        'INSERT INTO bookings (user_id, customer_name, customer_email, booking_date, booking_type, booking_slot, booking_time) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, customerName, customerEmail, bookingDate, bookingType, bookingSlot, bookingTime]
      );

      console.log('Booking creation result:', result);
      return result.insertId;
    } catch (error) {
      console.error('Error in Booking.create:', error);
      throw error;
    }
  }

  static async checkConflict(bookingDate, bookingType, bookingSlot = null, bookingTime = null) {
    try {
      console.log('Checking conflicts for:', {
        bookingDate,
        bookingType,
        bookingSlot,
        bookingTime
      });

      let query = 'SELECT * FROM bookings WHERE booking_date = ?';
      const params = [bookingDate];

      if (bookingType === 'Full Day') {
        // If requesting full day, check if any booking exists for that day
        query += ' AND (booking_type = "Full Day" OR booking_type = "Half Day" OR booking_type = "Custom")';
      } else if (bookingType === 'Half Day') {
        // If requesting half day, check for full day bookings and conflicting half day slots
        query += ' AND (booking_type = "Full Day" OR (booking_type = "Half Day" AND booking_slot = ?))';
        params.push(bookingSlot);
      } else if (bookingType === 'Custom') {
        // For custom bookings, check time conflicts
        query += ' AND (booking_type = "Full Day" OR (booking_type = "Half Day" AND booking_slot = ?) OR (booking_type = "Custom" AND booking_time = ?))';
        const slot = parseInt(bookingTime.split(':')[0]) < 12 ? 'First Half' : 'Second Half';
        params.push(slot, bookingTime);
      }

      console.log('Conflict check query:', query);
      console.log('Conflict check params:', params);

      const [rows] = await db.execute(query, params);
      console.log('Conflict check result:', rows.length > 0 ? 'Conflict found' : 'No conflict');
      
      return rows.length > 0;
    } catch (error) {
      console.error('Error in Booking.checkConflict:', error);
      throw error;
    }
  }

  static async getBookingsByUserId(userId) {
    try {
      console.log('Getting bookings for user:', userId);
      const [rows] = await db.execute('SELECT * FROM bookings WHERE user_id = ? ORDER BY booking_date DESC', [userId]);
      console.log('Found bookings:', rows.length);
      return rows;
    } catch (error) {
      console.error('Error in Booking.getBookingsByUserId:', error);
      throw error;
    }
  }

  static async getBookingById(id) {
    const [rows] = await db.query('SELECT * FROM bookings WHERE id = ?', [id]);
    return rows[0];
  }

  static async delete(id) {
    await db.query('DELETE FROM bookings WHERE id = ?', [id]);
  }
}

module.exports = Booking;
