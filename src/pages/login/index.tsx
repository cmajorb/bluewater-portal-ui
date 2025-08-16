import { AuthPage } from "@refinedev/mui";
import { Stack, Typography } from "@mui/material";
import { BluewaterLogo } from "../../components/BluewaterLogo";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      title={
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
          <BluewaterLogo color="primary" fontSize="medium" />
          {/* <Typography variant="h6" component="span">Bluewater Portal</Typography> */}
          <Typography variant="subtitle1">Bluewater Portal</Typography>
        </Stack>
      }
      formProps={{}}
    />
  );
};
