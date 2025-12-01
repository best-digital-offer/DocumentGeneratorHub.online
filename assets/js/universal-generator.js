/**
 * Universal Generator JavaScript
 * Handles common functionality for all document generators
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeUniversalGenerator();
});

function initializeUniversalGenerator() {
    // Set default date to today
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) {
            input.value = new Date().toISOString().split('T')[0];
        }
    });
    
    // Initialize event listeners
    setupUniversalEventListeners();
    
    // Load document-specific content
    loadDocumentSpecificContent();
}

function setupUniversalEventListeners() {
    // Preview and export buttons
    const previewBtn = document.getElementById('previewDocument');
    const pdfBtn = document.getElementById('generatePDF');
    const wordBtn = document.getElementById('generateWord');
    const excelBtn = document.getElementById('generateExcel');
    
    if (previewBtn) previewBtn.addEventListener('click', previewDocument);
    if (pdfBtn) pdfBtn.addEventListener('click', () => exportDocument('pdf'));
    if (wordBtn) wordBtn.addEventListener('click', () => exportDocument('word'));
    if (excelBtn) excelBtn.addEventListener('click', () => exportDocument('excel'));
    
    // Form validation
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            previewDocument();
        });
    }
}

function loadDocumentSpecificContent() {
    const dynamicContent = document.getElementById('dynamicContent');
    const currentPath = window.location.pathname;
    
    // Load content based on document type
    if (currentPath.includes('contract-generator')) {
        loadContractFields(dynamicContent);
    } else if (currentPath.includes('resume-generator')) {
        loadResumeFields(dynamicContent);
    } else if (currentPath.includes('certificate-generator')) {
        loadCertificateFields(dynamicContent);
    } else {
        loadGenericFields(dynamicContent);
    }
}

function loadGenericFields(container) {
    container.innerHTML = `
        <div class="form-section">
            <h3>Content Details</h3>
            
            <div class="form-group">
                <label for="documentContent" class="form-label">Document Content *</label>
                <textarea id="documentContent" name="documentContent" class="form-textarea" required placeholder="Enter the main content of your document" rows="8"></textarea>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="authorName" class="form-label">Author/Creator Name</label>
                    <input type="text" id="authorName" name="authorName" class="form-input" placeholder="Enter author name">
                </div>
                <div class="form-group">
                    <label for="organizationName" class="form-label">Organization Name</label>
                    <input type="text" id="organizationName" name="organizationName" class="form-input" placeholder="Enter organization name">
                </div>
            </div>
        </div>
        
        <div class="form-section">
            <h3>Additional Information</h3>
            
            <div class="form-group">
                <label for="additionalNotes" class="form-label">Additional Notes</label>
                <textarea id="additionalNotes" name="additionalNotes" class="form-textarea" placeholder="Any additional information or notes" rows="4"></textarea>
            </div>
        </div>
    `;
}

function previewDocument() {
    const formData = collectFormData();
    if (!validateFormData(formData)) {
        return;
    }
    
    const previewHTML = generateDocumentHTML(formData);
    document.getElementById('documentPreview').innerHTML = previewHTML;
    document.getElementById('previewContainer').style.display = 'block';
    
    // Scroll to preview
    document.getElementById('previewContainer').scrollIntoView({ behavior: 'smooth' });
}

function collectFormData() {
    const form = document.querySelector('form');
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    return data;
}

function validateFormData(data) {
    const requiredFields = ['documentTitle', 'documentDate'];
    
    for (const field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
            return false;
        }
    }
    
    return true;
}

function generateDocumentHTML(data) {
    return `
        <div class="document-header">
            <h1 style="color: var(--primary-color); text-align: center; margin-bottom: 2rem;">${data.documentTitle || 'Document'}</h1>
            <p style="text-align: right; margin-bottom: 2rem;">Date: ${formatDate(data.documentDate)}</p>
        </div>
        
        <div class="document-content">
            ${data.documentContent ? `<div style="margin-bottom: 2rem; white-space: pre-line;">${data.documentContent}</div>` : ''}
            
            ${data.authorName || data.organizationName ? `
                <div style="margin-top: 3rem;">
                    ${data.authorName ? `<p><strong>Author:</strong> ${data.authorName}</p>` : ''}
                    ${data.organizationName ? `<p><strong>Organization:</strong> ${data.organizationName}</p>` : ''}
                </div>
            ` : ''}
            
            ${data.additionalNotes ? `
                <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                    <h4>Additional Notes:</h4>
                    <p style="white-space: pre-line;">${data.additionalNotes}</p>
                </div>
            ` : ''}
        </div>
        
        <div style="margin-top: 3rem; text-align: center; color: var(--text-light); font-size: 0.875rem;">
            <p>Generated using Document Generator Hub</p>
        </div>
    `;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function exportDocument(format) {
    const formData = collectFormData();
    if (!validateFormData(formData)) {
        return;
    }
    
    switch (format) {
        case 'pdf':
            exportToPDF(formData);
            break;
        case 'word':
            exportToWord(formData);
            break;
        case 'excel':
            exportToExcel(formData);
            break;
    }
}

function exportToPDF(data) {
    const printWindow = window.open('', '_blank');
    const documentHTML = generateDocumentHTML(data);
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${data.documentTitle || 'Document'}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                .document-preview { max-width: 800px; margin: 0 auto; }
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="document-preview">${documentHTML}</div>
            <div class="no-print" style="text-align: center; margin-top: 20px;">
                <button onclick="window.print()">Print/Save as PDF</button>
                <button onclick="window.close()">Close</button>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

function exportToWord(data) {
    const documentHTML = generateDocumentHTML(data);
    const blob = new Blob([`
        <!DOCTYPE html>
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
        <head>
            <meta charset='utf-8'>
            <title>${data.documentTitle || 'Document'}</title>
        </head>
        <body>${documentHTML}</body>
        </html>
    `], { type: 'application/msword' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.documentTitle || 'Document'}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportToExcel(data) {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    csvContent += `Document Title,${data.documentTitle || 'Document'}\n`;
    csvContent += `Document Date,${data.documentDate}\n`;
    if (data.authorName) csvContent += `Author,${data.authorName}\n`;
    if (data.organizationName) csvContent += `Organization,${data.organizationName}\n`;
    csvContent += `\nContent:\n"${data.documentContent || ''}"`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${data.documentTitle || 'Document'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}