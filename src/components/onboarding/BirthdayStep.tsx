import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Calendar as CalendarLucide } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface BirthdayStepProps {
  value: string;
  onChange: (value: string) => void;
}

const BirthdayStep = ({ value, onChange }: BirthdayStepProps) => {
  const [date, setDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      onChange(format(selectedDate, "yyyy-MM-dd"));
    }
  };

  return (
    <div className="text-center space-y-6">
      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
        <CalendarLucide className="w-6 h-6 text-primary-foreground" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-2">When's your birthday?</h2>
        <p className="text-muted-foreground">
          We use this to personalize your experience
        </p>
      </div>
      
      <div className="space-y-2">
        <Label>Date of Birth</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-left font-normal border border-input bg-background hover:bg-muted",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick your birthday</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default BirthdayStep;