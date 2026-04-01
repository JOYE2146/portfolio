import { CONTACT_PROFILE, isEmailJsConfigured } from "@/data/contact-profile";
import { cn } from "@/utils/cn";
import emailjs from "@emailjs/browser";
import { useCallback, useId, useState, type FormEvent } from "react";

const inputClass = cn(
  "w-full rounded-lg border border-border bg-elevated/80 px-3 py-2.5 text-sm text-foreground placeholder:text-muted",
  "focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/25"
);

function mailtoFallback(body: string, subject: string) {
  const params = new URLSearchParams({
    subject: subject || `Message via portfolio from ${CONTACT_PROFILE.fullName}'s site`,
    body,
  });
  window.location.href = `mailto:${CONTACT_PROFILE.email}?${params.toString()}`;
}

export function ContactForm() {
  const formId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const emailJsReady = isEmailJsConfigured();

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (hp.trim()) return;
      setErrorMsg("");
      const trimmed = message.trim();
      if (!name.trim() || !email.trim() || !trimmed) {
        setErrorMsg("Please fill in your name, email, and message.");
        return;
      }

      const mailBody = `From: ${name.trim()} <${email.trim()}>\n\n${trimmed}`;

      if (emailJsReady) {
        setStatus("sending");
        try {
          await emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID!,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID!,
            {
              from_name: name.trim(),
              from_email: email.trim(),
              subject: subject.trim() || "Portfolio contact",
              message: trimmed,
              reply_to: email.trim(),
            },
            { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY! }
          );
          setStatus("sent");
          setName("");
          setEmail("");
          setSubject("");
          setMessage("");
        } catch (err) {
          setStatus("error");
          setErrorMsg(err instanceof Error ? err.message : "Could not send. Try email or Telegram.");
        }
        return;
      }

      mailtoFallback(mailBody, subject.trim());
      setStatus("sent");
    },
    [email, emailJsReady, hp, message, name, subject]
  );

  return (
    <form
      className="space-y-4"
      onSubmit={onSubmit}
      noValidate
      aria-describedby={errorMsg ? `${formId}-err` : undefined}
    >
      <input
        type="text"
        name="company"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />

      <div>
        <label htmlFor={`${formId}-name`} className="mb-1 block text-sm font-medium text-foreground">
          Name
        </label>
        <input
          id={`${formId}-name`}
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          autoComplete="name"
        />
      </div>
      <div>
        <label htmlFor={`${formId}-email`} className="mb-1 block text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          autoComplete="email"
        />
      </div>
      <div>
        <label htmlFor={`${formId}-sub`} className="mb-1 block text-sm font-medium text-foreground">
          Subject <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id={`${formId}-sub`}
          name="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor={`${formId}-msg`} className="mb-1 block text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id={`${formId}-msg`}
          name="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={cn(inputClass, "min-h-[120px] resize-y")}
        />
      </div>

      {errorMsg ? (
        <p id={`${formId}-err`} className="text-sm text-red-600 dark:text-red-400" role="alert">
          {errorMsg}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className={cn(
            "inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm",
            "hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
            "disabled:pointer-events-none disabled:opacity-60 dark:text-zinc-950"
          )}
        >
          {status === "sending" ? "Sending…" : emailJsReady ? "Send message" : "Open in email app"}
        </button>
        {status === "sent" ? (
          <span className="text-sm font-medium text-accent" role="status">
            {emailJsReady ? "Sent—thank you!" : "Your mail app should open."}
          </span>
        ) : null}
      </div>

      {!emailJsReady ? (
        <p className="text-xs leading-relaxed text-muted">
          EmailJS is not configured. This button opens your email client with a pre-filled message. To
          send from the browser, add{" "}
          <code className="rounded bg-border/60 px-1">VITE_EMAILJS_SERVICE_ID</code>,{" "}
          <code className="rounded bg-border/60 px-1">VITE_EMAILJS_TEMPLATE_ID</code>, and{" "}
          <code className="rounded bg-border/60 px-1">VITE_EMAILJS_PUBLIC_KEY</code> to{" "}
          <code className="rounded bg-border/60 px-1">.env</code> (see{" "}
          <a href="https://www.emailjs.com/docs/" className="text-accent underline-offset-2 hover:underline">
            EmailJS docs
          </a>
          ).
        </p>
      ) : null}
    </form>
  );
}
