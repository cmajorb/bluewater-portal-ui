import {
    Box,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import { MinimalProfile } from "../types";



interface ProfileSelectorProps {
    value: MinimalProfile[];
    onChange: (profiles: MinimalProfile[]) => void;
    profiles: MinimalProfile[];
}

export function ProfileSelector({ value, onChange, profiles }: ProfileSelectorProps) {
    const selectedIds = (value || []).map((profile) => profile.id);

    const handleSelectChange = (event: SelectChangeEvent<number[]>) => {
        const selectedIds = event.target.value as number[];
        const selectedProfiles = profiles.filter((p) => selectedIds.includes(p.id));
        onChange(selectedProfiles);
    };

    return (
        <FormControl fullWidth>
            <InputLabel>Profiles</InputLabel>
            <Select
                multiple
                value={selectedIds}
                onChange={handleSelectChange}
                renderValue={(selected) => (
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        {selected.map((id) => {
                            const profile = value.find((p) => p.id === id);
                            return <Chip key={id} label={profile?.name || id} />;
                        })}
                    </Box>
                )}
            >
                {profiles.map((profile) => (
                    <MenuItem key={profile.id} value={profile.id}>
                        {profile.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}