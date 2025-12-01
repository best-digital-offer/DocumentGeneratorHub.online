document.addEventListener('DOMContentLoaded', function() {
    // Set default date
    document.getElementById('documentDate').value = new Date().toISOString().split('T')[0];
    
    // Load contract-specific content
    const dynamicContent = document.getElementById('dynamicContent');
    dynamicContent.innerHTML = `
        <div class="form-section">
            <h3>Contract Parties</h3>
            <div class="form-row">
                <div class="form-group">
                    <label for="party1Name" class="form-label">First Party Name *</label>
                    <input type="text" id="party1Name" name="party1Name" class="form-input" required placeholder="Enter first party name">
                </div>
                <div class="form-group">
                    <label for="party2Name" class="form-label">Second Party Name *</label>
                    <input type="text" id="party2Name" name="party2Name" class="form-input" required placeholder="Enter second party name">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="party1Address" class="form-label">First Party Address</label>
                    <textarea id="party1Address" name="party1Address" class="form-textarea" placeholder="Enter first party address" rows="2"></textarea>
                </div>
                <div class="form-group">
                    <label for="party2Address" class="form-label">Second Party Address</label>
                    <textarea id="party2Address" name="party2Address" class="form-textarea" placeholder="Enter second party address" rows="2"></textarea>
                </div>
            </div>
        </div>
        
        <div class="form-section">
            <h3>Contract Details</h3>
            <div class="form-group">
                <label for="contractType" class="form-label">Contract Type *</label>
                <select id="contractType" name="contractType" class="form-select" required>
                    <option value="">Select contract type</option>
                    <option value="Service Agreement">Service Agreement</option>
                    <option value="Employment Contract">Employment Contract</option>
                    <option value="Sales Contract">Sales Contract</option>
                    <option value="Lease Agreement">Lease Agreement</option>
                    <option value="Partnership Agreement">Partnership Agreement</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="contractValue" class="form-label">Contract Value</label>
                    <input type="number" id="contractValue" name="contractValue" class="form-input" min="0" step="0.01" placeholder="0.00">
                </div>
                <div class="form-group">
                    <label for="contractDuration" class="form-label">Duration</label>
                    <input type="text" id="contractDuration" name="contractDuration" class="form-input" placeholder="e.g., 12 months, 2 years">
                </div>
            </div>
            <div class="form-group">
                <label for="contractTerms" class="form-label">Terms and Conditions *</label>
                <textarea id="contractTerms" name="contractTerms" class="form-textarea" required placeholder="Enter detailed terms and conditions" rows="6"></textarea>
            </div>
        </div>
    `;
    
    // Setup event listeners for buttons
    document.getElementById('previewDocument').addEventListener('click', previewDocument);
    document.getElementById('generatePDF').addEventListener('click', () => exportDocument('pdf'));
    document.getElementById('generateWord').addEventListener('click', () => exportDocument('word'));
    document.getElementById('generateExcel').addEventListener('click', () => exportDocument('excel'));
    
    // Override document generation
    window.generateDocumentHTML = function(data) {
        return `
            <div class="contract-header" style="text-align: center; margin-bottom: 2rem;">
                <h1 style="color: var(--primary-color);">${data.contractType || 'CONTRACT'}</h1>
                <p>Date: ${formatDate(data.documentDate)}</p>
            </div>
            
            <div class="contract-parties" style="margin-bottom: 2rem;">
                <p><strong>This contract is entered into between:</strong></p>
                <p><strong>First Party:</strong> ${data.party1Name}<br>
                ${data.party1Address ? `Address: ${data.party1Address}` : ''}</p>
                <p><strong>Second Party:</strong> ${data.party2Name}<br>
                ${data.party2Address ? `Address: ${data.party2Address}` : ''}</p>
            </div>
            
            ${data.contractValue ? `<p><strong>Contract Value:</strong> $${parseFloat(data.contractValue).toFixed(2)}</p>` : ''}
            ${data.contractDuration ? `<p><strong>Duration:</strong> ${data.contractDuration}</p>` : ''}
            
            <div class="contract-terms" style="margin: 2rem 0;">
                <h3>Terms and Conditions:</h3>
                <div style="white-space: pre-line; margin-top: 1rem;">${data.contractTerms}</div>
            </div>
            
            <div class="signatures" style="margin-top: 3rem; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <div style="border-top: 1px solid #000; padding-top: 0.5rem; text-align: center;">
                    <p><strong>${data.party1Name}</strong><br>First Party Signature</p>
                </div>
                <div style="border-top: 1px solid #000; padding-top: 0.5rem; text-align: center;">
                    <p><strong>${data.party2Name}</strong><br>Second Party Signature</p>
                </div>
            </div>
        `;
    };
});

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
}

function previewDocument() {
    const formData = collectFormData();
    if (!validateFormData(formData)) return;
    
    const previewHTML = generateDocumentHTML(formData);
    document.getElementById('documentPreview').innerHTML = previewHTML;
    document.getElementById('previewContainer').style.display = 'block';
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
    const requiredFields = ['documentTitle', 'documentDate', 'party1Name', 'party2Name', 'contractType', 'contractTerms'];
    for (const field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
            return false;
        }
    }
    return true;
}

function exportDocument(format) {
    const formData = collectFormData();
    if (!validateFormData(formData)) return;
    
    switch (format) {
        case 'pdf': exportToPDF(formData); break;
        case 'word': exportToWord(formData); break;
        case 'excel': exportToExcel(formData); break;
    }
}

function exportToPDF(data) {
    const printWindow = window.open('', '_blank');
    const documentHTML = generateDocumentHTML(data);
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${data.documentTitle}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                @media print { body { margin: 0; } .no-print { display: none; } }
            </style>
        </head>
        <body>
            ${documentHTML}
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
    const blob = new Blob([`<!DOCTYPE html><html><head><title>${data.documentTitle}</title></head><body>${documentHTML}</body></html>`], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.documentTitle}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportToExcel(data) {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `Contract Title,${data.documentTitle}\n`;
    csvContent += `Date,${data.documentDate}\n`;
    csvContent += `First Party,${data.party1Name}\n`;
    csvContent += `Second Party,${data.party2Name}\n`;
    csvContent += `Contract Type,${data.contractType}\n`;
    csvContent += `Terms,"${data.contractTerms}"\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${data.documentTitle}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}