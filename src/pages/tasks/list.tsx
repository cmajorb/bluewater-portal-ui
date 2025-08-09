import {
    Stack,
    CircularProgress,
    useTheme,
} from "@mui/material";
import { useList, usePermissions } from "@refinedev/core";
import { Task } from "../../types";
import { TaskCard } from "../../components/cards/TaskCard";
import { List } from "@refinedev/mui";

export default function TasksPage() {
    const { data: tasksData, isLoading } = useList({ resource: "tasks" });
    const tasks = (tasksData?.data || []) as Task[];
    const { data: permissionsData } = usePermissions();
    const permissions = (permissionsData as string[]) ?? [];
    const isAdmin = permissions.includes("admin");
    const theme = useTheme();
    if (isLoading) return <CircularProgress />;

    return (
        <List canCreate={isAdmin} title="Task List"
            contentProps={{
                style: {
                    backgroundColor: theme.palette.background.default,
                },
            }}>
            <Stack spacing={2}>
                {tasks.slice()
                    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()).map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                        />
                    ))}
            </Stack>
        </List>
    );
}
