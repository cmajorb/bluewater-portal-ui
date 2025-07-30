import { useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Button,
    MenuItem,
    Select,
    Stack,
    IconButton,
    Box,
    TextField,
} from "@mui/material";
import { useList, useCreate, useDelete, useUpdate } from "@refinedev/core";
import { Room } from "../../types";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from '@mui/icons-material/Close';

const floors = ["1st", "2nd"];
const bedSizes = ["King", "Queen", "Double", "Twin", "Bunk", "Other", "Double Double"];

export default function RoomsAdmin() {
    const { data, refetch } = useList({ resource: "rooms" });
    const rooms: Room[] = (data?.data as Room[]) || [];

    const [editStates, setEditStates] = useState<{ [id: number]: boolean }>({});
    const [roomEdits, setRoomEdits] = useState<{ [id: number]: Partial<Room> }>({});

    const [newRoom, setNewRoom] = useState({
        name: "",
        floor: "1st",
        bed_size: "Queen",
        min_people: "",
        max_people: "",
        notes: "",
    });

    const { mutate: createRoom } = useCreate();
    const { mutate: deleteRoom } = useDelete();
    const { mutate: updateRoom } = useUpdate();

    const handleCreate = () => {
        if (!newRoom.name) return;

        createRoom(
            {
                resource: "rooms",
                values: {
                    ...newRoom,
                    min_people: Number(newRoom.min_people),
                    max_people: Number(newRoom.max_people),
                },
            },
            {
                onSuccess: () => {
                    setNewRoom({
                        name: "",
                        floor: "1st",
                        bed_size: "Queen",
                        min_people: "",
                        max_people: "",
                        notes: "",
                    });
                    refetch();
                },
            }
        );
    };

    const handleEditToggle = (id: number, room: Room) => {
        setEditStates((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
        setRoomEdits((prev) => ({
            ...prev,
            [id]: prev[id] ?? { ...room },
        }));
    };

    const handleEditChange = (
        id: number,
        field: keyof Room,
        value: string | number
    ) => {
        setRoomEdits((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value,
            },
        }));
    };

    const handleSave = (id: number) => {
        const values = roomEdits[id];
        updateRoom(
            {
                resource: "rooms",
                id,
                values,
            },
            {
                onSuccess: () => {
                    setEditStates((prev) => ({ ...prev, [id]: false }));
                    setRoomEdits((prev) => {
                        const updated = { ...prev };
                        delete updated[id];
                        return updated;
                    });
                    refetch();
                },
            }
        );
    };

    const handleDelete = (id: number) => {
        deleteRoom(
            { resource: "rooms", id },
            {
                onSuccess: () => refetch(),
            }
        );
    };

    return (
        <Box p={4}>
            <Typography variant="h4">Manage Rooms</Typography>

            <Card className="max-w-md mx-auto mb-6">
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Create New Room
                    </Typography>
                    <Stack spacing={2}>
                        <TextField
                            label="Room Name"
                            slotProps={{ inputLabel: { shrink: true } }}
                            value={newRoom.name}
                            onChange={(e) =>
                                setNewRoom({ ...newRoom, name: e.target.value })
                            }
                            size="small"
                        />
                        <Select
                            fullWidth
                            value={newRoom.floor}
                            onChange={(e) =>
                                setNewRoom({ ...newRoom, floor: e.target.value })
                            }
                        >
                            {floors.map((f) => (
                                <MenuItem key={f} value={f}>
                                    {f}
                                </MenuItem>
                            ))}
                        </Select>
                        <Select
                            fullWidth
                            value={newRoom.bed_size}
                            onChange={(e) =>
                                setNewRoom({ ...newRoom, bed_size: e.target.value })
                            }
                        >
                            {bedSizes.map((size) => (
                                <MenuItem key={size} value={size}>
                                    {size.charAt(0).toUpperCase() + size.slice(1)}
                                </MenuItem>
                            ))}
                        </Select>
                        <TextField
                            label="Min People"
                            slotProps={{ inputLabel: { shrink: true } }}
                            value={newRoom.min_people}
                            type="number"
                            onChange={(e) =>
                                setNewRoom({ ...newRoom, min_people: e.target.value })
                            }
                            size="small"
                        />
                        <TextField
                            label="Max People"
                            slotProps={{ inputLabel: { shrink: true } }}
                            value={newRoom.max_people}
                            type="number"
                            onChange={(e) =>
                                setNewRoom({ ...newRoom, max_people: e.target.value })
                            }
                            size="small"
                        />
                        <TextField
                            label="Notes"
                            slotProps={{ inputLabel: { shrink: true } }}
                            value={newRoom.notes}
                            onChange={(e) =>
                                setNewRoom({ ...newRoom, notes: e.target.value })
                            }
                            size="small"
                        />
                        <Button variant="contained" onClick={handleCreate}>
                            Add Room
                        </Button>
                    </Stack>
                </CardContent>
            </Card>


            <Typography variant="h6" gutterBottom>
                Existing Rooms
            </Typography>

            <Stack spacing={3}>
                {rooms.map((room) => {
                    const isEditing = editStates[room.id] || false;
                    const values = isEditing ? roomEdits[room.id] || room : room;

                    return (
                        <Card key={room.id}>
                            <CardContent className="flex flex-col gap-4">
                                {isEditing ? (<Stack spacing={2}>
                                    <TextField
                                        label="Room Name"
                                        slotProps={{ inputLabel: { shrink: true } }}
                                        value={values.name}
                                        onChange={(e) =>
                                            handleEditChange(room.id, "name", e.target.value)
                                        }
                                        size="small"
                                    />
                                    <Select
                                        value={values.floor}
                                        onChange={(e) =>
                                            handleEditChange(room.id, "floor", e.target.value)
                                        }
                                        fullWidth
                                        disabled={!isEditing}
                                    >
                                        {floors.map((f) => (
                                            <MenuItem key={f} value={f}>
                                                {f}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <Select
                                        value={values.bed_size}
                                        onChange={(e) =>
                                            handleEditChange(room.id, "bed_size", e.target.value)
                                        }
                                        fullWidth
                                        disabled={!isEditing}
                                    >
                                        {bedSizes.map((b) => (
                                            <MenuItem key={b} value={b}>
                                                {b}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <TextField
                                        label="Min People"
                                        slotProps={{ inputLabel: { shrink: true } }}
                                        value={values.min_people}
                                        type="number"
                                        onChange={(e) =>
                                            handleEditChange(
                                                room.id,
                                                "min_people",
                                                Number(e.target.value)
                                            )
                                        }
                                        size="small"
                                    />
                                    <TextField
                                        label="Max People"
                                        slotProps={{ inputLabel: { shrink: true } }}
                                        value={values.max_people}
                                        type="number"
                                        onChange={(e) =>
                                            handleEditChange(
                                                room.id,
                                                "max_people",
                                                Number(e.target.value)
                                            )
                                        }
                                        size="small"
                                    />
                                    <TextField
                                        label="Notes"
                                        slotProps={{ inputLabel: { shrink: true } }}
                                        value={values.notes}
                                        onChange={(e) =>
                                            handleEditChange(room.id, "notes", e.target.value)
                                        }
                                        size="small"
                                    />
                                </Stack>) : (<>
                                    <Typography variant="h6">{room.name}</Typography>
                                    <Stack spacing={1}>

                                        <Typography variant="body1">
                                            <strong>Floor:</strong> {values.floor}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Bed Size:</strong> {values.bed_size}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>People per room:</strong> {values.min_people} - {values.max_people}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Notes:</strong> {values.notes}
                                        </Typography>
                                    </Stack>
                                </>
                                )}


                                <div className="flex gap-2">

                                    <IconButton onClick={() => handleEditToggle(room.id, room)}>
                                        {isEditing ? <CloseIcon color="primary" /> : <EditIcon color="primary" />}
                                    </IconButton>

                                    {isEditing && (
                                        <IconButton onClick={() => handleSave(room.id)}>
                                            <SaveIcon color="primary" />
                                        </IconButton>
                                    )}
                                    <IconButton onClick={() => handleDelete(room.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}</Stack>
        </Box>
    );
}
