import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { Send, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import api, { errorMessage } from "../../lib/api";
import { formatDate, rupiah } from "../../lib/format";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";
import CopyLink from "../../components/CopyLink";

export default function StaffList() {
  const [staff, setStaff] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [invite, setInvite] = useState(null); // { person, link, emailSent }

  const load = useCallback(async () => {
    try {
      const { data } = await api.get("/admin/users");
      setStaff(data.data);
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resend = async (person) => {
    setBusyId(person.id);
    try {
      const { data } = await api.post(`/admin/users/${person.id}/invite`);
      setInvite({ person, link: data.setupLink, emailSent: data.emailSent });
      load();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <PageHeader title="Staff" description="Everyone who can clock in. Click a name to see their attendance.">
        <Link to="/register" className="btn-primary">
          <UserPlus size={16} aria-hidden="true" /> Add staff
        </Link>
      </PageHeader>

      {staff && staff.length === 0 ? (
        <EmptyState icon={Users} title="No staff yet">
          Add someone and they'll get an email to set their password.
        </EmptyState>
      ) : (
        <div className="panel overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-ink-soft">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">Name</th>
                <th scope="col" className="px-3 py-3 font-medium">Joined</th>
                <th scope="col" className="px-3 py-3 font-medium">Basic salary</th>
                <th scope="col" className="px-5 py-3 font-medium">Account</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {(staff ?? []).map((person) => (
                <tr key={person.id}>
                  <td className="px-5 py-3">
                    {person.invitePending ? (
                      <span className="font-semibold">{person.full_name}</span>
                    ) : (
                      <Link to={`/staff/${person.id}`} className="font-semibold hover:text-teal hover:underline">
                        {person.full_name}
                      </Link>
                    )}
                    <p className="text-xs text-ink-soft">{person.email}</p>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-ink-soft">{formatDate(person.join_date)}</td>
                  <td className="figures px-3 py-3 text-base whitespace-nowrap">{rupiah(person.basic_salary)}</td>
                  <td className="px-5 py-3">
                    {person.invitePending ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-amber-tint px-2.5 py-0.5 text-xs font-semibold text-amber">
                          Invite pending
                        </span>
                        <button className="btn-secondary btn-sm" disabled={busyId === person.id} onClick={() => resend(person)}>
                          <Send size={13} aria-hidden="true" /> New link
                        </button>
                      </div>
                    ) : (
                      <span className="rounded-full bg-teal-tint px-2.5 py-0.5 text-xs font-semibold text-teal">Active</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!invite} onClose={() => setInvite(null)} title="New setup link">
        {invite && (
          <>
            <p className="mb-4 text-sm text-ink-soft">
              {invite.emailSent
                ? `We emailed this to ${invite.person.email}. Any older link has stopped working.`
                : `The email couldn't be sent. Copy the link and send it to ${invite.person.full_name} yourself.`}
            </p>
            <CopyLink link={invite.link} />
          </>
        )}
      </Modal>
    </>
  );
}
