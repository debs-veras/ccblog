import type { Discipline } from "@/types/discipline";

// Official Letter Slots (A through S)
const LETTER_SLOTS = [
  { code: "A", start: "07:10", end: "08:00" },
  { code: "B", start: "08:00", end: "08:50" },
  { code: "C", start: "08:50", end: "09:40" },
  { code: "D", start: "09:50", end: "10:40" },
  { code: "E", start: "10:40", end: "11:30" },
  { code: "F", start: "11:30", end: "12:10" },
  { code: "G", start: "12:20", end: "13:10" },
  { code: "H", start: "13:10", end: "14:00" },
  { code: "I", start: "14:00", end: "14:50" },
  { code: "J", start: "14:50", end: "15:40" },
  { code: "K", start: "15:50", end: "16:40" },
  { code: "L", start: "16:40", end: "17:30" },
  { code: "M", start: "17:30", end: "18:20" },
  { code: "N", start: "18:30", end: "19:20" },
  { code: "O", start: "19:20", end: "20:10" },
  { code: "P", start: "20:20", end: "21:10" },
  { code: "Q", start: "21:10", end: "22:00" },
  { code: "R", start: "22:00", end: "22:50" },
  { code: "S", start: "22:50", end: "23:40" },
];

export function generateEnrollmentPDF(
  user: { name: string; email: string },
  enrolledDisciplines: Discipline[]
) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const dateStr = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const authCode = `CCB-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const weekDays = [
    { id: 0, full: "SEGUNDA", short: "Seg" },
    { id: 1, full: "TERÇA", short: "Ter" },
    { id: 2, full: "QUARTA", short: "Qua" },
    { id: 3, full: "QUINTA", short: "Qui" },
    { id: 4, full: "SEXTA", short: "Sex" },
  ];

  // Check if Saturday is used by any discipline
  const hasSaturday = enrolledDisciplines.some((d) =>
    d.schedules?.some((s) => s.dayOfWeek === 5)
  );

  if (hasSaturday) {
    weekDays.push({ id: 5, full: "SÁBADO", short: "Sáb" });
  }

  // Color palettes for disciplines to differentiate them in the schedule grid
  const COLOR_PALETTES = [
    {
      bg: "#eff6ff",
      border: "#bfdbfe",
      accent: "#2563eb",
      text: "#1e3a8a",
      badgeBg: "#dbeafe",
      badgeText: "#1d4ed8",
    },
    {
      bg: "#fff7ed",
      border: "#fed7aa",
      accent: "#ea580c",
      text: "#7c2d12",
      badgeBg: "#ffedd5",
      badgeText: "#c2410c",
    },
    {
      bg: "#ecfdf5",
      border: "#a7f3d0",
      accent: "#059669",
      text: "#064e3b",
      badgeBg: "#d1fae5",
      badgeText: "#047857",
    },
    {
      bg: "#f5f3ff",
      border: "#ddd6fe",
      accent: "#7c3aed",
      text: "#4c1d95",
      badgeBg: "#ede9fe",
      badgeText: "#6d28d9",
    },
    {
      bg: "#fff1f2",
      border: "#fecdd3",
      accent: "#e11d48",
      text: "#881337",
      badgeBg: "#ffe4e6",
      badgeText: "#be123c",
    },
    {
      bg: "#ecfeff",
      border: "#a5f3fc",
      accent: "#0891b2",
      text: "#164e63",
      badgeBg: "#cffafe",
      badgeText: "#0e7490",
    },
    {
      bg: "#fefce8",
      border: "#fef08a",
      accent: "#ca8a04",
      text: "#713f12",
      badgeBg: "#fef9c3",
      badgeText: "#a16207",
    },
  ];

  // Map each discipline ID to a color palette
  const paletteMap = new Map<string, (typeof COLOR_PALETTES)[0]>();
  enrolledDisciplines.forEach((d, idx) => {
    paletteMap.set(d.id, COLOR_PALETTES[idx % COLOR_PALETTES.length]);
  });

  const timeToMinutes = (t: string): number => {
    if (!t) return 0;
    const parts = t.slice(0, 5).split(":");
    return (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
  };

  // Helper to get schedule letter string (e.g. "BC", "BCDE", "IJKL", "NOPQ")
  const getScheduleLetters = (startTime: string, endTime: string): string => {
    const sStart = timeToMinutes(startTime);
    const sEnd = timeToMinutes(endTime);

    const matched = LETTER_SLOTS.filter((slot) => {
      const slotStart = timeToMinutes(slot.start);
      const slotEnd = timeToMinutes(slot.end);
      return sStart < slotEnd && sEnd > slotStart;
    });

    return matched.map((m) => m.code).join("");
  };

  // Find min and max active slot indices
  let minSlotIdx = 0; // Always start at Slot A (07:10)
  let maxSlotIdx = 16; // Default Q (22:00)

  enrolledDisciplines.forEach((d) => {
    (d.schedules || []).forEach((s) => {
      const sStart = timeToMinutes(s.startTime);
      const sEnd = timeToMinutes(s.endTime);

      LETTER_SLOTS.forEach((slot, idx) => {
        const slotStart = timeToMinutes(slot.start);
        const slotEnd = timeToMinutes(slot.end);
        if (sStart < slotEnd && sEnd > slotStart) {
          if (idx < minSlotIdx) minSlotIdx = idx;
          if (idx > maxSlotIdx) maxSlotIdx = idx;
        }
      });
    });
  });

  const activeSlots = LETTER_SLOTS.slice(minSlotIdx, maxSlotIdx + 1);

  const SLOT_ROW_HEIGHT = 38; // 38px per letter slot
  const totalGridHeight = activeSlots.length * SLOT_ROW_HEIGHT;

  // Build Time Column (Letter - Start às End)
  const timeSlotsHtml = activeSlots
    .map(
      (slot) => `
      <div style="height: ${SLOT_ROW_HEIGHT}px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; padding: 3px 6px; box-sizing: border-box; background: #f8fafc;">
        <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; padding: 3px 6px; width: 100%; text-align: center; box-sizing: border-box; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.02);">
          <strong style="font-weight: 800; color: #047857; font-size: 11.5px; font-family: ui-monospace, SFMono-Regular, monospace;">${slot.code}</strong>
          <span style="font-size: 9.5px; font-weight: 600; color: #065f46; font-family: ui-monospace, SFMono-Regular, monospace; white-space: nowrap;">${slot.start} às ${slot.end}</span>
        </div>
      </div>
    `
    )
    .join("");

  // Background slot lines for day columns
  const bgLinesHtml = Array.from({ length: activeSlots.length }, () =>
    `<div style="height: ${SLOT_ROW_HEIGHT}px; border-bottom: 1px solid #f1f5f9; box-sizing: border-box;"></div>`
  ).join("");

  // Day columns html with absolute positioned discipline cards
  const dayColumnsHtml = weekDays
    .map((w) => {
      const daySchedules: { discipline: Discipline; schedule: Discipline["schedules"][0] }[] = [];

      enrolledDisciplines.forEach((d) => {
        (d.schedules || []).forEach((s) => {
          if (s.dayOfWeek === w.id) {
            daySchedules.push({ discipline: d, schedule: s });
          }
        });
      });

      const cardsHtml = daySchedules
        .map(({ discipline: d, schedule: s }) => {
          const sStart = timeToMinutes(s.startTime);
          const sEnd = timeToMinutes(s.endTime);

          let startSlotIdx = activeSlots.findIndex((slot) => timeToMinutes(slot.end) > sStart);
          if (startSlotIdx === -1) startSlotIdx = 0;

          let endSlotIdx = activeSlots.findIndex((slot) => timeToMinutes(slot.start) >= sEnd);
          if (endSlotIdx === -1) endSlotIdx = activeSlots.length;

          const spanCount = Math.max(1, endSlotIdx - startSlotIdx);

          const topPx = startSlotIdx * SLOT_ROW_HEIGHT;
          const heightPx = spanCount * SLOT_ROW_HEIGHT;

          const pal = paletteMap.get(d.id) || COLOR_PALETTES[0];
          const letterCode = getScheduleLetters(s.startTime, s.endTime);

          return `
            <div style="position: absolute; top: ${topPx + 1}px; left: 3px; right: 3px; height: ${heightPx - 2}px; background-color: ${pal.bg}; border: 1px solid ${pal.border}; border-left: 4px solid ${pal.accent}; border-radius: 6px; padding: 4px 6px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04); z-index: 10;">
              <div style="overflow: hidden; display: flex; flex-direction: column; gap: 1px;">
                <div style="font-weight: 700; color: ${pal.text}; font-size: 9.5px; line-height: 1.2; word-break: break-word;">
                  <span style="font-family: ui-monospace, SFMono-Regular, monospace; font-weight: 800; color: ${pal.badgeText}; background-color: ${pal.badgeBg}; padding: 1px 4px; border-radius: 3px; font-size: 8px; margin-right: 3px; display: inline-block; vertical-align: middle;">
                    ${d.code || `CC-00`}
                  </span>
                  <span style="vertical-align: middle;">${d.name}</span>
                </div>
                ${
                  d.teacher?.name
                    ? `<div style="font-size: 8.5px; color: ${pal.text}; opacity: 0.9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        👨‍🏫 ${d.teacher.name}
                      </div>`
                    : ""
                }
              </div>
              <div style="font-size: 8.5px; font-weight: 700; color: ${pal.accent}; border-top: 1px solid ${pal.border}; padding-top: 2px; margin-top: 2px; white-space: nowrap;">
                🕒 <strong>${letterCode}</strong> (${s.startTime.slice(0, 5)} - ${s.endTime.slice(0, 5)})
              </div>
            </div>
          `;
        })
        .join("");

      return `
        <div style="position: relative; height: ${totalGridHeight}px; border-right: 1px solid #e2e8f0; background: #ffffff; box-sizing: border-box;">
          ${bgLinesHtml}
          ${cardsHtml}
        </div>
      `;
    })
    .join("");

  const totalWorkload = enrolledDisciplines.reduce(
    (acc, d) => acc + (d.workload || 0),
    0
  );

  // Rows for the detailed list of disciplines
  const detailedRowsHtml = enrolledDisciplines
    .map((d, idx) => {
      const pal = paletteMap.get(d.id) || COLOR_PALETTES[0];
      const schedulesStr =
        d.schedules && d.schedules.length > 0
          ? d.schedules
              .map(
                (s) =>
                  `<span style="display: inline-block; background: #f1f5f9; color: #334155; padding: 2px 6px; border-radius: 4px; font-size: 10.5px; margin: 1px 2px 1px 0; border: 1px solid #e2e8f0; font-weight: 600;"><strong>${weekDays.find((w) => w.id === s.dayOfWeek)?.short || "Dia"}</strong>: ${s.startTime.slice(0, 5)} - ${s.endTime.slice(0, 5)}</span>`
              )
              .join(" ")
          : `<span style="color: #94a3b8; font-style: italic; font-size: 11px;">Horário a definir</span>`;

      return `
        <tr style="background-color: ${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
          <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0;">
            <span style="font-family: ui-monospace, monospace; font-weight: 800; color: ${pal.badgeText}; background: ${pal.badgeBg}; padding: 2px 7px; border-radius: 4px; font-size: 11px; border: 1px solid ${pal.border};">
              ${d.code || `CC-00${idx + 1}`}
            </span>
          </td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0;">
            <div style="font-weight: 700; color: #0f172a; font-size: 12.5px;">${d.name}</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 1px;">
              ${d.period > 0 ? `${d.period}º Semestre / Período` : "Disciplina Optativa"}
            </div>
          </td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 11.5px; color: #334155;">
            ${d.teacher?.name ? `Prof(a). ${d.teacher.name}` : "Docente a definir"}
          </td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 11.5px; text-align: center; font-weight: 700; color: #0f172a;">
            ${d.workload ? `${d.workload}h` : "60h"}
          </td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0;">
            ${schedulesStr}
          </td>
        </tr>
      `;
    })
    .join("");

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <title>Comprovante de Matrícula - ${user.name}</title>
      <style>
        * { box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #0f172a;
          margin: 0;
          padding: 20px;
          background: #ffffff;
          line-height: 1.4;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 3px solid #ff7a00;
          padding-bottom: 14px;
          margin-bottom: 16px;
        }

        .brand-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-box {
          background: linear-gradient(135deg, #ff7a00 0%, #ea580c 100%);
          color: #ffffff;
          font-weight: 900;
          font-size: 20px;
          padding: 6px 12px;
          border-radius: 8px;
          letter-spacing: -0.5px;
        }

        .logo-title {
          font-size: 19px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.3px;
        }

        .logo-subtitle {
          font-size: 10.5px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .status-badge {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
          font-weight: 800;
          font-size: 10px;
          padding: 4px 10px;
          border-radius: 20px;
          display: inline-block;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 12px;
          margin-bottom: 20px;
        }

        .info-item {
          font-size: 10px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .info-item strong {
          display: block;
          font-size: 12px;
          color: #0f172a;
          text-transform: none;
          letter-spacing: normal;
          font-weight: 700;
          margin-top: 2px;
        }

        .section-header {
          font-size: 12px;
          font-weight: 800;
          color: #1e293b;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .section-header::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 14px;
          background: #ff7a00;
          border-radius: 2px;
        }

        /* Timetable Grid */
        .timetable-container {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          background: #ffffff;
          margin-bottom: 20px;
        }

        .timetable-header {
          display: grid;
          grid-template-columns: 140px repeat(${weekDays.length}, 1fr);
          background: #f8fafc;
          border-bottom: 2px solid #e2e8f0;
        }

        .timetable-header-cell {
          padding: 8px 4px;
          text-align: center;
          font-size: 10.5px;
          font-weight: 800;
          color: #334155;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          border-right: 1px solid #e2e8f0;
          box-sizing: border-box;
        }

        .timetable-header-cell:last-child {
          border-right: none;
        }

        .timetable-header-cell:first-child {
          color: #64748b;
        }

        .timetable-body {
          display: grid;
          grid-template-columns: 140px repeat(${weekDays.length}, 1fr);
        }

        /* Detailed Table */
        .details-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }

        .details-table th {
          background: #1e293b;
          color: #ffffff;
          padding: 8px 10px;
          text-align: left;
          font-size: 10.5px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          font-weight: 700;
        }

        .details-table td {
          vertical-align: middle;
        }

        .footer {
          margin-top: 30px;
          padding-top: 12px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 9.5px;
          color: #94a3b8;
        }

        .auth-box {
          font-family: ui-monospace, monospace;
          font-weight: 700;
          color: #475569;
          background: #f1f5f9;
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid #cbd5e1;
        }

        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
        }
      </style>
    </head>
    <body>
      <!-- BARRA DE AÇÕES (IMPRIMIR / SALVAR PDF) -->
      <div class="no-print" style="margin-bottom: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <div style="font-size: 13px; color: #475569; font-weight: 600; display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 16px;">📄</span> Visualização do Comprovante de Matrícula
        </div>
        <button onclick="window.print()" style="background: linear-gradient(135deg, #ff7a00 0%, #ea580c 100%); color: #ffffff; border: none; border-radius: 8px; padding: 9px 18px; font-weight: 700; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 6px -1px rgba(234, 88, 12, 0.3); transition: all 0.15s ease;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          Imprimir / Salvar PDF
        </button>
      </div>

      <!-- HEADER -->
      <div class="header">
        <div class="brand-container">
          <div class="logo-box">CC</div>
          <div>
            <div class="logo-title">CCBlog Academy</div>
            <div class="logo-subtitle">Comprovante Oficial de Matrícula</div>
          </div>
        </div>
        <div style="text-align: right;">
          <span class="status-badge">✓ Matrícula Confirmada</span>
          <div style="font-size: 10px; color: #64748b; margin-top: 4px;">Gerado em ${dateStr}</div>
        </div>
      </div>

      <!-- STUDENT INFO CARD -->
      <div class="info-grid">
        <div class="info-item">
          Estudante:
          <strong>${user.name}</strong>
        </div>
        <div class="info-item">
          E-mail Acadêmico:
          <strong>${user.email}</strong>
        </div>
        <div class="info-item">
          Disciplinas Inscritas:
          <strong>${enrolledDisciplines.length} disciplina(s)</strong>
        </div>
        <div class="info-item">
          Carga Horária Total:
          <strong>${totalWorkload}h de aulas</strong>
        </div>
      </div>

      <!-- GRADE DE HORÁRIOS (TIMETABLE GRID) -->
      <div class="section-header">Grade Semanal de Horários</div>
      
      <div class="timetable-container">
        <div class="timetable-header">
          <div class="timetable-header-cell">HORÁRIO</div>
          ${weekDays.map((w) => `<div class="timetable-header-cell">${w.full}</div>`).join("")}
        </div>
        <div class="timetable-body">
          <div style="background: #f8fafc; border-right: 1px solid #e2e8f0;">
            ${timeSlotsHtml}
          </div>
          ${dayColumnsHtml}
        </div>
      </div>

      <!-- DETALHAMENTO DAS DISCIPLINAS -->
      <div class="section-header">Detalhamento das Disciplinas Matriculadas</div>
      
      <table class="details-table">
        <thead>
          <tr>
            <th style="width: 12%;">Código</th>
            <th style="width: 32%;">Disciplina / Semestre</th>
            <th style="width: 22%;">Docente Responsável</th>
            <th style="width: 10%; text-align: center;">C.H.</th>
            <th style="width: 24%;">Horários das Aulas</th>
          </tr>
        </thead>
        <tbody>
          ${
            detailedRowsHtml ||
            `<tr><td colspan="5" style="text-align: center; padding: 20px; color: #94a3b8; font-size: 12px;">Nenhuma disciplina matriculada até o momento.</td></tr>`
          }
        </tbody>
      </table>

      <!-- FOOTER -->
      <div class="footer">
        <div>
          CCBlog Academic Portal • Autenticação Digital: <span class="auth-box">${authCode}</span>
        </div>
        <div>Via do Aluno • Documento Válido para Comprovação Acadêmica</div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 350);
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  setTimeout(() => {
    if (printWindow && !printWindow.closed) {
      printWindow.focus();
      printWindow.print();
    }
  }, 350);
}
