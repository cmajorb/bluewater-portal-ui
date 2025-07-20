import { useState } from "react";
import {
    Box,
    Typography,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
    IconButton,
    Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useCreate, useDelete, useList, useCustomMutation } from "@refinedev/core";
import { IFamily, IProfile } from "../../interfaces";


export default function AdminPanel() {
    const [newFamilyName, setNewFamilyName] = useState("");
    const [headId, setHeadId] = useState<number | "">("");
    const { mutate: createFamily } = useCreate();
    const { mutate: deleteFamily } = useDelete();
    const { mutate: deleteProfile } = useDelete();
    const { mutate: toggleAdminMutate } = useCustomMutation();
    const { data: familiesData } = useList({ resource: "families" });
    const { data: profilesData } = useList({ resource: "profiles" });

const families = (familiesData?.data || []) as IFamily[];
const profiles = (profilesData?.data || []) as IProfile[];

    const submitCreateFamily = () => {
        createFamily(
            {
                resource: "families",
                values: {
                    name: newFamilyName,
                    head_ids: [headId],
                },
            }
        );
    };

    const submitDeleteFamily = async (id: number) => {
        if (id) {
            deleteFamily(
                { resource: "families", id: id },
            );
        }
    };

    const submitDeleteProfile = async (id: number) => {
        if (id) {
            deleteProfile(
                { resource: "profiles", id: id },
            );
        }
    };

    const submitToggleAdmin = (profileId: number) => {
        toggleAdminMutate({
            method: "patch",
            url: `/profiles/toggle-admin/${profileId}`,
            values: {},
        }, {
            onSuccess: () => window.location.reload()
        });
    };

    if (!profiles.length) return <CircularProgress />;

    return (
        <Box p={4}>
            <Typography variant="h4" mb={2}>Admin Panel</Typography>

            <Box mb={4}>
                <Typography variant="h6">Create New Family</Typography>
                <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                    <TextField
                        label="Family Name"
                        value={newFamilyName}
                        onChange={(e) => setNewFamilyName(e.target.value)}
                    />
                    <FormControl>
                        <InputLabel>Head of Household</InputLabel>
                        <Select
                            value={headId}
                            label="Head of Household"
                            onChange={(e) => setHeadId(Number(e.target.value))}
                            style={{ minWidth: 200 }}
                        >
                            {profiles.map((p) => (
                                <MenuItem key={p.id} value={p.id}>
                                    {p.first_name} {p.last_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button variant="contained" onClick={submitCreateFamily}>Create</Button>
                </Stack>
            </Box>

            <Box mb={4}>
                <Typography variant="h6">Families</Typography>
                {families.map((family) => (
                    <Box key={family.id} p={2} border="1px solid #ccc" mt={2}>
                        <Typography fontWeight="bold">{family.name}</Typography>
                        <Stack direction="row" gap={2} flexWrap="wrap" mt={1}>
                            {family.members.map(({ profile, is_head }) => (
                                <Box key={profile.id} display="flex" alignItems="center" gap={1}>
                                    <Typography>
                                        {profile.first_name} {profile.last_name} {is_head && "(Head)"}
                                    </Typography>
                                    <IconButton onClick={() => submitDeleteProfile(profile.id)} size="small">
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={() => submitToggleAdmin(profile.id)} size="small">
                                        <AdminPanelSettingsIcon
                                            fontSize="small"
                                            color={profile.is_admin ? "primary" : "disabled"}
                                        />
                                    </IconButton>
                                </Box>
                            ))}
                        </Stack>
                        <Button
                            onClick={() => submitDeleteFamily(family.id)}
                            color="error"
                            variant="outlined"
                            size="small"
                            sx={{ mt: 1 }}
                        >
                            Delete Family
                        </Button>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
