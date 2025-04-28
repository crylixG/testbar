import * as React from "react";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimePickerProps {
  availableTimes: string[];
  selectedTime: string;
  onTimeChange: (time: string) => void;
  isLoading?: boolean;
}

export function TimePicker({
  availableTimes,
  selectedTime,
  onTimeChange,
  isLoading = false,
}: TimePickerProps) {
  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-1.5 grow">
        <Select
          value={selectedTime}
          onValueChange={onTimeChange}
          disabled={isLoading || availableTimes.length === 0}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select time">
              {selectedTime || "Select time"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <SelectItem value="loading" disabled>
                Loading available times...
              </SelectItem>
            ) : availableTimes.length === 0 ? (
              <SelectItem value="none" disabled>
                No available times
              </SelectItem>
            ) : (
              availableTimes.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-10 w-10 shrink-0"
        disabled
      >
        <Clock className="h-4 w-4" />
      </Button>
    </div>
  );
}
