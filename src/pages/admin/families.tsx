import { useState } from "react";
import {
    Button,
    Card,
    CardContent,
    Input,
    MenuItem,
    Select,
    Typography,
    Checkbox,
    FormControlLabel,
    Stack,
    CardHeader,
} from "@mui/material";
import { Family, Profile } from "../../types";
import { useCreate, useDelete, useList, useUpdate } from "@refinedev/core";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

export default function FamiliesAdmin() {
    const { data: familiesData, refetch } = useList({ resource: "families" });
    const families = (familiesData?.data || []) as Family[];

    const { data: profilesData } = useList({ resource: "profiles" });
    const profiles = (profilesData?.data || []) as Profile[];

    const { mutate: createFamily } = useCreate();
    const { mutate: deleteFamily } = useDelete();
    const { mutate: updateFamily } = useUpdate();
    const { mutate: updateMembers } = useUpdate();

    const [newFamilyName, setNewFamilyName] = useState("");
    const [newFamilyHeadId, setNewFamilyHeadId] = useState<number | null>(null);

    const [editingFamilyId, setEditingFamilyId] = useState<number | null>(null);
    const [editedName, setEditedName] = useState("");

    const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
    const [isAddingHead, setIsAddingHead] = useState(false);

    const handleCreate = () => {
        if (!newFamilyName.trim()) return;

        const headId = newFamilyHeadId;
        const head_ids = headId ? [headId] : [];
        const child_ids = headId ? [] : [];

        createFamily(
            {
                resource: "families",
                values: {
                    name: newFamilyName,
                    head_ids,
                    child_ids,
                },
            },
            {
                onSuccess: () => {
                    setNewFamilyName("");
                    setNewFamilyHeadId(null);
                    refetch();
                },
            }
        );
    };

    const handleDelete = (id: number) => {
        deleteFamily(
            { resource: "families", id },
            {
                onSuccess: () => refetch(),
            }
        );
    };

    const handleEdit = (id: number, currentName: string) => {
        setEditingFamilyId(id);
        setEditedName(currentName);
    };

    const handleUpdate = (id: number) => {
        updateFamily(
            {
                resource: "families",
                id,
                values: { name: editedName },
            },
            {
                onSuccess: () => {
                    setEditingFamilyId(null);
                    setEditedName("");
                    refetch();
                },
            }
        );
    };

    const handleAddProfile = (family: Family, profileId: number, isHead: boolean) => {
        const alreadyMember = family.members.find(
            (m) => m.profile.id === profileId
        );
        if (alreadyMember) return;

        const updatedMembers = [
            ...family.members,
            {
                profile: profiles.find((p) => p.id === profileId)!,
                is_head: isHead,
            },
        ];

        updateMembers(
            {
                resource: "families",
                id: family.id,
                values: {
                    head_ids: updatedMembers.filter((m) => m.is_head).map((m) => m.profile.id),
                    child_ids: updatedMembers.filter((m) => !m.is_head).map((m) => m.profile.id),
                },
            },
            {
                onSuccess: () => {
                    setSelectedProfileId(null);
                    setIsAddingHead(false);
                    refetch();
                },
            }
        );
    };

    const handleRemoveProfile = (family: Family, profileId: number) => {
        const updatedMembers = family.members.filter(
            (m) => m.profile.id !== profileId
        );

        updateMembers(
            {
                resource: "families",
                id: family.id,
                values: {
                    head_ids: updatedMembers.filter((m) => m.is_head).map((m) => m.profile.id),
                    child_ids: updatedMembers.filter((m) => !m.is_head).map((m) => m.profile.id),
                },
            },
            { onSuccess: () => refetch() }
        );
    };

    return (
        <div className="space-y-6">
            <Typography variant="h4" fontWeight="bold">
                Families
            </Typography>
            <div className="max-w-md mx-auto">
  <Card>
    <CardHeader title="Create New Family" />
    <CardContent>
      {/* Use the Stack component for simple vertical layouts */}
      <Stack spacing={3}>
        <Input
          fullWidth
          placeholder="New family name"
          value={newFamilyName}
          onChange={(e) => setNewFamilyName(e.target.value)}
        />
        <Select
          fullWidth
          value={newFamilyHeadId ?? ""}
          displayEmpty
          onChange={(e) => setNewFamilyHeadId(Number(e.target.value))}
          size="small"
        >
          <MenuItem value="">Select head of family</MenuItem>
          {profiles.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.first_name} {p.last_name}
            </MenuItem>
          ))}
        </Select>
        <Button variant="contained" fullWidth onClick={handleCreate}>
          Add Family
        </Button>
      </Stack>
    </CardContent>
  </Card>
</div>



            {families.map((family) => (
                <Card key={family.id}>
                    <CardContent>
                        <div className="mb-2">
                            <div className="flex justify-between items-center">
                                {editingFamilyId === family.id ? (
                                    <div className="flex items-center gap-2">
                                        <Input
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                        />
                                        <SaveIcon
                                            color="primary"
                                            onClick={() => handleUpdate(family.id)}
                                            className="cursor-pointer"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Typography variant="h6">{family.name}</Typography>
                                        <EditIcon
                                            color="primary"
                                            onClick={() => handleEdit(family.id, family.name)}
                                            className="cursor-pointer"
                                        />
                                        <DeleteIcon
                                            color="error"
                                            onClick={() => handleDelete(family.id)}
                                            className="cursor-pointer"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <ul className="list-disc ml-6 mb-2">
                            {family.members.map((m) => (
                                <li key={m.profile.id} className="flex justify-between items-center">
                                    <span>
                                        {m.profile.first_name} {m.profile.last_name}{" "}
                                        {m.is_head && <strong>(Head)</strong>}
                                    </span>
                                    <Button
                                        size="small"
                                        variant="text"
                                        onClick={() => handleRemoveProfile(family, m.profile.id)}
                                    >
                                        Remove
                                    </Button>
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <Select
                                size="small"
                                value={selectedProfileId || ""}
                                displayEmpty
                                onChange={(e) => setSelectedProfileId(Number(e.target.value))}
                                style={{ minWidth: 200 }}
                            >
                                <MenuItem value="">Select profile to add</MenuItem>
                                {profiles
                                    .filter(
                                        (p) => !family.members.find((m) => m.profile.id === p.id)
                                    )
                                    .map((p) => (
                                        <MenuItem key={p.id} value={p.id}>
                                            {p.first_name} {p.last_name}
                                        </MenuItem>
                                    ))}
                            </Select>

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isAddingHead}
                                        onChange={(e) => setIsAddingHead(e.target.checked)}
                                    />
                                }
                                label="Head of Family"
                            />

                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                    if (selectedProfileId)
                                        handleAddProfile(family, selectedProfileId, isAddingHead);
                                }}
                            >
                                Add Member
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
