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

type BookingFormProps = {
    control: any;
    register: any;
    familyMembers: any[];
    guestFields: any[];
    appendGuest: (guest: any) => void;
    removeGuest: (index: number) => void;
};

export const BookingForm = ({
    control,
    register,
    familyMembers,
    guestFields,
    appendGuest,
    removeGuest,
}: BookingFormProps) => (
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
                const member = familyMembers.find(
                    (m: any) => m.profile.id === guest.profile_id
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
                            {member?.profile.first_name} {member?.profile.last_name}
                        </Typography>
                        <IconButton onClick={() => removeGuest(index)} color="error">
                            <RemoveCircleOutlineIcon />
                        </IconButton>
                    </Box>
                );
            })}
        </Box>
    </Box>
);
