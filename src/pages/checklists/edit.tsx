import { useState } from "react";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useDelete, useNavigation, useResourceParams } from "@refinedev/core";
import { Tag } from "../../types";
import { ChecklistForm } from "../../components/forms/ChecklistForm";

export const ChecklistEdit = () => {
    const form = useForm();
    const { refineCore: { onFinish }, handleSubmit } = form;
    
    const [isSaving, setIsSaving] = useState(false);
    const { mutate: deleteChecklist } = useDelete();
    const { list } = useNavigation();
    const { id: checklistId } = useResourceParams();

    const onSubmit = (formValues: any) => {
        setIsSaving(true);
        const payload = {
            tag_ids: (formValues.tags || []).map((tag: Tag) => tag.id),
            ...formValues,
        };
        console.log(payload);
        onFinish(payload).finally(() => {
            setIsSaving(false);
        });
    };

    const handleDelete = () => {
        if (checklistId) {
            deleteChecklist({ resource: "checklists", id: checklistId }, { onSuccess: () => list("checklists") });
        }
    };

    return (
        <Edit
            saveButtonProps={{
                onClick: handleSubmit(onSubmit),
                disabled: isSaving,
            }}
            deleteButtonProps={{
                onClick: handleDelete,
                disabled: isSaving,
            }}
        >
            <ChecklistForm form={form} checklistId={Number(checklistId)}/>
        </Edit>
    );
};