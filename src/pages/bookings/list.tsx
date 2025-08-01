import { useList, useMany, useNavigation } from "@refinedev/core";
import { List, CreateButton } from "@refinedev/mui";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box } from "@mui/material";
import { addDays, format } from "date-fns";
import { Event } from "../../types";
import { EventContentArg } from "@fullcalendar/core";

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
  const { data: eventData } = useList({ resource: "events" });
  const { show } = useNavigation();

  const events = (eventData?.data || []) as Event[];

  const eventHighlights =
    events.map((event) => ({
      id: `event-${event.id}`,
      title: event.name,
      start: toISODateTime(event.start_date, "00:00", "00:00"),
      end: toISODateTime(
        format(addDays(new Date(event.end_date), 2), "yyyy-MM-dd"),
        "23:59", "23:59"
      ),
      allDay: true,
      display: "background",
    })) ?? [];

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

  const bookings =
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

  function renderEventContent(eventContent: EventContentArg) {
    if (eventContent.event.id.startsWith("event-")) {
      return (
        <>
          <div style={{ color: "#000", marginLeft: "0.25rem" }}>
            {eventContent.event.title}
          </div>
        </>
      );
    }
    return (
      <>
        <b>{eventContent.timeText} </b>
        {eventContent.event.title}
      </>
    )
  }


  const allCalendarEntries = [...bookings, ...eventHighlights];

  return (
    <List headerButtons={<CreateButton />} title="Booking Calendar">
      <Box sx={{ mt: 2 }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          events={allCalendarEntries}
          editable={false}
          eventContent={renderEventContent}
          eventClick={(info) => {
            const id = info.event.id;
            if (id.startsWith("event-")) {
              const eventId = id.replace("event-", "");
              show("events", eventId);
            } else {
              show("bookings", id);
            }
          }}
        />
      </Box>
    </List>
  );
};
