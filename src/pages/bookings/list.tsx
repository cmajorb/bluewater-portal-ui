import { useList, useMany, useNavigation } from "@refinedev/core";
import React from "react";
import { List, CreateButton } from "@refinedev/mui";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box, CircularProgress, Typography, IconButton, Button } from "@mui/material";
import { addDays, format } from "date-fns";
import { Booking, Event, Profile } from "../../types";
import { EventContentArg } from "@fullcalendar/core";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

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
  const { data: bookingData, isLoading: bookingsLoading } = useList({ resource: "bookings" });
  const { data: eventData, isLoading: eventsLoading } = useList({ resource: "events" });
  const { show } = useNavigation();

  const bookings = bookingData?.data as Booking[] || [];

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
    bookings
      ?.map((booking) => booking.submitter_id)
      .filter((id) => id != null) ?? [];

  const { data: profileData, isLoading: profilesLoading } = useMany({
    resource: "profiles",
    ids: submitterIds,
    queryOptions: {
      enabled: submitterIds.length > 0,
    },
  });

  const profiles = profileData?.data as Profile[] || [];

  const colorMap = new Map<number | string, string>();
  let colorIndex = 0;

  const getColorForSubmitter = (id: number) => {
    if (!colorMap.has(id)) {
      colorMap.set(id, colorPalette[colorIndex % colorPalette.length]);
      colorIndex++;
    }
    return colorMap.get(id)!;
  };

  const bookingHighlights =
    bookings.map((booking) => {
      const profile = profiles.find(
        (p) => p.id === booking.submitter_id
      );

      const title = profile
        ? `${profile.first_name} ${profile.last_name}`
        : `Booking #${booking.id}`;

      const color = getColorForSubmitter(booking.submitter_id ?? -1);

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


  const allCalendarEntries = [...bookingHighlights, ...eventHighlights];
  const [monthTitle, setMonthTitle] = React.useState<string>(format(new Date(), "MMMM yyyy"));
  const calendarRef = React.useRef<FullCalendar | null>(null);

  return (
    <List headerButtons={<CreateButton />} title="Booking Calendar">
      <Box
        sx={{
          mt: 2,
          position: "relative",
          minHeight: 360,
          height: { xs: "calc(100dvh - 10rem)", sm: "calc(100dvh - 10rem)" },
        }}
      >
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", mb: 1, gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "nowrap", whiteSpace: "nowrap" }}>
            <Button variant="contained" size="small" onClick={() => calendarRef.current?.getApi().today()}>Today</Button>
            <IconButton onClick={() => calendarRef.current?.getApi().prev()} aria-label="Previous">
              <ChevronLeftIcon />
            </IconButton>
            <IconButton onClick={() => calendarRef.current?.getApi().next()} aria-label="Next">
              <ChevronRightIcon />
            </IconButton>
          </Box>
          <Typography variant="h6" sx={{ textAlign: "center" }}>{monthTitle}</Typography>
          <Box />
        </Box>
        <Box sx={{ height: "100%" }}>
          <FullCalendar
            ref={calendarRef}
            height={"100%"}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            handleWindowResize={true}
            headerToolbar={false}
            datesSet={(arg) => {
              try {
                setMonthTitle(format(arg.start, "MMMM yyyy"));
              } catch (e) {
                console.error(e);
              }
            }}
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
        {(bookingsLoading || eventsLoading || profilesLoading) && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>
    </List>
  );
};
