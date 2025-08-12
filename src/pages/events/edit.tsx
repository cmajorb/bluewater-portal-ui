import { useState } from "react";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useDelete, useNavigation, useResourceParams } from "@refinedev/core";
import { EventForm } from "../../components/forms/EventForm";
import { Family } from "../../types";

export const EventEdit = () => {
    const form = useForm();
    const { refineCore: { onFinish }, handleSubmit } = form;
    
    const [isSaving, setIsSaving] = useState(false);
    const { mutate: deleteEvent } = useDelete();
    const { list } = useNavigation();
    const { id: eventId } = useResourceParams();

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

    const handleDelete = () => {
        if (eventId) {
            deleteEvent({ resource: "events", id: eventId }, { onSuccess: () => list("events") });
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
            <EventForm form={form} />
        </Edit>
    );
};