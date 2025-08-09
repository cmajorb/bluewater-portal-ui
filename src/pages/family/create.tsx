import { useState } from "react";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { FamilyForm } from "../../components/forms/FamilyForm";
import { Member } from "../../types";

export const FamilyCreate = () => {
     const form = useForm({
        refineCoreProps: { action: "create" },
    });
    const { refineCore: { onFinish }, handleSubmit } = form;

    const [isSaving, setIsSaving] = useState(false);

    const onSubmit = (formValues: any) => {
        setIsSaving(true);
        const payload = {
            ...formValues,
            head_ids: formValues.members.filter((m: Member) => m.is_head).map((m: Member) => m.profile.id),
            child_ids: formValues.members.filter((m: Member) => !m.is_head).map((m: Member) => m.profile.id),
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
            <FamilyForm form={form} />
        </Create>
    );
};