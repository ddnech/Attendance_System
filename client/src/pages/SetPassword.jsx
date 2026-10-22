import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import dayjs from "dayjs";
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";
import PasswordInput from "../components/PasswordInput";
import api, { errorMessage } from "../lib/api";

// Same rule as the API.
const PASSWORD_RULE = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const schema = z
  .object({
    full_name: z.string().trim().min(1, "Enter your full name.").max(100, "That name is too long."),
    birth_date: z.string().refine((v) => !v || !dayjs(v).isAfter(dayjs(), "day"), "Birth date can't be in the future."),
    password: z.string().regex(PASSWORD_RULE, "At least 8 characters, with a capital letter, a number and a symbol."),
    confirm_password: z.string(),
  })
  .refine((v) => v.password === v.confirm_password, { message: "Passwords don't match.", path: ["confirm_password"] });

export default function SetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [invite, setInvite] = useState(null);
  const [problem, setProblem] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { full_name: "", birth_date: "", password: "", confirm_password: "" },
  });

  useEffect(() => {
    api
      .get(`/auth/invite/${token}`)
      .then(({ data }) => {
        setInvite(data.data);
        reset({ full_name: data.data.full_name, birth_date: data.data.birth_date || "", password: "", confirm_password: "" });
      })
      .catch((error) => setProblem(errorMessage(error)));
  }, [token, reset]);

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post("/auth/set-pass", { ...values, token });
      toast.success(data.message);
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold tracking-tight">Set up your account</h1>

      {problem ? (
        <>
          <p className="mt-6 rounded-md bg-red-tint px-3 py-2 text-sm text-red" role="alert">
            {problem}
          </p>
          <Link to="/" className="btn-secondary mt-6">
            Go to login
          </Link>
        </>
      ) : !invite ? (
        <p className="mt-4 text-ink-soft">Checking your link…</p>
      ) : (
        <>
          <p className="mt-2 text-ink-soft">
            Choose a password for <span className="font-semibold text-ink">{invite.email}</span>. Check your details while you're here.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
            <Field label="Full name" htmlFor="full_name" error={errors.full_name?.message}>
              <input id="full_name" className="input" autoComplete="name" aria-invalid={!!errors.full_name} {...register("full_name")} />
            </Field>
            <Field label="Birth date" htmlFor="birth_date" error={errors.birth_date?.message}>
              <input id="birth_date" type="date" className="input" aria-invalid={!!errors.birth_date} {...register("birth_date")} />
            </Field>
            <Field
              label="Password"
              htmlFor="password"
              error={errors.password?.message}
              hint="At least 8 characters, with a capital letter, a number and a symbol."
            >
              <PasswordInput id="password" autoComplete="new-password" autoFocus aria-invalid={!!errors.password} {...register("password")} />
            </Field>
            <Field label="Confirm password" htmlFor="confirm_password" error={errors.confirm_password?.message}>
              <PasswordInput
                id="confirm_password"
                autoComplete="new-password"
                aria-invalid={!!errors.confirm_password}
                {...register("confirm_password")}
              />
            </Field>
            <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save and continue"}
            </button>
          </form>
        </>
      )}
    </AuthLayout>
  );
}
