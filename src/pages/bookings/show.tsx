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
import { useList, useShow } from "@refinedev/core";
import { Show } from "@refinedev/mui";
import { format } from "date-fns";
import { ChecklistAccordion } from "../../components/Checklist";
import { Room } from "../../types";

const checkInChecklist = [
  { label: "Bring your own bedding and towels (if possible)", key: "0" },
  { label: "Turn on water", key: "1", images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHRZAL7HZI9E8S-ZZcBl0BWMpGrPxSgtq8hw&s", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqyj91NgnKpkE120U0vinqJhTFNOeEKqNwbQ&s"] },
  { label: "Turn on breakers", key: "2" },

];

const checkOutChecklist = [
  { label: "Laundry started", key: "3" },
  { label: "Wash dishes", key: "4" },
  { label: "Clean bathrooms", key: "5" },
  { label: "Vacuum and mop", key: "6" },
  { label: "Empty trash", key: "7" },
  { label: "Lock doors", key: "8" },

];

export const BookingShow = () => {
  const { query } = useShow({});
  const { data, isLoading } = query;
  const record = data?.data;

  const { data: profilesData } = useList({ resource: "profiles" });
  const { data: roomsData } = useList({ resource: "rooms" });
  const allProfiles = profilesData?.data || [];
  const allRooms = roomsData?.data || [];

  const formatDateTime = (date: string, time?: string) =>
    format(new Date(date + "T" + (time || "12:00")), "eeee, MMMM d, yyyy @ h:mm a");

  const guestsByRoom: Record<string, any[]> = {};
  record?.guests.forEach((guest: any) => {
    if (!guest.room_id) return;
    if (!guestsByRoom[guest.room_id]) {
      guestsByRoom[guest.room_id] = [];
    }
    guestsByRoom[guest.room_id].push(guest);
  });

  return (
    <Show isLoading={isLoading}>
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
              {record?.arrival_time && (
                <Typography>
                  {formatDateTime(record?.start_date, record?.arrival_time)}
                </Typography>)
              }
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Check-Out
              </Typography>
              {record?.arrival_time && (
                <Typography>
                  {formatDateTime(record?.end_date, record?.departure_time)}
                </Typography>)
              }
              <Typography>
              </Typography>
            </Grid>
          </Grid>

          {record?.note && (
            <>
              <Divider />
              <Typography variant="h6" fontWeight="bold">
                Special Notes
              </Typography>
              <Typography>{record.note}</Typography>
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
