import { useState } from "react";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { Tag } from "../../types";
import { ChecklistForm } from "../../components/forms/ChecklistForm";

export const ChecklistCreate = () => {
     const form = useForm({
        refineCoreProps: { action: "create" },
    });
    const { refineCore: { onFinish }, handleSubmit } = form;

    const [isSaving, setIsSaving] = useState(false);

    const onSubmit = (formValues: any) => {
        setIsSaving(true);
        const payload = {
            ...formValues,
            tag_ids: (formValues.tags || []).map((tag: Tag) => tag.id),
        };
        onFinish(payload).finally(() => {
            setIsSaving(false);
        });
    };

    return (
        <Create
            saveButtonProps={{
                onClick: handleSubmit(onSubmit),
                disabled: isSaving,
            }}
        >
            <ChecklistForm form={form} />
        </Create>
    );
};