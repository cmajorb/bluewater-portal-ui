import {
    Typography,
    Chip,
    Stack,
    Tooltip,
    ChipProps,
} from "@mui/material";
import { Task } from "../types";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import WarningIcon from '@mui/icons-material/Warning';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';

const getStatusIcon = (status: Task['status']): {
    icon: JSX.Element;
    color: ChipProps['color'];
    name: string;
} => {
    switch (status) {
        case 'not_started':
            return { icon: <AccessTimeIcon />, color: 'default', name: 'Not Started' };
        case 'assigned':
            return { icon: <AssignmentIndIcon />, color: 'info', name: 'Assigned' };
        case 'in_progress':
            return { icon: <AutorenewIcon />, color: 'primary', name: 'In Progress' };
        case 'finished':
            return { icon: <CheckCircleIcon />, color: 'success', name: 'Finished' };
        case 'paused':
            return { icon: <PauseCircleIcon />, color: 'warning', name: 'Paused' };
        case 'overdue':
            return { icon: <WarningIcon />, color: 'error', name: 'Overdue' };
        default:
            return { icon: <WarningIcon />, color: 'error', name: 'Unknown Status' };
    }
};

export const TaskTitle = ({task}: {task: Task;}) => {

    const { icon, color, name } = task ? getStatusIcon(task.status) : {
        icon: <WarningIcon />,
        color: 'error',
        name: 'Unknown'
    } as {
        icon: JSX.Element;
        color: ChipProps['color'];
        name: string;
    };

    return (
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <Tooltip title={task.is_public ? "Public Task" : "Private Task"}>
                <span>
                    {task.is_public ? (
                        <PublicIcon color="primary" />
                    ) : (
                        <LockIcon color="disabled" />
                    )}
                </span>
            </Tooltip>
            <Typography variant="h5">{task.title}</Typography>

            <Chip
                label={name}
                icon={icon}
                color={color}
                size="small"
            />
        </Stack>
    );
};
