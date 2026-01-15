import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

type CalendarProps = {
  onDateSelect: (date: Date) => void; // callback prop
};

export default function Calendar({ onDateSelect }: CalendarProps) {
  const handleDateClick = (arg: any) => {
    const selectedDate = arg.date; // JS Date object
    onDateSelect(selectedDate); // send it to parent
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      dateClick={handleDateClick}
      events="/api/google-events"
      selectable={true}
      height="450px"
      validRange={{
        start: new Date(), // today
      }}
    />
  );
}
