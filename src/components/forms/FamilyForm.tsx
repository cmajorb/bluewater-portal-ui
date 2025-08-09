import {
    TextField,
    Stack,
    Card,
    CardContent
} from "@mui/material";
import { Controller, FieldValues } from "react-hook-form";
import { UseFormReturnType } from "@refinedev/react-hook-form";
import { BaseRecord, HttpError } from "@refinedev/core";
import { MemberSelector } from "../MemberSelector";

interface FamilyFormProps {
    form: UseFormReturnType<BaseRecord, HttpError, FieldValues, {}, BaseRecord, BaseRecord, HttpError>;
}

export const FamilyForm = ({ form }: FamilyFormProps) => {
    const { register, control } = form;

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
                        render={({ field }) => (
                            <MemberSelector
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </Stack>
            </CardContent>
        </Card>
    );
};