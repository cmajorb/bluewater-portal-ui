import { useState } from "react";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { TaskForm } from "../../components/forms/TaskForm";
import { Profile, Tag } from "../../types";

export const TaskCreate = () => {
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
            profile_ids: (formValues.profiles || []).map((profile: Profile) => profile.id),
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
            <TaskForm form={form} />
        </Create>
    );
};
