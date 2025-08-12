import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Checkbox,
    FormControlLabel,
    Card,
    CardContent
} from "@mui/material";
import { Controller, FieldValues } from "react-hook-form";
import { TagSelector } from "../selectors/TagSelector";
import { ProfileSelector } from "../selectors/ProfileSelector";
import { UseFormReturnType } from "@refinedev/react-hook-form";
import { BaseRecord, HttpError, useList } from "@refinedev/core";
import { MinimalProfile } from "../../types";

interface TaskFormProps {
    form: UseFormReturnType<BaseRecord, HttpError, FieldValues, {}, BaseRecord, BaseRecord, HttpError>;
}

export const TaskForm = ({ form }: TaskFormProps) => {
    const { register, control } = form;
    const { data: profilesData, isLoading } = useList({resource: "profiles"});

    const profiles = (profilesData?.data || []).map((p) => ({
        id: p.id,
        name: `${p.first_name} ${p.last_name}`,
    })) as MinimalProfile[];

    return (
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

                    <Controller
                        control={control}
                        name="profiles"
                        defaultValue={[]}
                        render={({ field }) => {
                            const normalizedValue = (field.value || []).map((p: any) => ({
                                id: p.id,
                                name: p.name ?? `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim(),
                            }));

                            return (
                                <ProfileSelector
                                    value={normalizedValue}
                                    onChange={field.onChange}
                                    profiles={profiles}
                                />
                            );
                        }}
                    />

                    <Controller
                        control={control}
                        name="status"
                        defaultValue="not_started"
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
                        defaultValue={false}
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
    );
};