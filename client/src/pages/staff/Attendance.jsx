import PageHeader from "../../components/PageHeader";
import AttendanceMonth from "../../components/AttendanceMonth";

export default function Attendance() {
  return (
    <>
      <PageHeader title="My attendance" description="Every workday of the month, with your clock-in and clock-out times." />
      <AttendanceMonth endpoint="/staff/attendance/history" />
    </>
  );
}
