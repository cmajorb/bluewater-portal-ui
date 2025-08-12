import { useGetIdentity, usePermissions, useShow } from "@refinedev/core";
import {
    Typography,
    Chip,
    CircularProgress,
    Stack,
    Tooltip,
} from "@mui/material";
import { Family } from "../../types";
import { Show } from "@refinedev/mui";
import { IUser } from "../../interfaces";

export default function FamilyDetailPage() {
    const { query } = useShow({});
    const { data, isLoading } = query;
    const { data: permissionsData } = usePermissions();
    const permissions = (permissionsData as string[]) ?? [];
    const isAdmin = permissions.includes("admin");
    const { data: identity } = useGetIdentity<IUser>();


    const family = data?.data as Family;

    const currentUserId = identity?.id; // adjust if your identity shape is different

    const isHeadOfFamily = family?.members?.some(
        (m) => m.is_head && m.profile.id === currentUserId
    );

    if (isLoading || !family) return <CircularProgress />;

    return (
        <Show isLoading={isLoading}
            canEdit={isAdmin || isHeadOfFamily}>
            <Typography variant="h5">{family.name}</Typography>

            <Typography variant="body1" m={2}>Family Members:</Typography>
            {family.members && family.members.length > 0 && (
                <Stack direction="row" mt={1} flexWrap="wrap">
                    {family.members.map((m) => (
                        <Tooltip title={m.is_head ? "Head of Family" : ""} key={m.profile.id}>
                            <span>
                                <Chip
                                    key={m.profile.id}
                                    label={`${m.profile.first_name} ${m.profile.last_name}`}
                                    variant={m.is_head ? "filled" : "outlined"}
                                    sx={{ marginRight: 1, marginBottom: 1}}
                                />
                            </span>
                        </Tooltip>
                    ))}
                </Stack>
            )}
        </Show>
    );
}
