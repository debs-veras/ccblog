import type { Discipline } from "@/types/discipline";

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

  const weekDays = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira"];

  const rows = enrolledDisciplines
    .map(
      (d, idx) => `
    <tr style="background-color: ${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
      <td style="padding: 12px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #ff7a00; font-family: monospace; font-size: 13px;">
        ${d.code || `CC-00${idx + 1}`}
      </td>
      <td style="padding: 12px 14px; border-bottom: 1px solid #e2e8f0;">
        <div style="font-weight: 700; color: #0f172a; font-size: 14px;">${d.name}</div>
        <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${d.period > 0 ? `${d.period}º Semestre / Período` : "Disciplina Optativa"}</div>
      </td>
      <td style="padding: 12px 14px; border-bottom: 1px solid #e2e8f0; color: #334155; font-size: 13px;">
        ${d.teacher?.name ? `Prof(a). ${d.teacher.name}` : "Docente a definir"}
      </td>
      <td style="padding: 12px 14px; border-bottom: 1px solid #e2e8f0; color: #ea580c; font-size: 12px; font-weight: 600;">
        ${
          d.schedules && d.schedules.length > 0
            ? d.schedules
                .map((s) => `${weekDays[s.dayOfWeek]} (${s.startTime.slice(0, 5)} às ${s.endTime.slice(0, 5)})`)
                .join("<br/>")
            : "Horário a ser confirmado"
        }
      </td>
    </tr>
  `
    )
    .join("");

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <title>Comprovante de Matrícula - ${user.name}</title>
      <style>
        * { box-sizing: border-box; }
        body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 40px; background: #ffffff; line-height: 1.5; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #ff7a00; padding-bottom: 20px; margin-bottom: 24px; }
        .logo-title { font-size: 26px; font-weight: 900; color: #ff7a00; letter-spacing: -0.5px; }
        .logo-subtitle { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
        .badge-status { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; font-weight: 800; font-size: 11px; padding: 6px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; }
        .info-grid { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin-bottom: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .info-item { font-size: 13.5px; color: #475569; }
        .info-item strong { color: #0f172a; font-weight: 700; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 30px; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
        th { background: #1e293b; color: #ffffff; padding: 14px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 700; }
        .section-header { font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 12px; border-left: 4px solid #ff7a00; padding-left: 10px; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #94a3b8; }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div className="header">
        <div>
          <div className="logo-title">CCBlog</div>
          <div className="logo-subtitle">Portal Acadêmico & Sistema de Matrículas</div>
        </div>
        <div style="text-align: right;">
          <span className="badge-status">✓ Matrícula Confirmada</span>
          <div style="font-size: 11px; color: #64748b; margin-top: 6px;">Gerado em ${dateStr}</div>
        </div>
      </div>

      <div className="info-grid">
        <div className="info-item"><strong>Estudante:</strong> ${user.name}</div>
        <div className="info-item"><strong>E-mail:</strong> ${user.email}</div>
        <div className="info-item"><strong>Disciplinas Matriculadas:</strong> ${enrolledDisciplines.length} disciplina(s)</div>
        <div className="info-item"><strong>Situação no Semestre:</strong> Regular e Ativo</div>
      </div>

      <div className="section-header">Comprovante de Horários e Disciplinas Matriculadas</div>
      
      <table>
        <thead>
          <tr>
            <th style="width: 15%;">Código</th>
            <th style="width: 35%;">Disciplina / Semestre</th>
            <th style="width: 25%;">Docente Responsável</th>
            <th style="width: 25%;">Horário das Aulas</th>
          </tr>
        </thead>
        <tbody>
          ${
            rows ||
            `<tr><td colspan="4" style="text-align: center; padding: 24px; color: #94a3b8; font-size: 13px;">Nenhuma disciplina matriculada até o momento.</td></tr>`
          }
        </tbody>
      </table>

      <div className="footer">
        <div>CCBlog Academy Portal • Documento com Autenticidade Digital</div>
        <div>Via do Aluno • Página 1 de 1</div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
