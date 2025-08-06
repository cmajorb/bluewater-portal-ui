import {
    Box,
    Typography,
    Card,
    CardContent,
    Stack,
    Button,
    CircularProgress,
    Tooltip,
} from "@mui/material";
import { useList, useNavigation } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import { Task } from "../../types"; // define this in your types if needed
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import { TaskTitle } from "../../components/TaskTitle";
import { TaskCard } from "../../components/TaskCard";

export default function TasksPage() {
    const { data: tasksData, isLoading } = useList({ resource: "tasks" });
    const tasks = (tasksData?.data || []) as Task[];

    const navigate = useNavigate();
    const { show } = useNavigation();

    if (isLoading) return <CircularProgress />;

    return (
        <Box p={4}>
            <Typography variant="h4" mb={4}>
                Task List
            </Typography>

            <Stack spacing={2}>
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                    />
                ))}
            </Stack>
        </Box>
    );
}
