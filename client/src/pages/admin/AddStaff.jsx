import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dayjs from "dayjs";
import { toast } from "sonner";
import api, { errorMessage } from "../../lib/api";
import PageHeader from "../../components/PageHeader";
import Field from "../../components/Field";
import CopyLink from "../../components/CopyLink";

const notFuture = (v) => !dayjs(v).isAfter(dayjs(), "day");

const schema = z.object({
  full_name: z.string().trim().min(1, "Enter their full name.").max(100, "That name is too long."),
  email: z.string().trim().email("Enter a valid email address."),
  birth_date: z
    .string()
    .min(1, "Enter their birth date.")
    .refine(notFuture, "Birth date can't be in the future."),
  join_date: z
    .string()
    .min(1, "Enter the day they joined.")
    .refine(notFuture, "Join date can't be in the future."),
  salary: z.coerce.number().int("Use a whole number.").min(1, "Enter their monthly salary.").max(1_000_000_000, "That's more than we can store."),
});

export default function AddStaff() {
  const [added, setAdded] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { full_name: "", email: "", birth_date: "", join_date: dayjs().format("YYYY-MM-DD"), salary: "" },
  });

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post("/admin/register", values);
      setAdded(data);
      toast.success(`${data.data.full_name} was added.`);
      reset();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  if (added) {
    return (
      <>
        <PageHeader title="Staff member added" />
        <section className="panel max-w-xl p-6 sm:p-8">
          <p>{added.message}</p>
          <p className="mt-4 mb-2 text-sm text-ink-soft">
            Their setup link{added.emailSent ? ", in case they can't find the email" : ""}:
          </p>
          <CopyLink link={added.setupLink} />
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="btn-primary" onClick={() => setAdded(null)}>
              Add someone else
            </button>
            <Link to="/staff" className="btn-secondary">
              Back to staff
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Add staff"
        description="They'll get an email with a link to choose their password. Until then they show up as invite pending."
      />
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="panel grid max-w-2xl gap-5 p-6 sm:grid-cols-2 sm:p-8">
        <Field label="Full name" htmlFor="full_name" error={errors.full_name?.message} className="sm:col-span-2">
          <input id="full_name" className="input" aria-invalid={!!errors.full_name} {...register("full_name")} />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email?.message} className="sm:col-span-2">
          <input id="email" type="email" className="input" aria-invalid={!!errors.email} {...register("email")} />
        </Field>
        <Field label="Birth date" htmlFor="birth_date" error={errors.birth_date?.message}>
          <input id="birth_date" type="date" className="input" aria-invalid={!!errors.birth_date} {...register("birth_date")} />
        </Field>
        <Field label="Join date" htmlFor="join_date" error={errors.join_date?.message}>
          <input id="join_date" type="date" className="input" aria-invalid={!!errors.join_date} {...register("join_date")} />
        </Field>
        <Field
          label="Monthly basic salary"
          htmlFor="salary"
          error={errors.salary?.message}
          hint="In rupiah, without dots. For example 6500000."
          className="sm:col-span-2"
        >
          <input id="salary" type="number" inputMode="numeric" min="1" className="input" aria-invalid={!!errors.salary} {...register("salary")} />
        </Field>
        <div className="sm:col-span-2">
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Adding…" : "Add staff member"}
          </button>
        </div>
      </form>
    </>
  );
}
