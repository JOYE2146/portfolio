import { CONTACT_PROFILE } from "@/data/contact-profile";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

const MARGIN = 56;
const LINE = 13;
const PAGE_W = 612;
const PAGE_H = 792;

function wrapLine(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length <= maxChars) cur = next;
    else {
      if (cur) lines.push(cur);
      cur = w.length > maxChars ? w.slice(0, maxChars) : w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function drawParagraph(
  page: PDFPage,
  text: string,
  font: PDFFont,
  bold: PDFFont,
  size: number,
  yRef: { y: number },
  maxChars: number,
  title?: string
) {
  if (title) {
    page.drawText(title, {
      x: MARGIN,
      y: yRef.y,
      size: size + 1,
      font: bold,
      color: rgb(0.12, 0.12, 0.14),
    });
    yRef.y -= LINE + 4;
  }
  for (const line of wrapLine(text, maxChars)) {
    page.drawText(line, {
      x: MARGIN,
      y: yRef.y,
      size,
      font,
      color: rgb(0.2, 0.2, 0.22),
    });
    yRef.y -= LINE;
  }
  yRef.y -= 8;
}

export async function buildResumePdf(): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const page = pdf.addPage([PAGE_W, PAGE_H]);
  const yRef = { y: PAGE_H - MARGIN };

  page.drawText(CONTACT_PROFILE.fullName, {
    x: MARGIN,
    y: yRef.y,
    size: 20,
    font: bold,
    color: rgb(0.08, 0.08, 0.1),
  });
  yRef.y -= 24;

  page.drawText(CONTACT_PROFILE.headline, {
    x: MARGIN,
    y: yRef.y,
    size: 11,
    font,
    color: rgb(0.35, 0.35, 0.4),
  });
  yRef.y -= 16;

  const contactLine = `${CONTACT_PROFILE.email} · GitHub: ${CONTACT_PROFILE.github.handle} · Telegram: ${CONTACT_PROFILE.telegram.handle}`;
  for (const line of wrapLine(contactLine, 72)) {
    page.drawText(line, {
      x: MARGIN,
      y: yRef.y,
      size: 9,
      font,
      color: rgb(0.28, 0.28, 0.32),
    });
    yRef.y -= LINE - 1;
  }
  yRef.y -= 8;

  drawParagraph(
    page,
    CONTACT_PROFILE.tagline,
    font,
    bold,
    10,
    yRef,
    85,
    "SUMMARY"
  );

  const skills =
    "Frontend: React, TypeScript, Next.js, Tailwind CSS, Vite · Backend: Node.js, Express · Data: Firestore, MongoDB, MySQL, PostgreSQL · Tooling: Git, GitHub Actions, Markdown · Focus: architecture, security rules, performance, accessible UI.";
  drawParagraph(page, skills, font, bold, 10, yRef, 85, "CORE SKILLS");

  const exp =
    "Delivered portfolio and product-style SPAs with React, TypeScript, and Firebase; optional static fallbacks for contributors; documented architecture (Mermaid) and case studies. Comfortable with REST-shaped APIs, auth-aware rules, and pragmatic tradeoffs between SQL and document stores.";
  drawParagraph(page, exp, font, bold, 10, yRef, 85, "HIGHLIGHTS");

  const edu =
    "Add your degrees, bootcamps, and certifications in this repo: edit `src/lib/resumePdf.ts` and `ResumePage.tsx`, or replace this line with your credentials.";
  drawParagraph(page, edu, font, bold, 10, yRef, 85, "EDUCATION");

  page.drawText(`${CONTACT_PROFILE.linkedin.label}: ${CONTACT_PROFILE.linkedin.url}`, {
    x: MARGIN,
    y: Math.max(MARGIN, yRef.y),
    size: 9,
    font,
    color: rgb(0.4, 0.4, 0.45),
  });

  return pdf.save();
}

export async function downloadResumePdf(): Promise<void> {
  const bytes = await buildResumePdf();
  const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = CONTACT_PROFILE.resumePdfFileName;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
