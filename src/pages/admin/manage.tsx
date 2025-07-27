import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import { useNavigate } from "react-router-dom";

const resources = [
  {
    title: "Families",
    description: "Manage family groups and heads of household.",
    icon: <GroupsIcon fontSize="large" color="primary" />,
    path: "/admin/families",
  },
  {
    title: "Profiles",
    description: "View and manage individual profiles.",
    icon: <PersonIcon fontSize="large" color="primary" />,
    path: "/admin/profiles",
  },
  {
    title: "Rooms",
    description: "Manage room info like size and capacity.",
    icon: <MeetingRoomIcon fontSize="large" color="primary" />,
    path: "/admin/rooms",
  },
];

export default function AdminPanel() {
  const navigate = useNavigate();

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>

      <Typography variant="body1" mb={4}>
        Use the tools below to manage key data for your organization.
      </Typography>

      <Grid container spacing={4}>
        {resources.map((res) => (
          <Grid item xs={12} sm={6} md={4} key={res.title}>
            <Card elevation={3}>
              <CardActionArea onClick={() => navigate(res.path)}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    {res.icon}
                    <Typography variant="h6">{res.title}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {res.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
