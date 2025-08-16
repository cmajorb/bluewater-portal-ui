import {
    Box,
    Chip,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    SelectChangeEvent, // Import SelectChangeEvent for proper typing
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCreate, useList } from "@refinedev/core";
import { useState } from "react";
import { Tag } from "../../types";

// The component now expects the full `Tag` objects for its value and onChange props.
export function TagSelector({ value, onChange, addNewDisabled }: {
    value: Tag[];
    onChange: (tags: Tag[]) => void;
    addNewDisabled?: boolean;
}) {
    // 1. Use `isLoading` for a correct loading state.
    const { data: tagsData, isLoading, refetch } = useList({ resource: "tags" });
    const allTags = (tagsData?.data || []) as Tag[];
    const { mutate: createTag } = useCreate();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newTagData, setNewTagData] = useState({ name: "", description: "" });

    // 2. Convert the `Tag[]` value from the form into `number[]` for the Select.
    const selectedTagIds = (value || []).map(tag => tag.id);

    // 3. Create a dedicated handler to manage data transformation.
    const handleSelectChange = (event: SelectChangeEvent<number[]>) => {
        const selectedIds = event.target.value as number[];
        // Convert the selected IDs back into full Tag objects.
        const selectedTags = allTags.filter(tag => selectedIds.includes(tag.id));
        // Call the form's onChange with the data structure it expects.
        onChange(selectedTags);
    };

    // Use the `isLoading` flag from the hook.
    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <Stack direction="row" spacing={1}>
            <FormControl fullWidth>
                <InputLabel>Tags</InputLabel>
                <Select
                    multiple
                    value={selectedTagIds} // Use the derived array of IDs
                    onChange={handleSelectChange} // Use the new, correct handler
                    renderValue={(selected) => (
                        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                            {/* `selected` is the array of IDs */}
                            {selected.map((id) => {
                                // Find the full tag object from the `value` prop to get the name
                                const tag = value.find((t) => t.id === id);
                                return <Chip key={id} label={tag?.name || id} />;
                            })}
                        </Box>
                    )}
                >
                    {allTags.map((tag) => (
                        <MenuItem key={tag.id} value={tag.id}>
                            {tag.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {!addNewDisabled && (
                <IconButton
                    onClick={() => setIsDialogOpen(true)}
                    sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        padding: "12px",
                    }}
                    color="primary"
                >
                    <AddIcon />
                </IconButton>
            )}

            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth>
                <DialogTitle>Create New Tag</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            label="Name"
                            fullWidth
                            value={newTagData.name}
                            onChange={(e) => setNewTagData({ ...newTagData, name: e.target.value })}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            minRows={2}
                            value={newTagData.description}
                            onChange={(e) => setNewTagData({ ...newTagData, description: e.target.value })}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={() => {
                            createTag(
                                {
                                    resource: "tags",
                                    values: newTagData,
                                },
                                {
                                    onSuccess: () => {
                                        setNewTagData({ name: "", description: "" });
                                        setIsDialogOpen(false);
                                        refetch();
                                    },
                                }
                            );
                        }}
                        variant="contained"
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}