// BookingEdit.tsx
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useFieldArray } from "react-hook-form";
import { useList, useUpdate, useDelete, useNavigation, useResourceParams } from "@refinedev/core";
import { parseISO, eachDayOfInterval, format } from "date-fns";
import { BookingForm } from "../../components/BookingForm";

export const BookingEdit = () => {
  const { saveButtonProps, register, handleSubmit, control } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: "guests" });

  const { data: familyData } = useList({ resource: "families/me" });
  const { mutate: updateBooking } = useUpdate();
  const { mutate: deleteBooking } = useDelete();
  const { list } = useNavigation();
  const { id: bookingId } = useResourceParams();

  const family = familyData?.data?.[0];
  const familyMembers = family?.members || [];

  const onSubmit = (formValues: any) => {
    const start = parseISO(formValues.start_date);
    const end = parseISO(formValues.end_date);
    const days = eachDayOfInterval({ start, end });

    const guests = formValues.guests.map((guest: any) => {
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
      values: { ...formValues, guests },
    },
      {
        onSuccess: () => list("bookings"),
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
      }}
      deleteButtonProps={{
        onClick: handleSubmit(handleDelete),
      }}
    >
      <BookingForm
        control={control}
        register={register}
        guestFields={fields}
        familyMembers={familyMembers}
        appendGuest={(guest) => append(guest)}
        removeGuest={remove}
      />
    </Edit>
  );
};
