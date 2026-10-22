import { useEffect, useState } from "react";
import { toast } from "sonner";
import api, { errorMessage } from "../lib/api";
import { formatDate, rupiah } from "../lib/format";
import PageHeader from "../components/PageHeader";

function Detail({ label, children }) {
  return (
    <div className="grid gap-1 py-3.5 sm:grid-cols-[11rem_1fr]">
      <dt className="text-sm text-ink-soft">{label}</dt>
      <dd className="font-medium break-words">{children}</dd>
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api
      .get("/auth/me")
      .then(({ data }) => setProfile(data.data))
      .catch((error) => toast.error(errorMessage(error)));
  }, []);

  if (!profile) {
    return (
      <>
        <PageHeader title="My profile" />
        <div className="panel h-64 animate-pulse" />
      </>
    );
  }

  return (
    <>
      <PageHeader title={profile.full_name} description={profile.role === "admin" ? "Admin" : "Staff"} />
      <section className="panel max-w-2xl px-6 py-3">
        <dl className="divide-y divide-line">
          <Detail label="Email">{profile.email}</Detail>
          <Detail label="Birth date">{formatDate(profile.birth_date, "D MMMM YYYY")}</Detail>
          <Detail label="Joined">{formatDate(profile.join_date, "D MMMM YYYY")}</Detail>
          <Detail label="Basic salary">
            <span className="figures text-lg">{rupiah(profile.Salary?.basic_salary)}</span>
            <span className="text-sm font-normal text-ink-soft"> per month</span>
          </Detail>
        </dl>
      </section>
      <p className="mt-4 max-w-2xl text-sm text-ink-soft">Something wrong here? Ask your admin to update it.</p>
    </>
  );
}
