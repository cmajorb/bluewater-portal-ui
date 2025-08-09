import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  Typography,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  ImageList,
  ImageListItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import { useState } from "react";
import { Checklist} from "../types";

export const ChecklistAccordion = ({
  title,
  checklist,
}: {
  title: string;
  checklist: Checklist;
}) => {
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>(
    () =>
      checklist.items.reduce((acc, item) => {
        acc[item.id] = false;
        return acc;
      }, {} as Record<string, boolean>)
  );

  const [imageDialog, setImageDialog] = useState<{
    open: boolean;
    images: string[];
    label: string;
  }>({ open: false, images: [], label: "" });

  const total = checklist.items.length;
  const checked = checklist.items.filter((item) => checklistState[item.id]).length;

  const handleToggle = (key: number) => {
    setChecklistState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const openImageDialog = (images: string[], label: string) => {
    setImageDialog({ open: true, images, label });
  };

  const closeImageDialog = () => {
    setImageDialog({ ...imageDialog, open: false });
  };

  return (
    <>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">
            {title} ({checked}/{total})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={1}>
            {checklist.items.map((item) => (
              <Stack
                key={item.id}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!checklistState[item.id]}
                      onChange={() => handleToggle(item.id)}
                    />
                  }
                  label={item.text}
                />
                {item.pictures && item.pictures?.length > 0 && (
                  <IconButton
                    onClick={() => openImageDialog(item.pictures!, item.text)}
                    size="small"
                    aria-label="View Images"
                  >
                    <PhotoLibraryIcon />
                  </IconButton>
                )}
              </Stack>
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Dialog open={imageDialog.open} onClose={closeImageDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{imageDialog.label}</DialogTitle>
        <DialogContent>
          <ImageList cols={1}>
            {imageDialog.images.map((src, index) => (
              <ImageListItem key={index}>
                <img
                  src={src}
                  alt={`Checklist Item ${index + 1}`}
                  style={{ width: "100%", borderRadius: 8 }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </DialogContent>
      </Dialog>
    </>
  );
};
