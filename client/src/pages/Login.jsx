import { useState } from "react";
import { Navigate, useLocation, useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";
import PasswordInput from "../components/PasswordInput";
import { useAuth } from "../auth/AuthContext";
import { errorMessage } from "../lib/api";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

// Created by the seeders. Handy for trying the app quickly.
const DEMO = [
  { label: "Admin", email: "admin@example.com", note: "sees the whole team" },
  { label: "Staff", email: "staff1@example.com", note: "clocks in and out" },
];
const DEMO_PASSWORD = "Password12!";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  if (user) return <Navigate to="/home" replace />;

  const signIn = async ({ email, password }) => {
    setFormError("");
    setBusy(true);
    try {
      const loggedIn = await login(email, password);
      toast.success(`Welcome back, ${loggedIn.full_name.split(" ")[0]}.`);
      navigate(location.state?.from || "/home", { replace: true });
    } catch (error) {
      setFormError(errorMessage(error, "Wrong email or password."));
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold tracking-tight">Log in</h1>
      <p className="mt-2 text-ink-soft">Use the email your admin registered you with.</p>

      {params.get("expired") && !formError && (
        <p className="mt-6 rounded-md bg-amber-tint px-3 py-2 text-sm text-amber">Your session expired. Please log in again.</p>
      )}
      {formError && (
        <p className="mt-6 rounded-md bg-red-tint px-3 py-2 text-sm text-red" role="alert">
          {formError}
        </p>
      )}

      <form onSubmit={handleSubmit(signIn)} noValidate className="mt-6 space-y-5">
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <input id="email" type="email" className="input" autoComplete="email" autoFocus aria-invalid={!!errors.email} {...register("email")} />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password?.message}>
          <PasswordInput id="password" autoComplete="current-password" aria-invalid={!!errors.password} {...register("password")} />
        </Field>
        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink-soft">
        No account? Your admin adds you, and you'll get an email to set your password.
      </p>

      <section className="mt-10 border-t border-line pt-6">
        <h2 className="text-sm font-semibold">Just testing?</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Log in with a demo account. The password for both is <code className="font-semibold text-ink">{DEMO_PASSWORD}</code>.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {DEMO.map((demo) => (
            <button
              key={demo.email}
              type="button"
              disabled={busy}
              onClick={() => signIn({ email: demo.email, password: DEMO_PASSWORD })}
              className="panel px-3 py-2.5 text-left transition-colors hover:border-teal disabled:opacity-60"
            >
              <span className="block text-sm font-semibold">{demo.label}</span>
              <span className="block text-xs text-ink-soft">{demo.note}</span>
            </button>
          ))}
        </div>
      </section>
    </AuthLayout>
  );
}
