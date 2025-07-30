import { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Stack,
    Card,
    CardContent,
    CircularProgress,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCreate, useDelete, useList, useUpdate } from "@refinedev/core";
import { Event, Family } from "../../types";

export default function EventsAdmin() {
    const { data: eventsData, refetch } = useList({ resource: "events" });
    const { data: familiesData } = useList({ resource: "families" });
    const events = (eventsData?.data || []) as Event[];
    const families = (familiesData?.data || []) as Family[];

    const { mutate: createEvent } = useCreate();
    const { mutate: updateEvent } = useUpdate();
    const { mutate: deleteEvent } = useDelete();

    const [newEvent, setNewEvent] = useState({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        invited_family_ids: [] as number[],
    });

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedEvent, setEditedEvent] = useState<Partial<Event> & { invited_family_ids?: number[] }>({});

    const handleCreate = () => {
        createEvent(
            {
                resource: "events",
                values: {
                    ...newEvent,
                    invited_family_ids: newEvent.invited_family_ids,
                },
            },
            {
                onSuccess: () => {
                    refetch();
                    setNewEvent({ name: "", description: "", start_date: "", end_date: "", invited_family_ids: [] });
                },
            }
        );
    };

    const handleUpdate = (id: number) => {
        updateEvent(
            {
                resource: "events",
                id,
                values: {
                    ...editedEvent,
                    invited_family_ids: editedEvent.invited_family_ids,
                },
            },
            {
                onSuccess: () => {
                    refetch();
                    setEditingId(null);
                    setEditedEvent({});
                },
            }
        );
    };

    const handleDelete = (id: number) => {
        deleteEvent({ resource: "events", id }, { onSuccess: () => refetch() });
    };

    if (!events.length || !families.length) return <CircularProgress />;

    return (
        <Box p={4}>
            <Typography variant="h4" mb={4}>
                Event Management
            </Typography>

            {/* Create Event */}
            <Card className="max-w-md mx-auto mb-6">
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Create New Event
                    </Typography>
                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            label="Title"
                            value={newEvent.name}
                            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={newEvent.description}
                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Start Date"
                            type="date"
                            slotProps={{ inputLabel: { shrink: true } }}
                            value={newEvent.start_date}
                            onChange={(e) => setNewEvent({ ...newEvent, start_date: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="End Date"
                            type="date"
                            slotProps={{ inputLabel: { shrink: true } }}
                            value={newEvent.end_date}
                            onChange={(e) => setNewEvent({ ...newEvent, end_date: e.target.value })}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Invited Families</InputLabel>
                            <Select
                                multiple
                                value={newEvent.invited_family_ids}
                                onChange={(e) =>
                                    setNewEvent({ ...newEvent, invited_family_ids: e.target.value as number[] })
                                }
                                renderValue={(selected) => (
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                        {(selected as number[]).map((id) => {
                                            const family = families.find((f) => f.id === id);
                                            return <Chip key={id} label={family?.name || id} />;
                                        })}
                                    </Box>
                                )}
                            >
                                {families.map((family) => (
                                    <MenuItem key={family.id} value={family.id}>
                                        {family.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button variant="contained" onClick={handleCreate}>
                            Add Event
                        </Button>
                    </Stack>
                </CardContent>
            </Card>

            {/* Existing Events */}
            <Typography variant="h6" gutterBottom>
                Existing Events
            </Typography>

            <Stack spacing={3}>
                {events.map((event) => (
                    <Card key={event.id}>
                        <CardContent>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="flex-start"
                                spacing={2}
                                flexWrap="wrap"
                            >
                                {editingId === event.id ? (
                                    <Stack spacing={1} sx={{ flexGrow: 1, minWidth: 250 }}>
                                        <TextField
                                            label="Title"
                                            value={editedEvent.name || ""}
                                            onChange={(e) =>
                                                setEditedEvent((prev) => ({
                                                    ...prev,
                                                    name: e.target.value,
                                                }))
                                            }
                                            size="small"
                                        />
                                        <TextField
                                            label="Description"
                                            value={editedEvent.description || ""}
                                            onChange={(e) =>
                                                setEditedEvent((prev) => ({
                                                    ...prev,
                                                    description: e.target.value,
                                                }))
                                            }
                                            size="small"
                                        />
                                        <TextField
                                            label="Start Date"
                                            type="date"
                                            slotProps={{ inputLabel: { shrink: true } }}
                                            value={editedEvent.start_date || ""}
                                            onChange={(e) =>
                                                setEditedEvent((prev) => ({
                                                    ...prev,
                                                    start_date: e.target.value,
                                                }))
                                            }
                                            size="small"
                                        />
                                        <TextField
                                            label="End Date"
                                            type="date"
                                            slotProps={{ inputLabel: { shrink: true } }}
                                            value={editedEvent.end_date || ""}
                                            onChange={(e) =>
                                                setEditedEvent((prev) => ({
                                                    ...prev,
                                                    end_date: e.target.value,
                                                }))
                                            }
                                            size="small"
                                        />
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Invited Families</InputLabel>
                                            <Select
                                                multiple
                                                value={editedEvent.invited_family_ids || []}
                                                onChange={(e) =>
                                                    setEditedEvent((prev) => ({
                                                        ...prev,
                                                        invited_family_ids: e.target.value as number[],
                                                    }))
                                                }
                                                renderValue={(selected) => (
                                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                        {(selected as number[]).map((id) => {
                                                            const family = families.find((f) => f.id === id);
                                                            return <Chip key={id} label={family?.name || id} />;
                                                        })}
                                                    </Box>
                                                )}
                                            >
                                                {families.map((family) => (
                                                    <MenuItem key={family.id} value={family.id}>
                                                        {family.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Button
                                            startIcon={<SaveIcon />}
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleUpdate(event.id)}
                                        >
                                            Save
                                        </Button>
                                    </Stack>
                                ) : (
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6">{event.name}</Typography>
                                        <Typography>{event.description}</Typography>
                                        <Typography variant="body2">
                                            {event.start_date} - {event.end_date}
                                        </Typography>
                                        <Typography variant="body2" mt={1}>
                                            <strong>Invited Families:</strong>{" "}
                                            {event.invited_families?.length
                                                ? event.invited_families.map((fam) => fam.name).join(", ")
                                                : "None"}
                                        </Typography>
                                    </Box>
                                )}

                                <Stack direction="row" spacing={1}>
                                    {editingId !== event.id && (
                                        <IconButton
                                            onClick={() => {
                                                setEditingId(event.id);
                                                setEditedEvent({
                                                    ...event,
                                                    invited_family_ids: event.invited_families.map((f) => f.id),
                                                });
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    )}
                                    <IconButton onClick={() => handleDelete(event.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        </Box>
    );
}
