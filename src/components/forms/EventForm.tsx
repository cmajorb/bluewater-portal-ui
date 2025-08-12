import {
    TextField,
    Stack,
    Card,
    CardContent
} from "@mui/material";
import { Controller, FieldValues } from "react-hook-form";
import { UseFormReturnType } from "@refinedev/react-hook-form";
import { BaseRecord, HttpError, useList } from "@refinedev/core";
import { MinimalProfile } from "../../types";
import { FamilySelector } from "../selectors/FamilySelector";

interface EventFormProps {
    form: UseFormReturnType<BaseRecord, HttpError, FieldValues, {}, BaseRecord, BaseRecord, HttpError>;
}

export const EventForm = ({ form }: EventFormProps) => {
    const { register, control } = form;
    const { data: familiesData, isLoading } = useList({resource: "families"});

    const families = (familiesData?.data || []).map((f) => ({
        id: f.id,
        name: f.name,
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
                        label="End Date"
                        type="date"
                        {...register("end_date", { required: true })}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />

                    <Controller
                        control={control}
                        name="invited_families"
                        defaultValue={[]}
                        render={({ field }) => {
                            const normalizedValue = (field.value || []).map((p: any) => ({
                                id: p.id,
                                name: p.name,
                            }));

                            return (
                                <FamilySelector
                                    value={normalizedValue}
                                    onChange={field.onChange}
                                    families={families}
                                />
                            );
                        }}
                    />

                </Stack>
            </CardContent>
        </Card>
    );
};