import {
    Box,
    Typography,
    Stack,
    Card,
    CardContent,
    Chip
} from "@mui/material";
import { Task } from "../../types";
import { TaskTitle } from "../TaskTitle";
import { useNavigation } from "@refinedev/core";
import { isBefore, isWithinInterval, parseISO, addDays } from "date-fns";

type Props = {
    task: Task;
};

export const TaskCard = ({ task }: Props) => {
    const { show } = useNavigation();

    return (
        <Card
            key={task.id}
            onClick={() => show("tasks", task.id)}
            sx={{
                cursor: "pointer",
                borderLeft: 4,
                borderColor: (() => {
                    const dueDate = parseISO(task.due_date);
                    const today = new Date();

                    if (isBefore(dueDate, today)) return "error.main"; // Red
                    if (isWithinInterval(dueDate, { start: today, end: addDays(today, 7) })) return "warning.main"; // Yellow

                    return "grey.300";
                })(),
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
                        <TaskTitle task={task} />
                        <Typography variant="body2">{task.description}</Typography>

                        <Typography
                            variant="body2"
                            fontWeight="bold"
                            color={(() => {
                                const dueDate = parseISO(task.due_date);
                                const today = new Date();

                                if (isBefore(dueDate, today)) return "error.main";
                                if (isWithinInterval(dueDate, { start: today, end: addDays(today, 3) })) return "warning.main";

                                return "text.primary";
                            })()}
                        >
                            Due: {task.due_date}
                        </Typography>

                        {/* Tags */}
                        {task.tags && task.tags.length > 0 && (
                            <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                                {task.tags.map((tag) => (
                                    <Chip key={tag.id} label={tag.name} size="small" />
                                ))}
                            </Stack>
                        )}

                        {/* Profiles */}
                        {task.profiles && task.profiles.length > 0 && (
                            <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                                {task.profiles.map((profile) => (
                                    <Chip
                                        key={profile.id}
                                        label={`${profile.first_name} ${profile.last_name}`}
                                        variant="outlined"
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
