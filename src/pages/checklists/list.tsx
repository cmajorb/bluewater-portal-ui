import {
    Stack,
    CircularProgress,
    useTheme,
} from "@mui/material";
import { useList, usePermissions } from "@refinedev/core";
import { Checklist } from "../../types";
import { List } from "@refinedev/mui";
import { ChecklistCard } from "../../components/cards/ChecklistCard";

export default function ChecklistsPage() {
    const { data: checklistsData, isLoading } = useList({ resource: "checklists" });
    const checklists = (checklistsData?.data || []) as Checklist[];
    const { data: permissionsData } = usePermissions();
    const permissions = (permissionsData as string[]) ?? [];
    const isAdmin = permissions.includes("admin");
    const theme = useTheme();
    if (isLoading) return <CircularProgress />;

    return (
        <List canCreate={isAdmin} title="Checklist List"
            contentProps={{
                style: {
                    backgroundColor: theme.palette.background.default,
                },
            }}>
            <Stack spacing={2}>
                {checklists.map((checklist) => (
                        <ChecklistCard
                            key={checklist.id}
                            checklist={checklist}
                        />
                    ))}
            </Stack>
        </List>
    );
}
