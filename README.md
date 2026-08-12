# HTML to PDF Converter

A polished browser-based HTML to PDF converter built with HTML, CSS, and JavaScript.

## Features

- Live HTML preview in a sandboxed iframe
- Load local HTML files
- Download the raw HTML source
- Export to PDF with `html2pdf.js`
- Controls for page size, orientation, margin, and scale
- Responsive layout for desktop and mobile

## How to use

1. Open `index.html` in a browser.
2. Paste HTML into the editor or load a file.
3. Adjust the export settings.
4. Click `Convert to PDF`.

## GitHub Pages

This project is ready to publish as a static site.

1. Go to the repository settings on GitHub.
2. Open the Pages section.
3. Select the `main` branch as the source.
4. Set the folder to `/ (root)`.
5. Save the changes and wait for the deployment link.

The included GitHub Actions workflow will also deploy updates automatically on pushes to `main`.

## Notes

- This is a client-side project and does not need a backend.
- Internet access is required for the CDN-hosted `html2pdf.js` library and Google Fonts.