import {
    TextField,
    Stack,
    Card,
    CardContent
} from "@mui/material";
import { Controller, FieldValues } from "react-hook-form";
import { UseFormReturnType } from "@refinedev/react-hook-form";
import { BaseRecord, HttpError, useList } from "@refinedev/core";
import { ProfileSelector } from "../ProfileSelector";
import { MinimalProfile } from "../../types";

interface FamilyFormProps {
    form: UseFormReturnType<BaseRecord, HttpError, FieldValues, {}, BaseRecord, BaseRecord, HttpError>;
}

export const FamilyForm = ({ form }: FamilyFormProps) => {
    const { register, control } = form;

    const { data: profilesData, isLoading } = useList({ resource: "profiles" });

    const profiles = (profilesData?.data || []).map((p) => ({
        id: p.id,
        name: `${p.first_name} ${p.last_name}`,
    })) as MinimalProfile[];

    return (
        <Card>
            <CardContent>
                <Stack spacing={1}>
                    <TextField
                        label="Name"
                        {...register("name", { required: true })}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                    <Controller
                        control={control}
                        name="members"
                        defaultValue={[]}
                        render={({ field }) => {
                            const normalizedValue = (field.value || []).map((p: any) => ({
                                id: p.profile.id,
                                name: `${p.profile.first_name ?? ""} ${p.profile.last_name ?? ""}`.trim(),
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
                </Stack>
            </CardContent>
        </Card>
    );
};