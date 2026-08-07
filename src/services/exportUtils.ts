import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  fileName: string = 'Tanker_Report'
) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportToPdf(
  title: string,
  headers: string[],
  rows: (string | number)[][],
  fileName: string = 'Tanker_Report'
) {
  const doc = new jsPDF();

  // Header Title
  doc.setFontSize(16);
  doc.setTextColor(30, 58, 138); // #1E3A8A Primary Deep Blue
  doc.text('PIRAMAL PETROLEUM - TANKER MANAGEMENT SYSTEM', 14, 18);

  doc.setFontSize(12);
  doc.setTextColor(51, 65, 85);
  doc.text(title, 14, 26);

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 32);

  // Table
  autoTable(doc, {
    startY: 38,
    head: [headers],
    body: rows,
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
  });

  doc.save(`${fileName}_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function printTable(title: string, tableId: string) {
  const elem = document.getElementById(tableId);
  if (!elem) {
    window.print();
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>${title} - Piramal Petroleum</title>
        <style>
          body { font-family: system-ui, sans-serif; margin: 20px; color: #1e293b; }
          h1 { color: #1e3a8a; font-size: 20px; margin-bottom: 4px; }
          p { color: #64748b; font-size: 12px; margin-top: 0; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; }
          th { background: #1e3a8a; color: white; padding: 8px; text-align: left; }
          td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
          tr:nth-child(even) { background: #f8fafc; }
        </style>
      </head>
      <body>
        <h1>Piramal Petroleum - ${title}</h1>
        <p>Generated on ${new Date().toLocaleString()}</p>
        ${elem.outerHTML}
        <script>
          window.onload = function() { window.print(); window.close(); }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
