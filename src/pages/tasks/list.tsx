import {
    Stack,
    CircularProgress,
} from "@mui/material";
import { useList, usePermissions } from "@refinedev/core";
import { Task } from "../../types";
import { TaskCard } from "../../components/TaskCard";
import { List } from "@refinedev/mui";

export default function TasksPage() {
    const { data: tasksData, isLoading } = useList({ resource: "tasks" });
    const tasks = (tasksData?.data || []) as Task[];
    const { data: permissionsData } = usePermissions();
    const permissions = (permissionsData as string[]) ?? [];
    const isAdmin = permissions.includes("admin");

    if (isLoading) return <CircularProgress />;

    return (
        <List canCreate={isAdmin} title="Task List">
            <Stack spacing={2}>
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                    />
                ))}
            </Stack>
        </List>
    );
}
