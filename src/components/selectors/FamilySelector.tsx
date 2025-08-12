import {
    Box,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import { MinimalProfile } from "../../types";

interface FamilySelectorProps {
    value: MinimalProfile[];
    onChange: (families: MinimalProfile[]) => void;
    families: MinimalProfile[];
}

export function FamilySelector({ value, onChange, families: families }: FamilySelectorProps) {
    const selectedIds = (value || []).map((family) => family.id);

    const handleSelectChange = (event: SelectChangeEvent<number[]>) => {
        const selectedIds = event.target.value as number[];
        const selectedFamilies = families.filter((f) => selectedIds.includes(f.id));
        onChange(selectedFamilies);
    };

    return (
        <FormControl fullWidth>
            <InputLabel>Families</InputLabel>
            <Select
                multiple
                value={selectedIds}
                onChange={handleSelectChange}
                renderValue={(selected) => (
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        {selected.map((id) => {
                            const family = value.find((f) => f.id === id);
                            return <Chip key={id} label={family?.name || id} />;
                        })}
                    </Box>
                )}
            >
                {families.map((family) => (
                    <MenuItem key={family.id} value={family.id}>
                        {family.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}