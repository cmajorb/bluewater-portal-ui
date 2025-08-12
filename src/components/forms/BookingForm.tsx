// BookingForm.tsx
import {
    Box,
    IconButton,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Family, Member, MinimalProfile, Profile } from "../../types";
import { Controller } from "react-hook-form";
import { ProfileSelector } from "../ProfileSelector";
import { useList } from "@refinedev/core";

type BookingFormProps = {
    control: any;
    register: any;
    familyMembers: Member[];
    allProfiles: Profile[];
    guestFields: any;
    appendGuest: (guest: any) => void;
    removeGuest: (index: number) => void;
};

export const BookingForm = ({
    control,
    register,
    allProfiles,
    guestFields,
    appendGuest,
    removeGuest,
}: BookingFormProps) => {

    const { data: familyData } = useList({ resource: "families/me" });

    const family = familyData?.data?.[0] as Family;
    const familyMembers = family?.members as Member[] || [];

    const allFamilyMembers = familyMembers.map((p) => ({
        id: p.profile.id,
        name: `${p.profile.first_name} ${p.profile.last_name}`,
    })) as MinimalProfile[];

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
            <TextField
                label="Arrival Time"
                type="time"
                {...register("arrival_time")}
                slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
                label="Departure Time"
                type="time"
                {...register("departure_time")}
                slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
                label="Note"
                multiline
                {...register("note")}
                slotProps={{ inputLabel: { shrink: true } }}
            />

            <Typography variant="h6" gutterBottom>
                Guests
            </Typography>

            <Controller
                control={control}
                name="guests"
                defaultValue={[]}
                render={({ field }) => {
                    const normalizedValue = (field.value || []).map((guest: any) => {
                        const profile = allProfiles.find((m: any) => m.id === guest.profile_id);
                        console.log("Guest profile:", profile);
                        return {
                            id: guest.profile_id,
                            name: profile ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() : "",
                        };
                    });

                    return (
                        <ProfileSelector
                            value={field.value}
                            onChange={field.onChange}
                            profiles={allFamilyMembers}
                        />
                    );
                }}
            />

            {/* Select from dropdown */}
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="add-guest-label">Add Guest</InputLabel>
                <Select
                    labelId="add-guest-label"
                    value=""
                    onChange={(e) => {
                        appendGuest({ profile_id: e.target.value });
                    }}
                >
                    {familyMembers
                        .filter(
                            (member: any) =>
                                !guestFields.find((g: any) => g.profile_id === member.profile.id)
                        )
                        .map((member: any) => (
                            <MenuItem key={member.profile.id} value={member.profile.id}>
                                {member.profile.first_name} {member.profile.last_name}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>

            {/* Display selected guests */}
            <Box>
                {guestFields.map((guest: any, index: number) => {
                    const member = allProfiles.find(
                        (m: any) => m.id === guest.profile_id
                    );

                    return (
                        <Box
                            key={guest.id}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                px: 2,
                                py: 1,
                                mb: 1,
                                borderRadius: 1,
                            }}
                        >
                            <Typography>
                                {member?.first_name} {member?.last_name}
                            </Typography>
                            <IconButton onClick={() => removeGuest(index)} color="error">
                                <RemoveCircleOutlineIcon />
                            </IconButton>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    )
};
