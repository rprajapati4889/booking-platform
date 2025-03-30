import React, { useCallback } from 'react';
import { format, isValid } from 'date-fns';
import { Calendar, Clock, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBooking } from '@/contexts/BookingContext';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const BookingList: React.FC = () => {
  console.log('BookingList component rendered');
  const { bookingState, deleteBooking } = useBooking();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [bookingToDelete, setBookingToDelete] = React.useState<string | null>(null);

  React.useEffect(() => {
    console.log('Bookings updated:', bookingState.bookings);
  }, [bookingState.bookings]);

  const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return 'No date set';
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return isValid(dateObj) ? format(dateObj, 'PPP') : 'Invalid date';
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  const handleDelete = useCallback(async (id: string) => {
    console.log('handleDelete called with ID:', id);
    try {
      const numId = Number(id);
      console.log('Converted ID to number:', numId);
      await deleteBooking(numId);
      console.log('Delete booking completed');
      setIsDeleteDialogOpen(false);
      setBookingToDelete(null);
    } catch (error) {
      console.error('Delete booking error in BookingList:', error);
      toast({
        title: "Error",
        description: "Failed to delete booking. Please try again.",
        variant: "destructive",
      });
    }
  }, [deleteBooking, toast]);
  
  if (bookingState.isLoading && !bookingState.initialized) {
    return (
      <div className="w-full p-8 text-center">
        <p>Loading bookings...</p>
      </div>
    );
  }
  
  if (!bookingState.bookings || bookingState.bookings.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <p>No bookings found. Create a new booking to get started.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Your Bookings</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        {bookingState.bookings.map((booking) => (
          booking && (
            <Card key={booking.id} className="overflow-hidden">
              <CardHeader className="bg-primary/10 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {booking.customerName || 'Unknown Customer'}
                    </CardTitle>
                    <CardDescription>
                      {booking.customerEmail || 'No email provided'}
                    </CardDescription>
                  </div>
                  <AlertDialog open={isDeleteDialogOpen && bookingToDelete === booking.id.toString()} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        disabled={bookingState.isLoading}
                        onClick={() => {
                          console.log('Delete button clicked for booking:', booking.id);
                          setBookingToDelete(booking.id.toString());
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Booking</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this booking? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                          setIsDeleteDialogOpen(false);
                          setBookingToDelete(null);
                        }}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            console.log('Delete button clicked for booking:', booking.id);
                            handleDelete(booking.id.toString());
                          }}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          disabled={bookingState.isLoading}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(booking.bookingDate)}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {booking.bookingType === 'Full Day' && 'Full Day'}
                      {booking.bookingType === 'Half Day' && `Half Day (${booking.bookingSlot || 'No slot'})`}
                      {booking.bookingType === 'Custom' && `Custom (${booking.bookingTime || 'No time'})`}
                    </span>
                  </li>
                  <li className="text-xs text-muted-foreground mt-2">
                    Created on {formatDate(booking.createdAt)}
                  </li>
                </ul>
              </CardContent>
            </Card>
          )
        ))}
      </div>
    </div>
  );
};

export default BookingList;
