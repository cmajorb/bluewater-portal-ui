// src/pages/home/HomePage.tsx

import { Alert, Card, CardContent, Typography } from "@mui/material";
import { useGetIdentity } from "@refinedev/core";

export const HomePage = () => {
    const { data: user } = useGetIdentity<{ first_name?: string }>();

    return (
        <Card sx={{ maxWidth: 900, margin: "2rem auto", padding: 2 }}>
            <img
                src="https://nmlandconservancy.org/wp-content/uploads/2018/06/Bluewater-reflection.jpg"
                alt="Bluewater Heritage Ranch"
                style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "cover",
                    borderRadius: "8px"
                }}
            />
            <CardContent>
                <Typography variant="h4" gutterBottom>
                    Welcome to the Bluewater Portal{user?.first_name ? `, ${user.first_name}` : ""}!
                </Typography>

                <Typography variant="body1" gutterBottom>
                    The Bluewater Portal is your all-in-one tool for managing everything related to Bluewater Heritage Ranch.
                </Typography>

                <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
                    Current Feature: Bookings
                </Typography>
                To request a booking at the ranch, follow these steps:
                <ol style={{ paddingLeft: "1.5rem" }}>
                    <li>Ask an admin to create a <strong>family</strong> for you.</li>
                    <li>Add <strong>family member profiles</strong> to your family (adults and children).</li>
                    <li>Use the <strong>Bookings</strong> section to request your stay.</li>
                </ol>

                <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
                    Coming Soon
                </Typography>
                <ul style={{ paddingLeft: "1.5rem" }}>
                    <li>Access and manage important documents (e.g., taxes, insurance, agreements).</li>
                    <li>Upload and browse photos taken at the ranch.</li>
                    <li>Choose your preferred room before your stay.</li>
                </ul>

                <Alert severity="info" sx={{ mt: 3 }}>
                    <Typography variant="body2">
                        We're actively developing this portal to better serve Bluewater Heritage Ranch guests.
                        If you have suggestions or feedback, don't hesitate to reach out!
                    </Typography>
                </Alert>
            </CardContent>
        </Card>
    );
};
