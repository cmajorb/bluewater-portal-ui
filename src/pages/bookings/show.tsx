import {
  Stack,
  Typography,
  Divider,
  Card,
  CardContent,
  Grid,
  Paper,
  Box,
} from "@mui/material";
import { useList, usePermissions, useShow } from "@refinedev/core";
import { Show } from "@refinedev/mui";
import { format } from "date-fns";
import { ChecklistAccordion } from "../../components/Checklist";
import { Booking, Checklist, Profile, Room } from "../../types";

const checkInChecklist: Checklist = {
  id: 1,
  title: "Check-in Checklist",
  active: true,
  scope: "cumulative",
  items: [
    {
      id: 0,
      text: "Bring your own bedding and towels (if possible)",
      order: 0,
      checklist_id: 1,
      required: true,
    },
    {
      id: 1,
      text: "Turn on water",
      order: 1,
      checklist_id: 1,
      required: true,
      picture_ids: [1, 2],
    },
    {
      id: 2,
      text: "Turn on breakers",
      order: 2,
      checklist_id: 1,
      required: true,
    },
  ],
  tags: [],
};

const checkOutChecklist: Checklist = {
  id: 2,
  title: "Check-out Checklist",
  active: true,
  scope: "cumulative",
  items: [
    {
      id: 3,
      text: "Laundry started",
      order: 0,
      checklist_id: 2,
      required: true,
    },
    {
      id: 4,
      text: "Wash dishes",
      order: 1,
      checklist_id: 2,
      required: true,
    },
    {
      id: 5,
      text: "Clean bathrooms",
      order: 2,
      checklist_id: 2,
      required: true,
    },
    {
      id: 6,
      text: "Vacuum and mop",
      order: 3,
      checklist_id: 2,
      required: true,
    },
    {
      id: 7,
      text: "Empty trash",
      order: 4,
      checklist_id: 2,
      required: true,
    },
    {
      id: 8,
      text: "Lock doors",
      order: 5,
      checklist_id: 2,
      required: true,
    },
  ],
  tags: [],
};
export const BookingShow = () => {
  const { query } = useShow({});
  const { data, isLoading } = query;
  const booking = data?.data as Booking;
  const { data: permissionsData } = usePermissions();
  const permissions = (permissionsData as string[]) ?? [];
  const isAdmin = permissions.includes("admin");


  const { data: profilesData } = useList({ resource: "profiles" });
  const { data: roomsData } = useList({ resource: "rooms" });
  const allProfiles = profilesData?.data as Profile[] || [];
  const allRooms = roomsData?.data as Room[] || [];

  const formatDateTime = (date: string, time?: string) =>
    format(new Date(date + "T" + (time || "12:00")), "eeee, MMMM d, yyyy @ h:mm a");

  const guestsByRoom: Record<string, any[]> = {};
  booking?.guests.forEach((guest: any) => {
    if (!guest.room_id) return;
    if (!guestsByRoom[guest.room_id]) {
      guestsByRoom[guest.room_id] = [];
    }
    guestsByRoom[guest.room_id].push(guest);
  });

  return (
    <Show isLoading={isLoading}
    canEdit={isAdmin}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h4" fontWeight="bold">
            Welcome to Bluewater Heritage Ranch
          </Typography>

          <Typography variant="body1">
            We're thrilled to have you stay with us. This page contains everything you'll need for your upcoming visit. Our ranch has a rich history rooted in generations of tradition, and we're excited to share a piece of that heritage with you.
          </Typography>

          <Divider />

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Check-In
              </Typography>
              {booking?.arrival_time && (
                <Typography>
                  {formatDateTime(booking?.start_date, booking?.arrival_time)}
                </Typography>)
              }
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Check-Out
              </Typography>
              {booking?.arrival_time && (
                <Typography>
                  {formatDateTime(booking?.end_date, booking?.departure_time)}
                </Typography>)
              }
              <Typography>
              </Typography>
            </Grid>
          </Grid>

          {booking?.note && (
            <>
              <Divider />
              <Typography variant="h6" fontWeight="bold">
                Special Notes
              </Typography>
              <Typography>{booking.note}</Typography>
            </>
          )}

          <Divider />

          <Typography variant="h6" fontWeight="bold">
            Room Assignments
          </Typography>
          <Stack spacing={2} direction="row" flexWrap="wrap">
            {Object.entries(guestsByRoom).map(([roomId, guests]) => {
              const room = (allRooms as Room[]).find((r: Room) => r.id === Number(roomId));
              return (
                <Card
                  key={roomId}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    width: 300,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                      {room?.name || "Unnamed Room"}
                    </Typography>
                    <Box display="flex" justifyContent="space-between">
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {room?.floor} floor
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Bed size: {room?.bed_size}
                        </Typography>
                      </Box>
                      <Box>
                        <ul style={{ margin: 0, paddingLeft: "1rem" }}>
                          {guests.map((guest: any, index: number) => {
                            const member = allProfiles.find((m: any) => m.id === guest.profile_id);
                            return (
                              <li key={index}>
                                {member?.first_name} {member?.last_name}
                              </li>
                            );
                          })}
                        </ul>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>

          <Divider />

          <Typography variant="h6" fontWeight="bold">
            Information
          </Typography>
          <Typography>Gate Code: 2719</Typography>

          <Divider />

          <ChecklistAccordion
            checklist={checkInChecklist}
          />

          <ChecklistAccordion
            checklist={checkOutChecklist}
          />
        </Stack>
      </Paper>
    </Show>
  );
};
