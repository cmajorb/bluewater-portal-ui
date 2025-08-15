import {
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import { usePermissions, useShow } from "@refinedev/core";
import { Show } from "@refinedev/mui";
import { Checklist } from "../../types";
import { ChecklistAccordion } from "../../components/Checklist";

export const ChecklistShow = () => {
  const { query } = useShow<Checklist>();
  const { data, isLoading } = query;
  const checklist = data?.data as Checklist;

  const { data: permissionsData } = usePermissions();
      const permissions = (permissionsData as string[]) ?? [];
      const isAdmin = permissions.includes("admin");

  return (
    <Show isLoading={isLoading} canEdit={isAdmin}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h4" fontWeight="bold">
            {checklist?.title}
          </Typography>
          {checklist && <ChecklistAccordion checklist={checklist} />}
        </Stack>
      </Paper>
    </Show>
  );
};
