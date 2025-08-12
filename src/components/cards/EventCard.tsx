import {
    Box,
    Typography,
    Stack,
    Card,
    CardContent,
    Chip
} from "@mui/material";
import { Event } from "../../types";
import { useNavigation } from "@refinedev/core";
import { format } from "date-fns";

type Props = {
    event: Event;
};

export const EventCard = ({ event: event }: Props) => {
    const { show } = useNavigation();
    const formatDate = (date: string) =>
        format(new Date(date), "MM/dd/yyyy");
    return (
        <Card
            key={event.id}
            onClick={() => show("events", event.id)}
            sx={{
                cursor: "pointer",
            }}
        >
            <CardContent>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                    flexWrap="wrap"
                >
                    <Box flexGrow={1}>
                        <Typography variant="h5">{event.name}</Typography>
                        <Typography variant="body2">{formatDate(event.start_date)} - {formatDate(event.end_date)}</Typography>

                        <Typography variant="body2">{event.description}</Typography>
                        {event.invited_families && event.invited_families.length > 0 && (
                            <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                                {event.invited_families.map((m) => (
                                    <Chip
                                        key={m.id}
                                        label={m.name}
                                        size="small"
                                    />
                                ))}
                            </Stack>
                        )}
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};
