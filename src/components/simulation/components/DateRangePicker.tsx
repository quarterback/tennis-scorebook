
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

interface DateRangePickerProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  selectedYear: number;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  disabled?: boolean;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  selectedYear,
  onStartDateChange,
  onEndDateChange,
  disabled = false
}) => {
  const [startDateOpen, setStartDateOpen] = React.useState(false);
  const [endDateOpen, setEndDateOpen] = React.useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="start-date">Season Start Date</Label>
        <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, 'MMM d, yyyy') : 'Select date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => {
                onStartDateChange(date);
                setStartDateOpen(false);
              }}
              defaultMonth={new Date(selectedYear, 2, 1)} // Default to March of selected year
              disabled={(date) => 
                date > (endDate || new Date(`${selectedYear}-12-31`)) || 
                date < new Date(`${selectedYear}-01-01`)
              }
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="end-date">Season End Date</Label>
        <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, 'MMM d, yyyy') : 'Select date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => {
                onEndDateChange(date);
                setEndDateOpen(false);
              }}
              defaultMonth={new Date(selectedYear, 4, 1)} // Default to May of selected year
              disabled={(date) => 
                date < (startDate || new Date(`${selectedYear}-01-01`)) || 
                date > new Date(`${selectedYear}-12-31`)
              }
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateRangePicker;
