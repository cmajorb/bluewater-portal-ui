import { usePermissions, useShow } from "@refinedev/core";
import {
    Typography,
    Chip,
    CircularProgress,
    Stack,
    Divider,
    Tooltip,
    Alert
} from "@mui/material";
import { Tag, Task } from "../../types";
import { Show } from "@refinedev/mui";
import { TaskTitle } from "../../components/TaskTitle";

export default function TaskDetailPage() {
    const { query } = useShow({});
    const { data, isLoading } = query;
    const { data: permissionsData } = usePermissions();
    const permissions = (permissionsData as string[]) ?? [];
    const isAdmin = permissions.includes("admin");

    const task = data?.data as Task;

    if (isLoading || !task) return <CircularProgress />;

    return (
        <Show isLoading={isLoading}
            canEdit={isAdmin}>
            <TaskTitle task={task} />
            {(() => {
                const now = new Date();
                const due = new Date(task.due_date);
                const diffInMs = due.getTime() - now.getTime();
                const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

                if (diffInDays < 0) {
                    return (
                        <Alert severity="error" sx={{ my: 2 }}>
                            This task is <strong>overdue</strong> (due {task.due_date}).
                        </Alert>
                    );
                } else if (diffInDays <= 7) {
                    return (
                        <Alert severity="warning" sx={{ my: 2 }}>
                            Due soon: <strong>{task.due_date}</strong>
                        </Alert>
                    );
                } else {
                    return (
                        <Alert severity="info" sx={{ my: 2 }}>
                            Due: <strong>{task.due_date}</strong>
                        </Alert>
                    );
                }
            })()}
            <Typography variant="body1" mb={2}>Start: {task.start_date}</Typography>

            <Typography variant="body1" mb={2}>
                Description: {task.description || "No description"}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" mb={2}>Tags:</Typography>
            <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
                {task.tags.map((tag: Tag) => (
                    <Tooltip title={tag.description} key={tag.id}>
                        <span>
                            <Chip key={tag.id} label={tag.name} color="default" />
                        </span>
                    </Tooltip>
                ))}
            </Stack>

            <Typography variant="body1" mb={2}>Profiles:</Typography>
            {task.profiles && task.profiles.length > 0 && (
                <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                    {task.profiles.map((profile) => (
                        <Chip
                            key={profile.id}
                            label={`${profile.first_name} ${profile.last_name}`}
                            variant="outlined"
                        />
                    ))}
                </Stack>
            )}
        </Show>
    );
}
