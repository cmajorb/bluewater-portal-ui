import { useState } from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    Card,
    CardActionArea,
    CardMedia,
} from "@mui/material";
import { useList, useCreate } from "@refinedev/core";

interface PictureSelectorProps {
    value: number[];
    onChange: (value: number[]) => void;
}

export default function PictureSelector({ value, onChange }: PictureSelectorProps) {
    const [open, setOpen] = useState(false);

    const { data } = useList({
        resource: "pictures",
    });

    const pictures = data?.data || [];

    const { mutate: createPicture } = useCreate();

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);

        createPicture(
            { resource: "pictures", values: formData },
            { onSuccess: () => setOpen(false) }
        );
    };

    const toggleSelect = (id: number) => {
        if (value.includes(id)) {
            onChange(value.filter((v) => v !== id));
        } else {
            onChange([...value, id]);
        }
    };

    return (
        value && (<>
            <Button variant="outlined" onClick={() => setOpen(true)}>
                {value.length > 0 ? `${value.length} image(s)` : "Select Images"}
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
                <DialogTitle>Select or Upload Pictures</DialogTitle>
                <DialogContent>
                    <Button component="label" variant="contained">
                        Upload New
                        <input type="file" hidden onChange={handleUpload} />
                    </Button>

                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        {pictures.map((pic: any) => (
                            <Grid item xs={3} key={pic.id}>
                                <Card
                                    sx={{
                                        border: value.includes(pic.id)
                                            ? "2px solid blue"
                                            : "1px solid transparent",
                                    }}
                                >
                                    <CardActionArea onClick={() => toggleSelect(pic.id)}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={pic.url}
                                            alt=""
                                        />
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
            </Dialog>
        </>)
    );
}
