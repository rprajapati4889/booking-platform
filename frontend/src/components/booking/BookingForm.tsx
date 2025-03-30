import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { BookingFormData, BookingType, BookingSlot } from '@/types/booking';
import { useBooking } from '@/contexts/BookingContext';
import { useToast } from '@/components/ui/use-toast';

// Form validation schema
const bookingSchema = z.object({
  customerName: z.string().min(2, 'Customer name must be at least 2 characters'),
  customerEmail: z.string().email('Please enter a valid email address'),
  bookingDate: z.date({
    required_error: 'Please select a date',
  }),
  bookingType: z.enum(['Full Day', 'Half Day', 'Custom'] as const, {
    required_error: 'Please select a booking type',
  }),
  bookingSlot: z.enum(['First Half', 'Second Half'] as const).optional(),
  bookingTime: z.string().optional(),
}).refine((data) => {
  if (data.bookingType === 'Half Day' && !data.bookingSlot) {
    return false;
  }
  if (data.bookingType === 'Custom' && !data.bookingTime) {
    return false;
  }
  return true;
}, {
  message: "Please fill in all required fields",
  path: ['bookingType']
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const BookingForm: React.FC = () => {
  const { bookingState, addBooking } = useBooking();
  const { toast } = useToast();
  const [isBookingCreated, setIsBookingCreated] = useState(false);
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      bookingType: 'Full Day',
    }
  });
  
  const bookingType = form.watch('bookingType');
  
  const onSubmit = async (values: BookingFormValues) => {
    try {
      await addBooking(values as BookingFormData);
      setIsBookingCreated(true);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleNewBooking = () => {
    setIsBookingCreated(false);
    form.reset({
      customerName: '',
      customerEmail: '',
      bookingType: 'Full Day',
    });
  };
  
  // Generate time options for the custom booking
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i < 10 ? `0${i}` : `${i}`;
    return `${hour}:00`;
  });
  
  return (
    <Card className="max-w-lg mx-auto bg-white shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create a Reservation</CardTitle>
        <CardDescription>
          Fill in the details to make a new reservation
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isBookingCreated ? (
          <div className="space-y-4">
            <div className="bg-green-100 text-green-800 p-4 rounded-md">
              Your booking has been created successfully!
            </div>
            <Button onClick={handleNewBooking} className="w-full">
              Create Another Booking
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} disabled={bookingState.isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="john.doe@example.com" 
                        {...field} 
                        disabled={bookingState.isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bookingDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Booking Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={bookingState.isLoading}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => 
                            date < new Date() || bookingState.isLoading
                          }
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bookingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booking Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                      disabled={bookingState.isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select booking type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Full Day">Full Day</SelectItem>
                        <SelectItem value="Half Day">Half Day</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {bookingType === 'Half Day' && (
                <FormField
                  control={form.control}
                  name="bookingSlot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Booking Slot</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={bookingState.isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select booking slot" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="First Half">First Half (Morning)</SelectItem>
                          <SelectItem value="Second Half">Second Half (Afternoon)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {bookingType === 'Custom' && (
                <FormField
                  control={form.control}
                  name="bookingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Booking Time</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={bookingState.isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select booking time">
                              <Clock className="mr-2 h-4 w-4" />
                              <span>Select time</span>
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={bookingState.isLoading}
              >
                {bookingState.isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Booking...
                  </>
                ) : (
                  'Create Booking'
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingForm;
