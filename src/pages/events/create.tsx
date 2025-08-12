import { useState } from "react";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { EventForm } from "../../components/forms/EventForm";
import { Family } from "../../types";

export const EventCreate = () => {
     const form = useForm({
        refineCoreProps: { action: "create" },
    });
    const { refineCore: { onFinish }, handleSubmit } = form;

    const [isSaving, setIsSaving] = useState(false);

    const onSubmit = (formValues: any) => {
        setIsSaving(true);
        const payload = {
            ...formValues,
            invited_family_ids: (formValues.invited_families || []).map((family: Family) => family.id),
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
            <EventForm form={form} />
        </Create>
    );
};