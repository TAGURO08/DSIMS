export function generateRISPrintHTML(ris, items, issuer) {
  const logoPath = "/src/img/logo.png";
  const dateRequested = ris.DateRequested ? ris.DateRequested : "";
  const dateReceived = ris.DateReceived ? ris.DateReceived : "";
  const issuerName = issuer
    ? `${issuer.fname || ""}${issuer.mname ? " " + issuer.mname : ""}${
        issuer.lname ? " " + issuer.lname : ""
      }`.trim()
    : "";

  const itemsRows = (items || [])
    .map((it, idx) => {
      const desc = it.ProductName || "";
      const qty = it.Qty ?? "";
      return `
      <tr>
        <td style="padding:6px;border:1px solid #000; text-align:center;">${
          idx + 1
        }</td>
        <td style="padding:6px;border:1px solid #000;">${desc}</td>
        <td style="padding:6px;border:1px solid #000; text-align:center;">${qty}</td>
      </tr>
    `;
    })
    .join("");

  // fill remaining blank rows to match form look (20 rows total)
  const blankCount = Math.max(0, 20 - (items?.length || 0));
  const blankRows = new Array(blankCount)
    .fill(0)
    .map(
      (_, i) => `
    <tr>
      <td style="padding:6px;border:1px solid #000; text-align:center;">${
        (items?.length || 0) + i + 1
      }</td>
      <td style="padding:6px;border:1px solid #000;">&nbsp;</td>
      <td style="padding:6px;border:1px solid #000; text-align:center;">&nbsp;</td>
    </tr>
  `
    )
    .join("");

  const html = `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>RIS Print</title>
    <style>
      body { font-family: Arial, Helvetica, sans-serif; color: #000; }
      .header { display:flex; align-items:center; justify-content:center; gap:12px; }
      .logo { width:110px; height:auto }
      .title { text-align:left; flex:1 }
        .org-lines { margin:0; text-align:center; display:flex; flex-direction:column; align-items:center }
      .title h1 { margin:0; font-size:18px }
      .title p { margin:0; font-size:12px }
      .meta { margin-top:12px; display:flex; justify-content:space-between; font-size:12px }
      .container { width:780px; margin:0 auto }
      table.form { width:100%; border-collapse:collapse; margin-top:8px; font-size:12px }
      table.form th { border:1px solid #000; padding:6px; background:#f3f3f3 }
      .footer { margin-top:14px; font-size:12px }
      .signatures { display:flex; justify-content:space-between; margin-top:18px }
      .sign { text-align:center; width:32% }
      @media print {
        body { zoom:95%; }
      }
    </style>
  </head>
  <body>
    <div class="container">
    <div class="header">
      <img src="${logoPath}" class="logo" alt="logo" style="margin-right:10px;" />
      <div class="title">
        <div class="org-lines" style="font-weight:700; text-transform:uppercase; line-height:1.05;">
          <div style="font-size:14px;">DEPARTMENT OF EDUCATION</div>
          <div style="font-size:16px; margin-top:2px;">SCHOOLS DIVISION OFFICE OF NUEVA ECIJA</div>
          <div style="font-size:18px; font-weight:800; margin-top:4px;">SAN RICARDO NATIONAL HIGH SCHOOL</div>
        </div>
          <h1 style="margin-top:8px; font-size:22px; text-align:center; margin-left:0;">REQUISITION AND ISSUE SLIP</h1>
      </div>
    </div>
    </div>

    <div class="meta">
      <div><strong>Office/Entity Name:</strong> San Ricardo Senior High School</div>
    </div>

    <div class="meta">
      <div><strong>Division:</strong> ________________________</div>
      <div><strong>Responsibility Center Code:</strong> ________</div>
      <div><strong>RIS No.:</strong> ${ris.RIS_id ?? ""}</div>
    </div>

    <table class="form">
      <thead>
        <tr>
          <th style="width:6%">Stock No.</th>
          <th style="width:78%">Item</th>
          <th style="width:16%">Quantity</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
        ${blankRows}
      </tbody>
    </table>

    <div class="footer">
      <div style="margin-top:8px;"><strong>Purpose:</strong> ________________________________________________</div>

      <div class="signatures">
        <div class="sign">
            <div style="height:40px; display:flex; align-items:center; justify-content:center; border-bottom:1px solid #000; font-weight:600;">${
              ris.Order_by ?? ""
            }</div>
            <div style="margin-top:6px"><strong>Requested by</strong></div>
          </div>
          <div class="sign">
            <div style="height:40px; display:flex; align-items:center; justify-content:center; border-bottom:1px solid #000; font-weight:600;">${
              ris.FullName ?? ""
            }</div>
            <div style="margin-top:6px"><strong>Approved by</strong></div>
          </div>
        <div class="sign">
           <div style="height:40px; display:flex; align-items:center; justify-content:center; border-bottom:1px solid #000; font-weight:600;">${issuerName}</div>
           <div style="margin-top:6px"><strong>Issued by</strong></div>
        </div>
        
      </div>

      <div style="margin-top:10px; font-size:11px;">Date Requested: ${dateRequested} &nbsp;&nbsp; Date Received: ${dateReceived}</div>
    </div>

  </body>
  </html>
  `;

  return html;
}
