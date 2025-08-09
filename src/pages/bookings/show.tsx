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
import { Booking, Profile, Room } from "../../types";

const checkInChecklist = {
  title: "Check-in Checklist",
  items: [
    { text: "Bring your own bedding and towels (if possible)", id: 0 },
    { text: "Turn on water", id: 1, pictures: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHRZAL7HZI9E8S-ZZcBl0BWMpGrPxSgtq8hw&s", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqyj91NgnKpkE120U0vinqJhTFNOeEKqNwbQ&s"] },
    { text: "Turn on breakers", id: 2 },
  ]
};

const checkOutChecklist = {
  title: "Check-out Checklist",
  items: [
    { text: "Vacuum and mop", id: 0 },
    { text: "Empty trash", id: 1 },
    { text: "Lock doors", id: 2 },
    { text: "Laundry started", id: 3 },
    { text: "Wash dishes", id: 4 },
    { text: "Clean bathrooms", id: 5 },
  ]
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
            title="Check-in checklist"
            checklist={checkInChecklist}
          />

          <ChecklistAccordion
            title="Check-out checklist"
            checklist={checkOutChecklist}
          />
        </Stack>
      </Paper>
    </Show>
  );
};
