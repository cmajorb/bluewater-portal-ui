import { useShow } from "@refinedev/core";
import {
    Typography,
    Chip,
    CircularProgress,
    Stack,
    Divider,
    Tooltip
} from "@mui/material";
import { Tag, Task } from "../../types";
import { Show } from "@refinedev/mui";
import { TaskTitle } from "../../components/TaskTitle";

export default function TaskDetailPage() {
    const { query } = useShow({});
    const { data, isLoading } = query;

    const task = data?.data as Task;

    if (isLoading || !task) return <CircularProgress />;

    return (
        <Show isLoading={isLoading}>
            <TaskTitle task={task} />
            <Typography variant="body2">Start: {task.start_date}</Typography>
            <Typography variant="body2" mb={2}>Due: {task.due_date}</Typography>

            <Typography variant="body1" mb={2}>
                {task.description || "No description"}
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
        </Show>
    );
}
