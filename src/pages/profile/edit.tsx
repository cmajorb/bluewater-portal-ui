import {
  useList,
  useOne,
  useUpdate,
  useCreate,
} from "@refinedev/core";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";


export const ManageProfile = () => {
  const {
    data: profileData,
    isLoading: isProfileLoading,
  } = useOne({
    resource: "profiles",
    id: "me",
  });

  const {
    data: familyData,
    isLoading: isFamilyLoading,
  } = useList({
    resource: "families/me",
    queryOptions: { queryKey: ["families", "me"] },
  });

  const {
    data: allProfilesData,
    isLoading: isAllProfilesLoading,
  } = useList({
    resource: "profiles",
    queryOptions: { queryKey: ["profiles"] },
  });

  const queryClient = useQueryClient();


  const { mutate: updateFamily } = useUpdate({
    mutationOptions: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["families", "me"] });
      },
    },
  });

  const { mutate: createFamily } = useCreate({
    mutationOptions: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["families", "me"] });
      },
    },
  });

  const family = familyData?.data?.[0]; // Assume 1 family max for now
  const isHead = family?.members?.find(
    (m: any) => m.profile.id === profileData?.data?.id && m.is_head
  );

  const [selectedProfileId, setSelectedProfileId] = useState<number>();

  const handleAddMember = () => {
    if (!selectedProfileId) return;

    const newChildIds = [
      ...family?.members
        .filter((m: any) => !m.is_head)
        .map((m: any) => m.profile.id),
      selectedProfileId,
    ];
    console.log("hit");
    console.log(newChildIds);

    updateFamily({
      resource: "families",
      id: family?.id,
      values: {
        child_ids: newChildIds,
        head_ids: family?.members
          .filter((m: any) => m.is_head)
          .map((m: any) => m.profile.id),
      },
    });
  };

  if (isFamilyLoading || isAllProfilesLoading) {
    return <CircularProgress />;
  }

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

      {family && (
        <Card>
          <CardContent>
            <Typography variant="h6">Family: {family.name}</Typography>
            {family.members.map((member: any) => (
              <Box key={member.profile.id} sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                <Typography>
                  {member.profile.first_name} {member.profile.last_name}{" "}
                  {member.is_head ? "(Head)" : ""}
                </Typography>

                {/* Show Remove button only for non-heads if user is head */}
                {isHead && !member.is_head && (
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => {
                      const newChildIds = family.members
                        .filter(
                          (m: any) =>
                            !m.is_head && m.profile.id !== member.profile.id // remove this member
                        )
                        .map((m: any) => m.profile.id);

                      const headIds = family.members
                        .filter((m: any) => m.is_head)
                        .map((m: any) => m.profile.id);

                      updateFamily({
                        resource: "families",
                        id: family.id,
                        values: {
                          child_ids: newChildIds,
                          head_ids: headIds,
                        },
                      });
                    }}
                  >
                    Remove
                  </Button>
                )}
              </Box>
            ))}

            {isHead && (
              <>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel id="add-member-label">Add Family Member</InputLabel>
                  <Select
                    labelId="add-member-label"
                    value={selectedProfileId ?? ""}
                    onChange={(e) => setSelectedProfileId(Number(e.target.value))}
                  >
                    {allProfilesData?.data
                      ?.filter(
                        (p: any) =>
                          !family.members.find(
                            (m: any) => m.profile.id === p.id
                          ) && p.id !== profileData?.data?.id
                      )
                      .map((profile: any) => (
                        <MenuItem key={profile.id} value={profile.id}>
                          {profile.first_name} {profile.last_name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={handleAddMember}
                  disabled={!selectedProfileId}
                >
                  Add Member
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}
{/* Leaving this out since it is only for admins */}

      {/* {!family && (
        <Button
          variant="contained"
          onClick={() =>
            createFamily({
              resource: "families",
              values: {
                name: `${profileData?.data?.last_name} Family`,
                head_ids: [profileData?.data?.id],
              },
            })
          }
        >
          Create My Family
        </Button>
      )} */}
    </Box>
  );
};
