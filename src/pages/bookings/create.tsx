// BookingCreate.tsx
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useFieldArray } from "react-hook-form";
import { useList, useCreate, useNavigation } from "@refinedev/core";
import { parseISO, eachDayOfInterval, format } from "date-fns";
import { BookingForm } from "../../components/BookingForm";
import { useState } from "react";

export const BookingCreate = () => {
  const { register, handleSubmit, control, saveButtonProps } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: "guests" });
  const [isSaving, setIsSaving] = useState(false);

  const { data: familyData } = useList({ resource: "families/me" });
  const { data: profilesData } = useList({ resource: "profiles" });
  const { mutate: createBooking } = useCreate();
  const { list } = useNavigation();

  const family = familyData?.data?.[0];
  const familyMembers = family?.members || [];
  const allProfiles = profilesData?.data || [];


  const onSubmit = (formValues: any) => {
    setIsSaving(true);
    const start = parseISO(formValues.start_date);
    const end = parseISO(formValues.end_date);
    const days = eachDayOfInterval({ start, end });

    const meals = days.map((day) => ({
      date: format(day, "yyyy-MM-dd"),
      has_breakfast: true,
      has_lunch: true,
      has_dinner: true,
    }));

    const guests = formValues.guests.map((guest: any) => ({
      profile_id: Number(guest.profile_id),
      meals,
    }));

    createBooking(
      {
        resource: "bookings",
        values: {
          ...formValues,
          guests,
        },
      },
      {
        onSuccess: () => {
          setIsSaving(false);
          list("bookings");
        },
        onError: () => {
          setIsSaving(false);
        },
      }
    );
  };

  return (
    <Create
      saveButtonProps={{
        ...saveButtonProps,
        onClick: handleSubmit(onSubmit),
        disabled: isSaving,
      }}
    >
      <BookingForm
        control={control}
        register={register}
        guestFields={fields}
        familyMembers={familyMembers}
        allProfiles={allProfiles}
        appendGuest={(guest) => append(guest)}
        removeGuest={remove}
      />
    </Create>
  );
};
