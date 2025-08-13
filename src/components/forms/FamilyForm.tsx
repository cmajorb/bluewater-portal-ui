import {
    TextField,
    Stack,
    Card,
    CardContent,
    FormControlLabel,
    Checkbox,
    Typography
} from "@mui/material";
import { Controller, FieldValues } from "react-hook-form";
import { UseFormReturnType } from "@refinedev/react-hook-form";
import { BaseRecord, HttpError, useList } from "@refinedev/core";
import { ProfileSelector } from "../selectors/ProfileSelector";
import { MinimalProfile } from "../../types";

type MemberWithHead = MinimalProfile & { is_head?: boolean };

interface FamilyFormProps {
    form: UseFormReturnType<BaseRecord, HttpError, FieldValues>;
}

export const FamilyForm = ({ form }: FamilyFormProps) => {
    const { register, control } = form;

    const { data: profilesData } = useList({ resource: "profiles" });

    const profiles = (profilesData?.data || []).map((p) => ({
        id: p.id,
        name: `${p.first_name} ${p.last_name}`,
    })) as MinimalProfile[];

    return (
        <Card>
            <CardContent>
                <Stack spacing={2}>
                    <TextField
                        label="Name"
                        {...register("name", { required: true })}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />

                    {/* Member Selector */}
                    <Controller
                        control={control}
                        name="members"
                        defaultValue={[]}
                        render={({ field }) => {
                            // Convert stored value to selector-friendly format
                            const normalizedValue = (field.value || []).map((m: any) => ({
                                id: m.profile.id,
                                name: `${m.profile.first_name ?? ""} ${m.profile.last_name ?? ""}`.trim(),
                                is_head: m.is_head ?? false
                            }));

                            const handleProfilesChange = (selectedProfiles: MinimalProfile[]) => {
                                // Map selected profiles back to full object shape
                                const updatedMembers = selectedProfiles.map(sp => {
                                    const existing = (field.value || []).find((m: any) => m.profile.id === sp.id);
                                    return existing || {
                                        profile: { id: sp.id, first_name: sp.name.split(" ")[0], last_name: sp.name.split(" ")[1] || "" },
                                        is_head: false
                                    };
                                });
                                field.onChange(updatedMembers);
                            };

                            return (
                                <Stack spacing={1}>
                                    <ProfileSelector
                                        value={normalizedValue}
                                        onChange={handleProfilesChange}
                                        profiles={profiles}
                                    />

                                    <Typography variant="subtitle1">
                                        Set Head(s) of Family
                                    </Typography>
                                    {normalizedValue.map((m: MemberWithHead, index: number) => (
                                        <FormControlLabel
                                            key={m.id}
                                            control={
                                                <Checkbox
                                                    checked={m.is_head || false}
                                                    onChange={(e) => {
                                                        const updated = [...(field.value || [])];
                                                        updated[index] = {
                                                            ...updated[index],
                                                            is_head: e.target.checked
                                                        };
                                                        field.onChange(updated);
                                                    }}
                                                />
                                            }
                                            label={m.name}
                                        />
                                    ))}
                                </Stack>
                            );
                        }}
                    />
                </Stack>
            </CardContent>
        </Card>
    );
};
