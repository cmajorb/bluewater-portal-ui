import {
    TextField,
    Stack,
    Card,
    CardContent,
    IconButton,
    Button,
    FormControlLabel,
    Checkbox
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { Controller, FieldValues, useFieldArray } from "react-hook-form";
import { UseFormReturnType } from "@refinedev/react-hook-form";
import { BaseRecord, HttpError } from "@refinedev/core";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PictureSelector from "../selectors/PictureSelector";
import { TagSelector } from "../selectors/TagSelector";
import { ChecklistItem } from "../../types";

interface ChecklistFormProps {
    form: UseFormReturnType<BaseRecord, HttpError, FieldValues>;
    checklistId?: number; // pass the current checklist id if editing
}

interface SortableItemProps {
    id: string;
    index: number;
    remove: (index: number) => void;
    register: any;
    control: any;
}

const SortableItem = ({ id, index, remove, register, control }: SortableItemProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        display: "flex",
        gap: "8px",
        alignItems: "center",
        // background: "#fafafa",
        padding: "8px",
        borderRadius: "4px"
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <span style={{ cursor: "grab" }}>☰</span>

            <Controller
                control={control}
                name={`items.${index}.required`}
                render={({ field }) => (
                    <FormControlLabel
                        control={<Checkbox {...field} checked={field.value} />}
                        label="Required"
                    />
                )}
            />

            <TextField
                label="Text"
                {...register(`items.${index}.text` as const, { required: true })}
                slotProps={{ inputLabel: { shrink: true } }}
            />

            {/* hidden fields */}
            <input type="hidden" {...register(`items.${index}.order`)} />
            <input type="hidden" {...register(`items.${index}.checklist_id`)} />

            <Controller
                control={control}
                name={`items.${index}.picture_ids`}
                render={({ field }) => (
                    <PictureSelector
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />

            <IconButton onClick={() => remove(index)}>
                <Delete />
            </IconButton>
        </div>
    );
};

export const ChecklistForm = ({ form, checklistId }: ChecklistFormProps) => {
    const { register, control, watch, setValue } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = fields.findIndex((f) => f.id === active.id);
            const newIndex = fields.findIndex((f) => f.id === over?.id);
            const items = watch("items") as ChecklistItem[];

            const newItems = arrayMove<ChecklistItem>(items, oldIndex, newIndex).map(
                (item, i) => ({
                    ...item,
                    order: i,
                })
            );
            setValue("items", newItems);
        }
        console.log(form.getValues("items"));
    };

    return (
        <Card>
            <CardContent>
                <Stack spacing={2}>
                    <TextField
                        label="Title"
                        {...register("title", { required: true })}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />

                    <Controller
                        control={control}
                        name="tags"
                        defaultValue={[]}
                        render={({ field }) => (
                            <TagSelector
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={fields.map((f) => f.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <Stack spacing={1}>
                                {fields.map((item, index) => (
                                    <SortableItem
                                        key={item.id}
                                        id={item.id}
                                        index={index}
                                        remove={remove}
                                        register={register}
                                        control={control}
                                    />
                                ))}
                            </Stack>
                        </SortableContext>
                    </DndContext>

                    <Button
                        type="button"
                        variant="outlined"
                        onClick={() =>
                            append({
                                text: "",
                                order: fields.length,
                                checklist_id: checklistId || 0,
                                picture_ids: [],
                                required: true,
                            })
                        }
                    >
                        Add Item
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
};
