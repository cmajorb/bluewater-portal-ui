import {
  useRegister,
  useNavigation,
  useTranslate,
} from "@refinedev/core";
import {
  TextField,
  Box,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useForm } from "react-hook-form";

export const Register = () => {
  const t = useTranslate();
  const { mutateAsync: register } = useRegister();
  const { push } = useNavigation();
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm();

  const onSubmit = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    const result = await register({
      email: values.email,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
      isAdult: values.isAdult,
      isAdmin: false,
    });

    if (result?.success) {
      // Optional: auto-login immediately after registration
      await register.login?.({
        email: values.email,
        password: values.password,
      });

      push("/");
    } else if (result?.error) {
      setError("email", {
        type: "server",
        message: result.error.message,
      });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: 400,
        margin: "auto",
        mt: 10,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
    >
      <Typography variant="h5" mb={2}>
        Create Account
      </Typography>

      <TextField
        fullWidth
        label="First Name"
        margin="normal"
        {...formRegister("firstName", { required: "First name is required" })}
        error={!!errors.firstName}
        helperText={errors.firstName?.message as string}
      />

      <TextField
        fullWidth
        label="Last Name"
        margin="normal"
        {...formRegister("lastName", { required: "Last name is required" })}
        error={!!errors.lastName}
        helperText={errors.lastName?.message as string}
      />

      <TextField
        fullWidth
        label="Email"
        type="email"
        margin="normal"
        {...formRegister("email", { required: "Email is required" })}
        error={!!errors.email}
        helperText={errors.email?.message as string}
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        {...formRegister("password", { required: "Password is required" })}
        error={!!errors.password}
        helperText={errors.password?.message as string}
      />

      <TextField
        fullWidth
        label="Confirm Password"
        type="password"
        margin="normal"
        {...formRegister("confirmPassword", { required: "Confirm your password" })}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message as string}
      />

      <FormControlLabel
        control={
          <Checkbox
            {...formRegister("isAdult")}
            defaultChecked
          />
        }
        label="I am 18 or older"
      />

      <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>
        Register
      </Button>

      <Typography mt={2} variant="body2">
        Already have an account? <a href="/login">Login</a>
      </Typography>
    </Box>
  );
};
