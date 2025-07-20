import {
    useList,
    useOne,
    useUpdate,
    useCreate,
} from "@refinedev/core";
import {
    Box,
    Button,
    CircularProgress,
    Typography,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    TextField,
    FormControlLabel,
    Checkbox,
    Card,
    CardContent,
} from "@mui/material";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const FamilyManager = () => {
    const {
        data: profileData,
        isLoading: isProfileLoading,
    } = useOne({
        resource: "profiles",
        id: "me",
    });
    const {
        data: familyData,
        isLoading: isFamilyLoading,
    } = useList({
        resource: "families/me",
        queryOptions: { queryKey: ["families", "me"] },
    });
    const {
        data: allProfilesData,
        isLoading: isAllProfilesLoading,
    } = useList({
        resource: "profiles",
        queryOptions: { queryKey: ["profiles"] },
    });
    const queryClient = useQueryClient();

    const { mutate: updateFamily } = useUpdate({
        mutationOptions: {
            onSuccess: () => queryClient.invalidateQueries({ queryKey: ["families", "me"] }),
        },
    });

    const { mutate: createProfile } = useCreate({
        resource: "profiles/create-profile",
        mutationOptions: {
            onSuccess: (newProfile) => {
                const createdId = Number(newProfile?.data?.id);
                if (createdId) {
                    setSelectedProfileId(createdId);
                    handleAddMember(createdId);
                }
                setNewMemberData({ first_name: "", last_name: "", email: "", password: "", is_adult: true });
            },
        },
    });

    const family = familyData?.data?.[0];
    const isHead = family?.members?.some(
        (m: any) => m.profile.id === profileData?.data?.id && m.is_head
    );

    const [selectedProfileId, setSelectedProfileId] = useState<number | "new" | "">("");
    const [newMemberData, setNewMemberData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        is_adult: true,
    });

    const handleAddMember = (profileIdOverride?: number) => {
        const profileId = profileIdOverride ?? selectedProfileId;
        if (!profileId || profileId === "new") return;

        const newChildIds = [
            ...family?.members.filter((m: any) => !m.is_head).map((m: any) => m.profile.id),
            profileId,
        ];

        updateFamily({
            resource: "families",
            id: family?.id,
            values: {
                child_ids: newChildIds,
                head_ids: family?.members.filter((m: any) => m.is_head).map((m: any) => m.profile.id),
            },
        });

        setSelectedProfileId("");
    };

    const handleCreateProfile = () => {
        const payload: Record<string, any> = {
            first_name: newMemberData.first_name,
            last_name: newMemberData.last_name,
            is_adult: newMemberData.is_adult,
        };

        if (newMemberData.email?.trim()) payload.email = newMemberData.email.trim();
        if (newMemberData.password?.trim()) payload.password = newMemberData.password;

        createProfile({
            values: payload,
            errorNotification: (data) => ({
                message: data?.response?.data?.detail || "Failed to create profile",
                description: "Error",
                type: "error",
            }),
        });
    };

    if (isFamilyLoading || isAllProfilesLoading) return <CircularProgress />;

    return (
        <Card>
            <CardContent>
                {family ? (<>
                    <Typography variant="h6">Family: {family.name}</Typography>
                    {family.members.map((member: any) => (
                        <Box key={member.profile.id} sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                            <Typography>
                                {member.profile.first_name} {member.profile.last_name}{" "}
                                {member.is_head ? "(Head)" : ""}
                            </Typography>
                            {isHead && !member.is_head && (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    color="error"
                                    onClick={() => {
                                        const newChildIds = family.members
                                            .filter((m: any) => !m.is_head && m.profile.id !== member.profile.id)
                                            .map((m: any) => m.profile.id);
                                        const headIds = family.members
                                            .filter((m: any) => m.is_head)
                                            .map((m: any) => m.profile.id);
                                        updateFamily({
                                            resource: "families",
                                            id: family.id,
                                            values: { child_ids: newChildIds, head_ids: headIds },
                                        });
                                    }}
                                >
                                    Remove
                                </Button>
                            )}
                        </Box>
                    ))}

                    {isHead && (
                        <>
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel id="add-member-label">Add Family Member</InputLabel>
                                <Select
                                    labelId="add-member-label"
                                    value={selectedProfileId}
                                    onChange={(e) =>
                                        setSelectedProfileId(e.target.value === "-1" ? "new" : Number(e.target.value))
                                    }
                                >
                                    <MenuItem value="-1">+ Add New Member</MenuItem>

                                    {allProfilesData?.data
                                        ?.filter(
                                            (p: any) =>
                                                !family.members.find((m: any) => m.profile.id === p.id) &&
                                                p.id !== profileData?.data?.id
                                        )
                                        .sort((a: any, b: any) =>
                                            a.first_name.localeCompare(b.first_name)
                                        )
                                        .map((profile: any) => (
                                            <MenuItem key={profile.id} value={profile.id}>
                                                {profile.first_name} {profile.last_name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>

                            {selectedProfileId === "new" && (
                                <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                                    <TextField
                                        label="First Name"
                                        value={newMemberData.first_name}
                                        onChange={(e) =>
                                            setNewMemberData({ ...newMemberData, first_name: e.target.value })
                                        }
                                    />
                                    <TextField
                                        label="Last Name"
                                        value={newMemberData.last_name}
                                        onChange={(e) =>
                                            setNewMemberData({ ...newMemberData, last_name: e.target.value })
                                        }
                                    />
                                    <TextField
                                        label="Email (optional)"
                                        value={newMemberData.email}
                                        onChange={(e) =>
                                            setNewMemberData({ ...newMemberData, email: e.target.value })
                                        }
                                    />
                                    <TextField
                                        label="Password (optional)"
                                        type="password"
                                        value={newMemberData.password}
                                        onChange={(e) =>
                                            setNewMemberData({ ...newMemberData, password: e.target.value })
                                        }
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={newMemberData.is_adult}
                                                onChange={(e) =>
                                                    setNewMemberData({ ...newMemberData, is_adult: e.target.checked })
                                                }
                                            />
                                        }
                                        label="Is Adult"
                                    />
                                    <Button variant="contained" onClick={handleCreateProfile}>
                                        Create & Add Member
                                    </Button>
                                </Box>
                            )}

                            {selectedProfileId !== "new" && (
                                <Button
                                    variant="contained"
                                    sx={{ mt: 2 }}
                                    onClick={() => handleAddMember()}
                                    disabled={!selectedProfileId}
                                >
                                    Add Member
                                </Button>
                            )}
                        </>
                    )}
                </>) : <>
                    <Typography variant="h6">No Family Found</Typography>
                    <Typography variant="body1">
                        Please contact an admin to create a new family or add you to an existing one.
                    </Typography>
                </>}
            </CardContent>
        </Card>
    );
};
