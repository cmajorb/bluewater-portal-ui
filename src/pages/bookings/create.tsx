// BookingCreate.tsx
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useFieldArray } from "react-hook-form";
import { useList, useCreate, useNavigation } from "@refinedev/core";
import { parseISO, eachDayOfInterval, format } from "date-fns";
import { BookingForm } from "../../components/BookingForm";

export const BookingCreate = () => {
  const { register, handleSubmit, control, saveButtonProps } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: "guests" });

  const { data: familyData } = useList({ resource: "families/me" });
  const { mutate: createBooking } = useCreate();
  const { list } = useNavigation();

  const family = familyData?.data?.[0];
  const familyMembers = family?.members || [];

  const onSubmit = (formValues: any) => {
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
        onSuccess: () => list("bookings"),
      }
    );
  };

  return (
    <Create
      saveButtonProps={{
        ...saveButtonProps,
        onClick: handleSubmit(onSubmit),
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
    </Create>
  );
};
