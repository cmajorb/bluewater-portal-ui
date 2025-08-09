import {
    Stack,
    CircularProgress,
    useTheme,
} from "@mui/material";
import { useList, usePermissions } from "@refinedev/core";
import { Family } from "../../types";
import { List } from "@refinedev/mui";
import { FamilyCard } from "../../components/cards/FamilyCard";

export default function FamiliesPage() {

    const { data: permissionsData } = usePermissions();
    const permissions = (permissionsData as string[]) ?? [];
    const isAdmin = permissions.includes("admin");
    const { data: familiesData, isLoading } = useList({
        resource: isAdmin ? "families" : "families/me",
    });
    const families = (familiesData?.data || []) as Family[];

    if (isLoading) return <CircularProgress />;
    const theme = useTheme();

    return (
        <List canCreate={isAdmin} title="Family List"
            contentProps={{
                style: {
                    backgroundColor: theme.palette.background.default,
                },
            }}
        >
            <Stack spacing={2}>
                {families.map((family) => (
                    <FamilyCard
                        key={family.id}
                        family={family}
                    />
                ))}
            </Stack>
        </List>
    );
}
