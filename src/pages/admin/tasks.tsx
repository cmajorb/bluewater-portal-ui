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
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import { useCreate, useDelete, useList, useUpdate } from "@refinedev/core";
import { Task, Tag, Profile } from "../../types";

import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { TaskCard } from "../../components/cards/TaskCard";


const initialTask = {
    title: "",
    description: "",
    is_public: true,
    due_date: "",
    start_date: "",
    status: "not_started" as Task["status"],
    profile_ids: [] as number[],
    tag_ids: [] as number[],
    picture_ids: [] as number[],
};

export default function TasksAdmin() {
    const { data: tasksData, refetch } = useList({ resource: "tasks" });
    const { data: tagsData } = useList({ resource: "tags" });
    const { data: profilesData } = useList({ resource: "profiles" });

    const tasks = (tasksData?.data || []) as Task[];
    const tags = (tagsData?.data || []) as Tag[];
    const profiles = (profilesData?.data || []) as Profile[];

    const { mutate: createTask } = useCreate();
    const { mutate: updateTask } = useUpdate();
    const { mutate: deleteTask } = useDelete();

    const [newTask, setNewTask] = useState(initialTask);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedTask, setEditedTask] = useState<Partial<Task> & {
        profile_ids?: number[];
        tag_ids?: number[];
    }>({});

    const { mutate: createTag } = useCreate();
    const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
    const [newTagData, setNewTagData] = useState({ name: "", description: "" });


    const handleCreate = () => {
        createTask(
            { resource: "tasks", values: newTask },
            {
                onSuccess: () => {
                    refetch();
                    setNewTask(initialTask);
                },
            }
        );
    };

    const handleUpdate = (id: number) => {
        updateTask(
            { resource: "tasks", id, values: editedTask },
            {
                onSuccess: () => {
                    refetch();
                    setEditingId(null);
                    setEditedTask({});
                },
            }
        );
    };

    const handleDelete = (id: number) => {
        deleteTask({ resource: "tasks", id }, { onSuccess: () => refetch() });
    };

    if (!tags.length || !profiles.length) return <CircularProgress />;

    return (
        <Box p={4}>
            <Typography variant="h4" mb={4}>
                Task Management
            </Typography>

            {/* Create Task */}
            <Card className="max-w-md mx-auto mb-6">
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Create New Task
                    </Typography>
                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            label="Title"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            type="date"
                            label="Start Date"
                            slotProps={{ inputLabel: { shrink: true } }}
                            value={newTask.start_date}
                            onChange={(e) => setNewTask({ ...newTask, start_date: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            type="date"
                            label="Due Date"
                            slotProps={{ inputLabel: { shrink: true } }}
                            value={newTask.due_date}
                            onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={newTask.status}
                                onChange={(e) =>
                                    setNewTask({ ...newTask, status: e.target.value as Task["status"] })
                                }
                            >
                                {[
                                    "not_started",
                                    "assigned",
                                    "in_progress",
                                    "finished",
                                    "paused",
                                    "overdue",
                                ].map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Stack direction="row" spacing={1}>
                            <FormControl fullWidth>
                                <InputLabel>Tags</InputLabel>
                                <Select
                                    multiple
                                    value={newTask.tag_ids}
                                    onChange={(e) =>
                                        setNewTask({ ...newTask, tag_ids: e.target.value as number[] })
                                    }
                                    renderValue={(selected) => (
                                        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                                            {(selected as number[]).map((id) => {
                                                const tag = tags.find((t) => t.id === id);
                                                return <Chip key={id} label={tag?.name || id} />;
                                            })}
                                        </Box>
                                    )}
                                >
                                    {tags.map((tag) => (
                                        <MenuItem key={tag.id} value={tag.id}>
                                            {tag.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <IconButton onClick={() => setIsTagDialogOpen(true)} sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                                padding: '12px',
                            }} color="primary">
                                <AddIcon />
                            </IconButton>
                        </Stack>

                        <FormControl fullWidth>
                            <InputLabel>Profiles</InputLabel>
                            <Select
                                multiple
                                value={newTask.profile_ids}
                                onChange={(e) =>
                                    setNewTask({ ...newTask, profile_ids: e.target.value as number[] })
                                }
                                renderValue={(selected) => (
                                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                                        {(selected as number[]).map((id) => {
                                            const profile = profiles.find((p) => p.id === id);
                                            return <Chip key={id} label={profile?.first_name || id} />;
                                        })}
                                    </Box>
                                )}
                            >
                                {profiles.map((p) => (
                                    <MenuItem key={p.id} value={p.id}>
                                        {p.first_name} {p.last_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={newTask.is_public}
                                    onChange={(e) =>
                                        setNewTask({ ...newTask, is_public: e.target.checked })
                                    }
                                />
                            }
                            label="Public"
                        />
                        <Button variant="contained" onClick={handleCreate}>
                            Add Task
                        </Button>
                    </Stack>
                </CardContent>
            </Card>

            {/* Existing Tasks */}
            <Typography variant="h6" gutterBottom>
                Existing Tasks
            </Typography>

            <Stack spacing={3}>
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                    />
                ))}
            </Stack>
            <Dialog open={isTagDialogOpen} onClose={() => setIsTagDialogOpen(false)} fullWidth>
                <DialogTitle>Create New Tag</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            label="Name"
                            fullWidth
                            value={newTagData.name}
                            onChange={(e) => setNewTagData({ ...newTagData, name: e.target.value })}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            minRows={2}
                            value={newTagData.description}
                            onChange={(e) => setNewTagData({ ...newTagData, description: e.target.value })}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsTagDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={() => {
                            createTag(
                                {
                                    resource: "tags",
                                    values: newTagData,
                                },
                                {
                                    onSuccess: () => {
                                        setNewTagData({ name: "", description: "" });
                                        setIsTagDialogOpen(false);
                                        refetch(); // refresh tag list
                                    },
                                }
                            );
                        }}
                        variant="contained"
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
