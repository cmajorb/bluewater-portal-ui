import {
    Box,
    Typography,
    Stack,
    Card,
    CardContent
} from "@mui/material";
import { Checklist } from "../../types";
import { useNavigation } from "@refinedev/core";

type Props = {
    checklist: Checklist;
};

export const ChecklistCard = ({ checklist: checklist }: Props) => {
    const { show } = useNavigation();

    return (
        <Card
            key={checklist.id}
            onClick={() => show("checklists", checklist.id)}
            sx={{
                cursor: "pointer",
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
                        <Typography variant="h5">{checklist.title}</Typography>
                        
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};
