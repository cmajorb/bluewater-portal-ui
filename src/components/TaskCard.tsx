// components/TaskCard.tsx
import {
    Box,
    Typography,
    Stack,
    Card,
    CardContent
} from "@mui/material";
import { Task } from "../types";
import { TaskTitle } from "./TaskTitle";
import { useNavigation } from "@refinedev/core";

type Props = {
    task: Task;
};

export const TaskCard = ({ task }: Props) => {
    const { show } = useNavigation();

    return (
        <Card key={task.id} onClick={() => show("tasks", task.id)} sx={{ cursor: "pointer" }}>
            <CardContent>

                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>

                    <Box flexGrow={1}>
                        <TaskTitle task={task} />
                        <Typography variant="body2">{task.description}</Typography>
                        <Typography variant="body2">
                            {task.start_date} - {task.due_date}
                        </Typography>
                        <Typography variant="body2">
                            Status:{" "}
                            {task.status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Typography>
                        <Typography variant="body2">Public: {task.is_public ? "Yes" : "No"}</Typography>
                    </Box>

                </Stack>
            </CardContent>
        </Card>
    );
};
