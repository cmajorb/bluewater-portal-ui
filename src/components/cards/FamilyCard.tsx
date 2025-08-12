import {
    Box,
    Typography,
    Stack,
    Card,
    CardContent,
    Chip,
    useTheme
} from "@mui/material";
import { Family } from "../../types";
import { useNavigation } from "@refinedev/core";

type Props = {
    family: Family;
};

export const FamilyCard = ({ family }: Props) => {
    const { show } = useNavigation();
    const theme = useTheme();

    return (
        <Card
            key={family.id}
            onClick={() => show("families", family.id)}
            sx={{
                cursor: "pointer",
                variant: "outlined",
                paddingBottom: 2,
            }}
        >
            <CardContent>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                    flexWrap="wrap"
                >
                    <Box flexGrow={1}>
                        <Typography variant="h5">{family.name}</Typography>

                        {family.members && family.members.length > 0 && (
                            <Stack direction="row" mt={1} flexWrap="wrap">
                                {family.members.map((m) => (
                                    <Chip
                                        key={m.profile.id}
                                        label={`${m.profile.first_name} ${m.profile.last_name}`}
                                        variant={m.is_head ? "filled" : "outlined"}
                                        size="small"
                                        sx={{ marginRight: 1, marginBottom: 1}}
                                    />
                                ))}
                            </Stack>
                        )}
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};
