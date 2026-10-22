import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** A read-only link with a copy button. */
export default function CopyLink({ link }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (e.g. plain http on another host). The text is still selectable.
    }
  };

  return (
    <div className="flex gap-2">
      <input readOnly value={link} onFocus={(e) => e.target.select()} className="input text-xs" aria-label="Setup link" />
      <button type="button" className="btn-secondary shrink-0" onClick={copy}>
        {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
