// pages/bookings/create.tsx
import {
  Edit
} from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";

import {
  TextField,
  Box,
  Button,
  Typography,
} from "@mui/material";

export const BookingEdit = () => {
  const {
    saveButtonProps,
    register,
    formState: { errors },
  } = useForm({});

  return (
    <Edit>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Start Date"
          type="date"
          {...register("start_date", { required: true })}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          {...register("end_date", { required: true })}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Note"
          multiline
          {...register("note")}
        />
        {/* Simplified for now — we'll add guests later */}
        <Button {...saveButtonProps}>Save</Button>
      </Box>
    </Edit>
  );
};
