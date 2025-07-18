import {
  useOne,
} from "@refinedev/core";
import {
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { FamilyManager } from "../../components/FamilyManager";


export const ManageProfile = () => {
  const {
    data: profileData,
    isLoading: isProfileLoading,
  } = useOne({
    resource: "profiles",
    id: "me",
  });

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Your Profile
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">Basic Info</Typography>
          <Typography>Email: {profileData?.data?.email}</Typography>
          <Typography>
            Name: {profileData?.data?.first_name} {profileData?.data?.last_name}
          </Typography>
        </CardContent>
      </Card>
      <FamilyManager />
    </Box>
  );
};
