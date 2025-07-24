import { Stack, Typography } from "@mui/material";
import { useList, useOne, useShow } from "@refinedev/core";
import {
  DateField,
  MarkdownField,
  Show,
  TextFieldComponent as TextField,
} from "@refinedev/mui";

export const BookingShow = () => {
  const { query } = useShow({});

  const { data, isLoading } = query;

  const record = data?.data;

  const { data: profilesData } = useList({ resource: "profiles" });
  const allProfiles = profilesData?.data || [];


  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">
          {"Start Date"}
        </Typography>
        <MarkdownField value={record?.start_date + " (" + record?.arrival_time + ")"} />

        <Typography variant="body1" fontWeight="bold">
          {"End Date"}
        </Typography>
        <MarkdownField value={record?.end_date + " (" + record?.departure_time + ")"} />

        <Typography variant="body1" fontWeight="bold">
          {"Note"}
        </Typography>
        <MarkdownField value={record?.note} />
        <Typography variant="body1" fontWeight="bold">
          {"Guests  "}
        </Typography>
        {record?.guests.map((guest: any, index: number) => {
          const member = allProfiles.find(
            (m: any) => m.id === guest.profile_id
          );
          return (
            <TextField value={`${member?.first_name} ${member?.last_name}`} />
          )
        })}
      </Stack>
    </Show>
  );
};
