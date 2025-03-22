
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TimeSelectorProps {
  label: string;
  onChange: (selectedTimes: Array<{day: string, time: string}>) => void;
  initialSelected?: Array<{day: string, time: string}>;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ label, onChange, initialSelected = [] }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const times = ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00']; // Reduced number of time slots
  
  const [selectedSlots, setSelectedSlots] = useState<Array<{day: string, time: string}>>(initialSelected);
  
  useEffect(() => {
    if (initialSelected && initialSelected.length > 0) {
      setSelectedSlots(initialSelected);
      onChange(initialSelected);
    }
  }, [initialSelected, onChange]);
  
  const toggleTimeSlot = (day: string, time: string) => {
    const slotIndex = selectedSlots.findIndex(
      slot => slot.day === day && slot.time === time
    );
    
    let newSelectedSlots;
    
    if (slotIndex === -1) {
      // Add the time slot
      newSelectedSlots = [...selectedSlots, { day, time }];
    } else {
      // Remove the time slot
      newSelectedSlots = selectedSlots.filter((_, index) => index !== slotIndex);
    }
    
    setSelectedSlots(newSelectedSlots);
    onChange(newSelectedSlots);
  };
  
  const isSelected = (day: string, time: string) => {
    return selectedSlots.some(slot => slot.day === day && slot.time === time);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <Label>{label}</Label>
      
      <div className="bg-white rounded-lg shadow-soft border overflow-hidden">
        <div className="overflow-x-auto" style={{ maxWidth: '100%' }}>
          <div className="min-w-[460px]"> {/* Reduced min-width from 600px to 460px */}
            {/* Day header */}
            <div className="grid grid-cols-8 border-b">
              <div className="p-2 font-medium text-muted-foreground"></div>
              {days.map(day => (
                <div key={day} className="p-2 font-medium text-center text-xs">
                  {/* Reduced padding from p-3 to p-2 and added text-xs */}
                  {day}
                </div>
              ))}
            </div>
            
            {/* Time slots */}
            {times.map(time => (
              <div key={time} className="grid grid-cols-8 border-b last:border-0">
                <div className="p-2 text-xs text-muted-foreground border-r">
                  {/* Reduced padding from p-3 to p-2 and text-sm to text-xs */}
                  {time}
                </div>
                {days.map(day => (
                  <div key={`${day}-${time}`} className="p-1 text-center">
                    <button
                      type="button"
                      onClick={() => toggleTimeSlot(day, time)}
                      className={cn(
                        "w-full h-full rounded transition-all",
                        isSelected(day, time)
                          ? "bg-primary/90 text-white hover:bg-primary"
                          : "hover:bg-primary/10"
                      )}
                      aria-pressed={isSelected(day, time)}
                    >
                      <span className="sr-only">
                        {isSelected(day, time) ? `Remove ${day} at ${time}` : `Add ${day} at ${time}`}
                      </span>
                      <div className="w-full h-4"></div> {/* Reduced height from h-5 to h-4 */}
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSelector;
