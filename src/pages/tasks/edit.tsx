import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Stack,
    Checkbox,
    FormControlLabel,
    Card,
    CardContent
} from "@mui/material";
import { useState } from "react";
import { Profile, Tag } from "../../types";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useDelete, useList, useNavigation, useResourceParams, useUpdate } from "@refinedev/core";
import { Controller } from "react-hook-form";
import { TagSelector } from "../../components/TagSelector";

export const TaskEditCard = () => {
    const { saveButtonProps, register, handleSubmit, control } = useForm();
    const [isSaving, setIsSaving] = useState(false);
    const { mutate: updateTask } = useUpdate();
    const { mutate: deleteTask } = useDelete();
    const { list } = useNavigation();
    const { id: taskId } = useResourceParams();
    const { data: profilesData } = useList({ resource: "profiles" });

    const allProfiles = profilesData?.data as Profile[] || [];

    const onSubmit = (formValues: any) => {
        setIsSaving(true);
        const payload = {
            ...formValues,
            tag_ids: (formValues.tags || []).map((tag: Tag) => tag.id),
        };
        updateTask(
            { resource: "tasks", id: taskId, values: payload },
            {
                onSuccess: () => {
                    setIsSaving(false);
                    console.log("Task updated successfully");
                },
                onError: () => {
                    setIsSaving(false);
                },
            }
        );

    };

    const handleDelete = () => {
        if (taskId) {
            deleteTask({ resource: "tasks", id: taskId }, { onSuccess: () => list("tasks") });
        }
    };
    return (
        <Edit
            saveButtonProps={{
                ...saveButtonProps,
                onClick: handleSubmit(onSubmit),
                disabled: isSaving,
            }}
            deleteButtonProps={{
                onClick: handleSubmit(handleDelete),
                disabled: isSaving,
            }}
        >
            <Card>
                <CardContent>
                    <Stack spacing={1}>
                        <TextField
                            label="Title"
                            {...register("title", { required: true })}
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                        <TextField
                            label="Description"
                            {...register("description", { required: true })}
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                        <TextField
                            label="Start Date"
                            type="date"
                            {...register("start_date", { required: true })}
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                        <TextField
                            label="Due Date"
                            type="date"
                            {...register("due_date", { required: true })}
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                        <TextField
                            label="Due Date"
                            type="date"
                            {...register("due_date", { required: true })}
                            slotProps={{ inputLabel: { shrink: true } }}
                        />

                        <Controller
                            control={control}
                            name="profile_ids"
                            render={({ field }) => (
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>Profiles</InputLabel>
                                    <Select
                                        multiple
                                        value={field.value || []}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                                                {(selected as number[]).map((id) => {
                                                    const profile = allProfiles.find((p) => p.id === id);
                                                    return <Chip key={id} label={profile?.first_name || id} />;
                                                })}
                                            </Box>
                                        )}
                                    >
                                        {allProfiles.map((profile) => (
                                            <MenuItem key={profile.id} value={profile.id}>
                                                {profile.first_name} {profile.last_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />

                        <Controller
                            control={control}
                            name="status"
                            rules={{ required: false }}
                            render={({ field }) => (
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={field.value || ""}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    >
                                        {[
                                            "not_started",
                                            "assigned",
                                            "in_progress",
                                            "finished",
                                            "paused",
                                            "overdue",
                                        ].map((status) => (
                                            <MenuItem key={status} value={status}>
                                                {status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />

                        <Controller
                            control={control}
                            name="tags"
                            defaultValue={[]}
                            render={({ field }) => (
                                <TagSelector
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="is_public"
                            render={({ field }) => (
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={!!field.value}
                                                onChange={(e) => {
                                                    field.onChange(e.target.checked);
                                                }}
                                            />
                                        }
                                        label="Public"
                                    />
                                </FormControl>
                            )}
                        />
                    </Stack>
                </CardContent>
            </Card>
        </Edit>
    );
};
