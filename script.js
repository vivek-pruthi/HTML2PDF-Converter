const htmlInput = document.getElementById('htmlInput');
const fileInput = document.getElementById('fileInput');
const previewFrame = document.getElementById('previewFrame');
const statusBadge = document.getElementById('statusBadge');
const previewBtn = document.getElementById('previewBtn');
const downloadHtmlBtn = document.getElementById('downloadHtmlBtn');
const convertBtn = document.getElementById('convertBtn');
const pageSize = document.getElementById('pageSize');
const orientation = document.getElementById('orientation');
const margin = document.getElementById('margin');
const scale = document.getElementById('scale');

const sampleHtml = `
<div class="page">
  <style>
    :root {
      color-scheme: light;
      font-family: Arial, sans-serif;
    }

    body {
      margin: 0;
      background: #f4f7fb;
      color: #1f2937;
    }

    .page {
      padding: 48px;
      max-width: 900px;
      margin: 0 auto;
    }

    .hero {
      background: linear-gradient(135deg, #0f172a, #1d4ed8);
      color: white;
      padding: 36px;
      border-radius: 24px;
      box-shadow: 0 18px 60px rgba(15, 23, 42, 0.24);
    }

    h1 {
      margin: 0 0 12px;
      font-size: 40px;
    }

    p {
      line-height: 1.7;
      margin: 0 0 18px;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 24px;
    }

    .card {
      background: white;
      border-radius: 18px;
      padding: 20px;
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
    }

    .card h3 {
      margin-top: 0;
    }

    .muted {
      color: #64748b;
    }
  </style>

  <div class="hero">
    <h1>Project Proposal</h1>
    <p>Use the editor to convert styled HTML into a downloadable PDF document.</p>
  </div>

  <div class="cards">
    <div class="card">
      <h3>Fast Preview</h3>
      <p class="muted">Render HTML instantly before exporting.</p>
    </div>
    <div class="card">
      <h3>Page Control</h3>
      <p class="muted">Adjust paper size, orientation, margins, and scale.</p>
    </div>
    <div class="card">
      <h3>PDF Export</h3>
      <p class="muted">Generate a clean PDF entirely in the browser.</p>
    </div>
  </div>
</div>`;

function setStatus(message, tone = 'ready') {
  statusBadge.textContent = message;
  statusBadge.dataset.tone = tone;
}

function renderPreview() {
  const html = htmlInput.value.trim() || sampleHtml;
  const previewDocument = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <base target="_blank" />
        <style>
          html, body { margin: 0; padding: 0; background: #fff; }
        </style>
      </head>
      <body>${html}</body>
    </html>`;

  previewFrame.srcdoc = previewDocument;
  setStatus('Preview updated');
}

function downloadHtml() {
  const html = htmlInput.value.trim() || sampleHtml;
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'document.html';
  link.click();
  URL.revokeObjectURL(link.href);
  setStatus('HTML downloaded');
}

async function convertToPdf() {
  if (!window.html2pdf) {
    setStatus('PDF library still loading', 'error');
    return;
  }

  const html = htmlInput.value.trim() || sampleHtml;
  const wrapper = document.createElement('div');
  wrapper.className = 'pdf-export-root';
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  setStatus('Generating PDF...', 'busy');
  convertBtn.disabled = true;

  const marginValue = Number.parseInt(margin.value, 10) / 10;
  const scaleValue = Number.parseFloat(scale.value);

  try {
    await window.html2pdf()
      .set({
        margin: marginValue,
        filename: 'html-to-pdf.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: scaleValue, useCORS: true, scrollY: 0 },
        jsPDF: { unit: 'in', format: pageSize.value, orientation: orientation.value },
      })
      .from(wrapper)
      .save();

    setStatus('PDF ready');
  } catch (error) {
    console.error(error);
    setStatus('PDF generation failed', 'error');
  } finally {
    convertBtn.disabled = false;
    wrapper.remove();
  }
}

function loadFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    htmlInput.value = String(reader.result || '');
    renderPreview();
    setStatus('HTML loaded');
  };
  reader.readAsText(file);
}

htmlInput.value = sampleHtml;
renderPreview();

htmlInput.addEventListener('input', () => {
  setStatus('Editing');
});

previewBtn.addEventListener('click', renderPreview);
downloadHtmlBtn.addEventListener('click', downloadHtml);
convertBtn.addEventListener('click', convertToPdf);

fileInput.addEventListener('change', (event) => {
  const [file] = event.target.files || [];
  if (file) {
    loadFile(file);
  }
  event.target.value = '';
});

window.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.key === 'Enter') {
    convertToPdf();
  }
});

setStatus('Ready');