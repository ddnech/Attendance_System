import { useState } from "react";
import { Link, useParams } from "react-router";
import { ChevronLeft } from "lucide-react";
import { formatDate } from "../../lib/format";
import PageHeader from "../../components/PageHeader";
import AttendanceMonth from "../../components/AttendanceMonth";

export default function StaffDetail() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);

  return (
    <>
      <Link to="/staff" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-ink-soft hover:text-ink">
        <ChevronLeft size={16} aria-hidden="true" /> All staff
      </Link>
      <PageHeader
        title={person?.full_name || "Attendance"}
        description={person ? `${person.email}, joined ${formatDate(person.join_date, "D MMMM YYYY")}` : " "}
      />
      <AttendanceMonth key={id} endpoint={`/admin/users/${id}/attendance`} onLoaded={(data) => setPerson(data.user)} />
    </>
  );
}
