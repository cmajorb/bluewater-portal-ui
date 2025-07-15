import {
  Edit,
} from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useFieldArray } from "react-hook-form";
import {
  TextField,
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import { useList, useUpdate } from "@refinedev/core";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { parseISO, eachDayOfInterval, format } from "date-fns";
import { useResourceParams } from "@refinedev/core";


export const BookingEdit = () => {
  const {
    saveButtonProps,
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

    const { mutate: updateBooking } = useUpdate();
  

  const {
    fields: guestFields,
    append: appendGuest,
    remove: removeGuest,
  } = useFieldArray({
    control,
    name: "guests",
  });

  const { data: familyData, isLoading: isFamilyLoading } = useList({
    resource: "families/me",
    queryOptions: { queryKey: ["families", "me"] },
  });
  const { id: bookingId } = useResourceParams();

const onSubmit = (formValues: any) => {
  const start = parseISO(formValues.start_date);
  const end = parseISO(formValues.end_date);
  const days = eachDayOfInterval({ start, end });

  const guests = formValues.guests.map((guest: any) => {
    const completeMeals = days.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const existing = guest.meals?.find((m: any) => m.date === dateStr);
      return (
        existing || {
          date: dateStr,
          has_breakfast: true,
          has_lunch: true,
          has_dinner: true,
        }
      );
    });

    return {
      profile_id: Number(guest.profile_id),
      meals: completeMeals,
    };
  });

  updateBooking({
    resource: "bookings",
    id: bookingId,
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

  const family = familyData?.data?.[0];
  const familyMembers = family?.members || [];

  return (
    <Edit saveButtonProps={{
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

        <Typography variant="h6">Guests</Typography>
        {guestFields.map((guest: any, index) => (
          <Box key={guest.id} sx={{ border: "1px solid #ccc", p: 2, borderRadius: 2 }}>
            <FormControl fullWidth>
              <InputLabel id={`guest-${index}-profile-label`}>Family Member</InputLabel>
              <Select
                labelId={`guest-${index}-profile-label`}
                {...register(`guests.${index}.profile_id`, { required: true })}
                defaultValue={guest.profile_id ?? ""}
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
          onClick={() =>
            appendGuest({
              profile_id: "",
            })
          }
        >
          Add Guest
        </Button>
      </Box>
    </Edit>
  );
};
