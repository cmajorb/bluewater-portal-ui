import {
  Create,
} from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useFieldArray } from "react-hook-form";
import {
  TextField,
  Box,
  Button,
  IconButton,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useList, useCreate } from "@refinedev/core";
import { parseISO, eachDayOfInterval, format } from "date-fns";

export const BookingCreate = () => {
  const {
    register,
    handleSubmit,
    control,
    saveButtonProps,
  } = useForm();

  const { mutate: createBooking } = useCreate();

  const {
    fields: guestFields,
    append: appendGuest,
    remove: removeGuest,
  } = useFieldArray({
    control,
    name: "guests",
  });

  const { data: familyData } = useList({
    resource: "families/me",
    queryOptions: { queryKey: ["families", "me"] },
  });

  const family = familyData?.data?.[0];
  const familyMembers = family?.members || [];

  const onSubmit = async (formValues: any) => {
    const start = parseISO(formValues.start_date);
    const end = parseISO(formValues.end_date);
    const days = eachDayOfInterval({ start, end });

    const meals = days.map((day) => ({
      date: format(day, "yyyy-MM-dd"),
      has_breakfast: true,
      has_lunch: true,
      has_dinner: true,
    }));

    const guests = formValues.guests.map((guest: any) => ({
      profile_id: Number(guest.profile_id),
      meals,
    }));

    createBooking({
      resource: "bookings",
      values: {
        start_date: formValues.start_date,
        end_date: formValues.end_date,
        arrival_time: formValues.arrival_time,
        departure_time: formValues.departure_time,
        note: formValues.note,
        guests,
      },
    });
  };

  return (
    <Create saveButtonProps={{
        ...saveButtonProps,
        onClick: handleSubmit(onSubmit),
      }}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
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
        {guestFields.map((guest: any, index) => (
          <Box
            key={guest.id}
            sx={{ border: "1px solid #ccc", p: 2, mb: 2, borderRadius: 2 }}
          >
            <FormControl fullWidth>
              <InputLabel id={`guest-${index}-profile-label`}>
                Family Member
              </InputLabel>
              <Select
                labelId={`guest-${index}-profile-label`}
                defaultValue={guest.profile_id ?? ""}
                {...register(`guests.${index}.profile_id`, { required: true })}
              >
                {familyMembers.map((member: any) => (
                  <MenuItem key={member.profile.id} value={member.profile.id}>
                    {member.profile.first_name} {member.profile.last_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mt: 1 }}>
              <IconButton onClick={() => removeGuest(index)} color="error">
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Box>
          </Box>
        ))}

        <Button
          variant="outlined"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() =>
            appendGuest({
              profile_id: "",
            })
          }
        >
          Add Guest
        </Button>

      </Box>
    </Create>
  );
};
