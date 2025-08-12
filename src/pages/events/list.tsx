import {
    Stack,
    CircularProgress,
    useTheme,
} from "@mui/material";
import { useList, usePermissions } from "@refinedev/core";
import { Event } from "../../types";
import { EventCard } from "../../components/cards/EventCard";
import { List } from "@refinedev/mui";

export default function EventsPage() {
    const { data: eventsData, isLoading } = useList({ resource: "events" });
    const events = (eventsData?.data || []) as Event[];
    const { data: permissionsData } = usePermissions();
    const permissions = (permissionsData as string[]) ?? [];
    const isAdmin = permissions.includes("admin");
    const theme = useTheme();
    if (isLoading) return <CircularProgress />;

    return (
        <List canCreate={isAdmin} title="Event List"
            contentProps={{
                style: {
                    backgroundColor: theme.palette.background.default,
                },
            }}>
            <Stack spacing={2}>
                {events.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                        />
                    ))}
            </Stack>
        </List>
    );
}
