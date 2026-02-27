// Inject Google Fonts
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// Inject global CSS
const globalStyle = document.createElement("style");
globalStyle.textContent = `
  * { font-family: 'DM Sans', sans-serif; }
  body { background: #f4f5f7; margin: 0; }
  input:focus, textarea:focus {
    outline: none;
    border-color: #4f46e5 !important;
    box-shadow: 0 0 0 3px rgba(79,70,229,0.12);
  }
  .btn-primary { background: #4f46e5; transition: background 0.15s, transform 0.1s; }
  .btn-primary:hover { background: #4338ca; transform: translateY(-1px); }
  .btn-primary:active { transform: translateY(0); }
  .card { background: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04); }
  .job-card { transition: box-shadow 0.2s; }
  .job-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
  tbody tr:hover td { background: #f8f9ff; }
`;
document.head.appendChild(globalStyle);
