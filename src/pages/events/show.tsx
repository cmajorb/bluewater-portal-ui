import {
  Stack,
  Typography,
  Divider,
  Paper,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import { usePermissions, useShow } from "@refinedev/core";
import { Show } from "@refinedev/mui";
import { format } from "date-fns";
import { Event, Family } from "../../types";

export const EventShow = () => {
  const { query } = useShow<Event>();
  const { data, isLoading } = query;
  const event = data?.data as Event;

  const { data: permissionsData } = usePermissions();
      const permissions = (permissionsData as string[]) ?? [];
      const isAdmin = permissions.includes("admin");

  const formatDate = (date: string) =>
    format(new Date(date), "eeee, MMMM d, yyyy");

  return (
    <Show isLoading={isLoading} canEdit={isAdmin}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h4" fontWeight="bold">
            {event?.name}
          </Typography>

          <Typography color="text.secondary">
            {event?.start_date && event?.end_date
              ? `${formatDate(event.start_date)} → ${formatDate(event.end_date)}`
              : null}
          </Typography>

          {event?.description && (
            <>
              <Divider />
              <Typography variant="h6" fontWeight="bold">
                Description
              </Typography>
              <Typography>{event.description}</Typography>
            </>
          )}

          <Divider />

          <Typography variant="h6" fontWeight="bold">
            Invited Families
          </Typography>

          <Stack direction="row" flexWrap="wrap">
            {event?.invited_families?.map((family: Family) => (
              <Card
                key={family.id}
                variant="outlined"
                sx={{ borderRadius: 2, width: 300, margin: 1 }}
              >
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                    {family.name}
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                    {family.members.map(({ profile, is_head }: any, i: number) => (
                      <li key={i}>
                        {profile.first_name} {profile.last_name}
                        {is_head ? " (Head)" : ""}
                      </li>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Stack>
      </Paper>
    </Show>
  );
};
