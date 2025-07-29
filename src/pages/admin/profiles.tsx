import { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    IconButton,
    Stack,
    Card,
    CardContent,
    CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useCreate, useDelete, useList, useUpdate, useCustomMutation } from "@refinedev/core";
import { Profile } from "../../types";

export default function ProfilesAdmin() {
    const { data: profilesData, refetch } = useList({ resource: "profiles" });
    const profiles = (profilesData?.data || []) as Profile[];

    const { mutate: createProfile } = useCreate();
    const { mutate: updateProfile } = useUpdate();
    const { mutate: deleteProfile } = useDelete();
    const { mutate: toggleAdminMutate } = useCustomMutation();

    const [newProfile, setNewProfile] = useState({
        email: "",
        first_name: "",
        last_name: "",
        is_adult: true,
        is_admin: false,
    });

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedProfile, setEditedProfile] = useState<Partial<Profile>>({});

    const handleCreate = () => {
        createProfile(
            {
                resource: "profiles/create-profile",
                values: newProfile,
            },
            {
                onSuccess: () => {
                    refetch();
                    setNewProfile({
                        email: "",
                        first_name: "",
                        last_name: "",
                        is_adult: true,
                        is_admin: false,
                    });
                },
            }
        );
    };

    const handleUpdate = (id: number) => {
        updateProfile(
            {
                resource: "profiles",
                id,
                values: editedProfile,
            },
            {
                onSuccess: () => {
                    refetch();
                    setEditingId(null);
                    setEditedProfile({});
                },
            }
        );
    };

    const handleDelete = (id: number) => {
        deleteProfile(
            {
                resource: "profiles",
                id,
            },
            {
                onSuccess: () => refetch(),
            }
        );
    };

    const handleToggleAdmin = (profileId: number) => {
        toggleAdminMutate(
            {
                method: "patch",
                url: `/profiles/toggle-admin/${profileId}`,
                values: {},
            },
            {
                onSuccess: () => refetch(),
            }
        );
    };

    if (!profiles.length) return <CircularProgress />;

    return (
        <Box p={4}>
            <Typography variant="h4" mb={4}>
                Profile Management
            </Typography>

            {/* Create Profile */}
            <Card className="max-w-md mx-auto mb-6">
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Create New Profile
                    </Typography>
                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            label="First Name"
                            value={newProfile.first_name}
                            onChange={(e) =>
                                setNewProfile({ ...newProfile, first_name: e.target.value })
                            }
                        />
                        <TextField
                            fullWidth
                            label="Last Name"
                            value={newProfile.last_name}
                            onChange={(e) =>
                                setNewProfile({ ...newProfile, last_name: e.target.value })
                            }
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            value={newProfile.email}
                            onChange={(e) =>
                                setNewProfile({ ...newProfile, email: e.target.value })
                            }
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={newProfile.is_adult}
                                    onChange={(e) =>
                                        setNewProfile({ ...newProfile, is_adult: e.target.checked })
                                    }
                                />
                            }
                            label="Is Adult"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={newProfile.is_admin}
                                    onChange={(e) =>
                                        setNewProfile({ ...newProfile, is_admin: e.target.checked })
                                    }
                                />
                            }
                            label="Is Admin"
                        />
                        <Button variant="contained" onClick={handleCreate}>
                            Add Profile
                        </Button>
                    </Stack>
                </CardContent>
            </Card>

            {/* Existing Profiles */}
            <Typography variant="h6" gutterBottom>
                Existing Profiles
            </Typography>

            <Stack spacing={3}>
                {profiles.map((profile) => (
                    <Card key={profile.id}>
                        <CardContent>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                spacing={2}
                                flexWrap="wrap"
                            >
                                {editingId === profile.id ? (
                                    <Stack spacing={1} sx={{ flexGrow: 1, minWidth: 250 }}>
                                        <TextField
                                            label="First Name"
                                            value={editedProfile.first_name || ""}
                                            onChange={(e) =>
                                                setEditedProfile((prev) => ({
                                                    ...prev,
                                                    first_name: e.target.value,
                                                }))
                                            }
                                            size="small"
                                        />
                                        <TextField
                                            label="Last Name"
                                            value={editedProfile.last_name || ""}
                                            onChange={(e) =>
                                                setEditedProfile((prev) => ({
                                                    ...prev,
                                                    last_name: e.target.value,
                                                }))
                                            }
                                            size="small"
                                        />
                                        <TextField
                                            label="Email"
                                            value={editedProfile.email || ""}
                                            onChange={(e) =>
                                                setEditedProfile((prev) => ({
                                                    ...prev,
                                                    email: e.target.value,
                                                }))
                                            }
                                            size="small"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={editedProfile.is_adult ?? profile.is_adult}
                                                    onChange={(e) =>
                                                        setEditedProfile((prev) => ({
                                                            ...prev,
                                                            is_adult: e.target.checked,
                                                        }))
                                                    }
                                                />
                                            }
                                            label="Is Adult"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={editedProfile.is_admin ?? profile.is_admin}
                                                    onChange={(e) =>
                                                        setEditedProfile((prev) => ({
                                                            ...prev,
                                                            is_admin: e.target.checked,
                                                        }))
                                                    }
                                                />
                                            }
                                            label="Is Admin"
                                        />
                                        <Button
                                            startIcon={<SaveIcon />}
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleUpdate(profile.id)}
                                        >
                                            Save
                                        </Button>
                                    </Stack>
                                ) : (
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography>
                                            <strong>{profile.first_name} {profile.last_name}</strong>
                                        </Typography>
                                        <Typography>{profile.email}</Typography>
                                        <Typography variant="body2">
                                            {profile.is_adult ? "Adult" : "Child"} •{" "}
                                            {profile.is_admin ? "Admin" : "User"}
                                        </Typography>
                                    </Box>
                                )}

                                <Stack direction="row" spacing={1}>
                                    {editingId !== profile.id && (
                                        <IconButton
                                            onClick={() => {
                                                setEditingId(profile.id);
                                                setEditedProfile({ ...profile });
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    )}
                                    <IconButton onClick={() => handleDelete(profile.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                    <IconButton onClick={() => handleToggleAdmin(profile.id)}>
                                        <AdminPanelSettingsIcon
                                            color={profile.is_admin ? "primary" : "disabled"}
                                        />
                                    </IconButton>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        </Box>
    );
}
