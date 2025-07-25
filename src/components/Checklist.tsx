import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  Typography,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

export const ChecklistAccordion = ({
  title,
  checklist,
}: {
  title: string;
  checklist: { label: string; key: string }[];
}) => {
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>(
    () =>
      checklist.reduce((acc, item) => {
        acc[item.key] = false;
        return acc;
      }, {} as Record<string, boolean>)
  );

  const total = checklist.length;
  const checked = checklist.filter((item) => checklistState[item.key]).length;

  const handleToggle = (key: string) => {
    setChecklistState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight="bold">
          {title} ({checked}/{total})
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={1}>
          {checklist.map((item) => (
            <FormControlLabel
              key={item.key}
              control={
                <Checkbox
                  checked={!!checklistState[item.key]}
                  onChange={() => handleToggle(item.key)}
                />
              }
              label={item.label}
            />
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
