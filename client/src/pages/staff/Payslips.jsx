import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, ReceiptText } from "lucide-react";
import { toast } from "sonner";
import api, { errorMessage } from "../../lib/api";
import { MONTHS, rupiah } from "../../lib/format";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";

export default function Payslips() {
  const [year, setYear] = useState(dayjs().year());
  const [month, setMonth] = useState("");
  const [result, setResult] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get("/staff/payroll/history", { params: { year, month: month || undefined } });
      setResult(data);
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }, [year, month]);

  useEffect(() => {
    load();
  }, [load]);

  const slips = result?.data ?? [];
  const totalNet = slips.reduce((sum, s) => sum + s.amount, 0);

  return (
    <>
      <PageHeader
        title="Payslips"
        description="Payroll runs on the last day of each month. Absences and half days are taken off your basic salary."
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1">
          <button className="btn-secondary btn-sm" onClick={() => setYear((y) => y - 1)} aria-label="Previous year">
            <ChevronLeft size={16} />
          </button>
          <span className="figures min-w-16 text-center text-xl font-semibold">{year}</span>
          <button
            className="btn-secondary btn-sm"
            onClick={() => setYear((y) => y + 1)}
            disabled={year >= dayjs().year()}
            aria-label="Next year"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <select value={month} onChange={(e) => setMonth(e.target.value)} aria-label="Month" className="input sm:w-48">
          <option value="">Whole year</option>
          {MONTHS.map((name, i) => (
            <option key={name} value={i + 1}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {result && slips.length === 0 ? (
        <EmptyState icon={ReceiptText} title="No payslips here">
          {year === dayjs().year() && !month
            ? "Your first payslip appears after payroll runs at the end of the month."
            : "There's no payroll for this period."}
        </EmptyState>
      ) : (
        <>
          {slips.length > 1 && (
            <p className="mb-4 text-sm text-ink-soft">
              {slips.length} payslips, <span className="font-semibold text-ink">{rupiah(totalNet)}</span> paid in total.
            </p>
          )}
          <ul className="grid gap-4 sm:grid-cols-2">
            {slips.map((slip) => {
              const gross = slip.amount + slip.deductions;
              const paidShare = gross ? (slip.amount / gross) * 100 : 100;
              return (
                <li key={slip.id} className="panel p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="font-semibold">{dayjs(slip.date).format("MMMM YYYY")}</h2>
                    <span className="text-xs text-ink-soft">Paid {dayjs(slip.date).format("D MMM")}</span>
                  </div>
                  <p className="figures mt-3 text-4xl font-semibold">{rupiah(slip.amount)}</p>
                  <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-red-tint" aria-hidden="true">
                    <div className="bg-teal" style={{ width: `${paidShare}%` }} />
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-ink-soft">Basic salary</dt>
                      <dd className="figures text-lg">{rupiah(result.basicSalary)}</dd>
                    </div>
                    <div>
                      <dt className="text-ink-soft">Deductions</dt>
                      <dd className={`figures text-lg ${slip.deductions ? "text-red" : ""}`}>
                        {slip.deductions ? `- ${rupiah(slip.deductions)}` : rupiah(0)}
                      </dd>
                    </div>
                  </dl>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}
