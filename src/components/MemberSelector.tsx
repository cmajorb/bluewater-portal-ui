import {
    Box,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    CircularProgress,
    SelectChangeEvent,
} from "@mui/material";
import { useList } from "@refinedev/core";
import { Member, Profile } from "../types";

export function MemberSelector({ value, onChange }: {
    value: Member[];
    onChange: (members: Member[]) => void;
}) {
    const { data: profilesData, isLoading, refetch } = useList({ resource: "profiles" });
    const allProfiles = (profilesData?.data || []) as Profile[];
    const allMembers: Member[] = allProfiles.map((profile) => {
        const existingMember = value.find((m) => m.profile.id === profile.id);
        return {
            profile,
            is_head: existingMember ? existingMember.is_head : false,
        };
    });
    const selectedMemberIds = (value || []).map(member => member.profile.id);

    const handleSelectChange = (event: SelectChangeEvent<number[]>) => {
        const selectedIds = event.target.value as number[];
        const selectedMembers = allMembers.filter(member => selectedIds.includes(member.profile.id));
        onChange(selectedMembers);
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <FormControl fullWidth>
            <InputLabel>Family Members</InputLabel>
            <Select
                multiple
                value={selectedMemberIds}
                onChange={handleSelectChange}
                renderValue={(selected) => (
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        {selected.map((id) => {
                            const member = value.find((m) => m.profile.id === id);
                            return <Chip key={id} label={`${member?.profile.first_name} ${member?.profile.last_name}` || id} variant={member?.is_head ? "filled" : "outlined"} />;
                        })}
                    </Box>
                )}
            >
                {allMembers.map((member) => (
                    <MenuItem key={member.profile.id} value={member.profile.id}>
                        {`${member?.profile.first_name} ${member?.profile.last_name}`}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}