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
import { Profile } from "../types";

export function ProfileSelector({ value, onChange }: {
    value: Profile[];
    onChange: (profiles: Profile[]) => void;
}) {
    const { data: profilesData, isLoading, refetch } = useList({ resource: "profiles" });
    const allProfiles = (profilesData?.data || []) as Profile[];
    const selectedProfileIds = (value || []).map(profile => profile.id);

    const handleSelectChange = (event: SelectChangeEvent<number[]>) => {
        const selectedIds = event.target.value as number[];
        const selectedProfiles = allProfiles.filter(profile => selectedIds.includes(profile.id));
        onChange(selectedProfiles);
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <FormControl fullWidth>
            <InputLabel>Profiles</InputLabel>
            <Select
                multiple
                value={selectedProfileIds}
                onChange={handleSelectChange}
                renderValue={(selected) => (
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        {selected.map((id) => {
                            const profile = value.find((p) => p.id === id);
                            return <Chip key={id} label={`${profile?.first_name} ${profile?.last_name}` || id} />;
                        })}
                    </Box>
                )}
            >
                {allProfiles.map((profile) => (
                    <MenuItem key={profile.id} value={profile.id}>
                        {`${profile?.first_name} ${profile?.last_name}`}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}