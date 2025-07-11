import { useList, useMany, useNavigation } from "@refinedev/core";
import { List, CreateButton } from "@refinedev/mui";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box } from "@mui/material";

const colorPalette = [
  "#4CAF50", // green
  "#2196F3", // blue
  "#FF9800", // orange
  "#9C27B0", // purple
  "#F44336", // red
  "#00BCD4", // cyan
  "#CDDC39", // lime
  "#E91E63", // pink
  "#3F51B5", // indigo
  "#FFC107", // amber
];

const toISODateTime = (
  dateStr: string,
  timeStr: string | null,
  fallbackTime: string
) => {
  const time = timeStr ?? fallbackTime;
  return new Date(`${dateStr}T${time}`).toISOString();
};

export const BookingList = () => {
  const { data: bookingData } = useList({ resource: "bookings" });
  const { edit } = useNavigation();

  const submitterIds =
    bookingData?.data
      ?.map((booking) => booking.submitter_id)
      .filter((id) => id != null) ?? [];

  const { data: profileData } = useMany({
    resource: "profiles",
    ids: submitterIds,
    queryOptions: {
      enabled: submitterIds.length > 0,
    },
  });

  const colorMap = new Map<number | string, string>();
  let colorIndex = 0;

  const getColorForSubmitter = (id: number | string) => {
    if (!colorMap.has(id)) {
      colorMap.set(id, colorPalette[colorIndex % colorPalette.length]);
      colorIndex++;
    }
    return colorMap.get(id)!;
  };

  const events =
    bookingData?.data.map((booking) => {
      const profile = profileData?.data.find(
        (p) => p.id === booking.submitter_id
      );

      const title = profile
        ? `${profile.first_name} ${profile.last_name}`
        : `Booking #${booking.id}`;

        const color = getColorForSubmitter(booking.submitter_id ?? "unknown");

      return {
        id: booking.id!.toString(),
        title,
        start: toISODateTime(booking.start_date, booking.arrival_time, "00:00"),
        end: toISODateTime(booking.end_date, booking.departure_time, "23:59"),
        allDay: false,
        backgroundColor: color,
        borderColor: color,
        extendedProps: {
          note: booking.note,
        },
      };
    }) ?? [];

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
