import { useList, useNavigation } from "@refinedev/core";
import { List, CreateButton } from "@refinedev/mui";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box } from "@mui/material";

const toISODateTime = (
  dateStr: string,
  timeStr: string | null,
  fallbackTime: string
) => {
  const time = timeStr ?? fallbackTime;
  return new Date(`${dateStr}T${time}`).toISOString();
};

export const BookingList = () => {
  const { data } = useList({ resource: "bookings" });
  const { edit } = useNavigation();

  const events =
    data?.data.map((booking) => {
      const start = toISODateTime(booking.start_date, booking.arrival_time, "00:00");
      const end = toISODateTime(booking.end_date, booking.departure_time, "23:59");

      return {
        id: booking.id!.toString(),
        title: `Booking #${booking.id}`,
        start: start ?? booking.start_date,
        end: end ?? booking.end_date,
        allDay: false,
        extendedProps: {
          note: booking.note,
        },
      };
    }) || [];

  return (
    <List headerButtons={<CreateButton />} title="Booking Calendar">
      <Box sx={{ mt: 2 }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          events={events}
          editable={false}
          eventClick={(info) => {
            edit("bookings", info.event.id);
          }}
        />
      </Box>
    </List>
  );
};
