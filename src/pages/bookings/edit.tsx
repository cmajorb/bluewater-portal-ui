// BookingEdit.tsx
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useFieldArray } from "react-hook-form";
import { useList, useUpdate, useDelete, useNavigation, useResourceParams } from "@refinedev/core";
import { parseISO, eachDayOfInterval, format } from "date-fns";
import { BookingForm } from "../../components/BookingForm";
import { useState } from "react";

export const BookingEdit = () => {
  const { saveButtonProps, register, handleSubmit, control } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: "guests" });
  const [isSaving, setIsSaving] = useState(false);

  const { data: familyData } = useList({ resource: "families/me" });
  const { data: profilesData } = useList({ resource: "profiles" });
  const { mutate: updateBooking } = useUpdate();
  const { mutate: deleteBooking } = useDelete();
  const { list } = useNavigation();
  const { id: bookingId } = useResourceParams();

  const family = familyData?.data?.[0];
  const familyMembers = family?.members || [];
  const allProfiles = profilesData?.data || [];

  const onSubmit = (formValues: any) => {
    setIsSaving(true);
    const sanitizedValues = {
    ...formValues,
    arrival_time: formValues.arrival_time === "" ? null : formValues.arrival_time,
    departure_time: formValues.departure_time === "" ? null : formValues.departure_time,
  };

    const start = parseISO(sanitizedValues.start_date);
    const end = parseISO(sanitizedValues.end_date);
    const days = eachDayOfInterval({ start, end });

    const guests = sanitizedValues.guests.map((guest: any) => {
      const completeMeals = days.map((day) => {
        const dateStr = format(day, "yyyy-MM-dd");
        const existing = guest.meals?.find((m: any) => m.date === dateStr);
        return (
          existing || {
            date: dateStr,
            has_breakfast: true,
            has_lunch: true,
            has_dinner: true,
          }
        );
      });

      return {
        profile_id: Number(guest.profile_id),
        meals: completeMeals,
      };
    });

    updateBooking({
      resource: "bookings",
      id: bookingId,
      values: { ...sanitizedValues, guests },
    },
      {
        onSuccess: () => {
          setIsSaving(false);
          list("bookings");
        },
        onError: () => {
          setIsSaving(false);
        },
      });
  };

  const handleDelete = () => {
    if (bookingId) {
      deleteBooking(
        { resource: "bookings", id: bookingId },
        { onSuccess: () => list("bookings") }
      );
    }
  };

  return (
    <Edit
      saveButtonProps={{
        ...saveButtonProps,
        onClick: handleSubmit(onSubmit),
        disabled: isSaving,
      }}
      deleteButtonProps={{
        onClick: handleSubmit(handleDelete),
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
    </Edit>
  );
};
