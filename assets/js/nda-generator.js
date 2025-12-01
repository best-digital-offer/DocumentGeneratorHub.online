document.addEventListener('DOMContentLoaded', function() {
    // Set default date
    document.getElementById('documentDate').value = new Date().toISOString().split('T')[0];
    
    // Load NDA-specific content
    const dynamicContent = document.getElementById('dynamicContent');
    dynamicContent.innerHTML = `
        <div class="form-section">
            <h3>Parties Information</h3>
            <div class="form-row">
                <div class="form-group">
                    <label for="disclosingParty" class="form-label">Disclosing Party *</label>
                    <input type="text" id="disclosingParty" name="disclosingParty" class="form-input" required placeholder="Company/Individual disclosing information">
                </div>
                <div class="form-group">
                    <label for="receivingParty" class="form-label">Receiving Party *</label>
                    <input type="text" id="receivingParty" name="receivingParty" class="form-input" required placeholder="Company/Individual receiving information">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="disclosingAddress" class="form-label">Disclosing Party Address</label>
                    <textarea id="disclosingAddress" name="disclosingAddress" class="form-textarea" placeholder="Address of disclosing party" rows="2"></textarea>
                </div>
                <div class="form-group">
                    <label for="receivingAddress" class="form-label">Receiving Party Address</label>
                    <textarea id="receivingAddress" name="receivingAddress" class="form-textarea" placeholder="Address of receiving party" rows="2"></textarea>
                </div>
            </div>
        </div>
        
        <div class="form-section">
            <h3>NDA Details</h3>
            <div class="form-row">
                <div class="form-group">
                    <label for="ndaType" class="form-label">NDA Type *</label>
                    <select id="ndaType" name="ndaType" class="form-select" required>
                        <option value="">Select NDA type</option>
                        <option value="Unilateral">Unilateral (One-way)</option>
                        <option value="Bilateral">Bilateral (Mutual)</option>
                        <option value="Multilateral">Multilateral</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="duration" class="form-label">Duration *</label>
                    <select id="duration" name="duration" class="form-select" required>
                        <option value="">Select duration</option>
                        <option value="1 year">1 year</option>
                        <option value="2 years">2 years</option>
                        <option value="3 years">3 years</option>
                        <option value="5 years">5 years</option>
                        <option value="Indefinite">Indefinite</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="purpose" class="form-label">Purpose of Disclosure *</label>
                <textarea id="purpose" name="purpose" class="form-textarea" required placeholder="Describe the purpose for which confidential information will be shared" rows="3"></textarea>
            </div>
        </div>
        
        <div class="form-section">
            <h3>Confidential Information</h3>
            <div class="form-group">
                <label for="confidentialInfo" class="form-label">Definition of Confidential Information *</label>
                <textarea id="confidentialInfo" name="confidentialInfo" class="form-textarea" required placeholder="Define what constitutes confidential information" rows="4"></textarea>
            </div>
            <div class="form-group">
                <label for="exceptions" class="form-label">Exceptions</label>
                <textarea id="exceptions" name="exceptions" class="form-textarea" placeholder="Information that is not considered confidential" rows="3"></textarea>
            </div>
        </div>
        
        <div class="form-section">
            <h3>Additional Terms</h3>
            <div class="form-group">
                <label for="additionalTerms" class="form-label">Additional Terms and Conditions</label>
                <textarea id="additionalTerms" name="additionalTerms" class="form-textarea" placeholder="Any additional terms, conditions, or obligations" rows="4"></textarea>
            </div>
            <div class="form-group">
                <label for="governingLaw" class="form-label">Governing Law</label>
                <input type="text" id="governingLaw" name="governingLaw" class="form-input" placeholder="e.g., State of California, United States">
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
            <div class="nda-document" style="max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6;">
                <div class="nda-header" style="text-align: center; margin-bottom: 2rem;">
                    <h1 style="color: var(--primary-color); margin-bottom: 0.5rem;">NON-DISCLOSURE AGREEMENT</h1>
                    <h2 style="font-size: 1.25rem; margin-bottom: 1rem;">(${data.ndaType})</h2>
                    <p>Date: ${formatDate(data.documentDate)}</p>
                </div>
                
                <div class="nda-parties" style="margin-bottom: 2rem;">
                    <p><strong>This Non-Disclosure Agreement ("Agreement") is entered into between:</strong></p>
                    
                    <div style="margin: 1.5rem 0;">
                        <p><strong>Disclosing Party:</strong> ${data.disclosingParty}</p>
                        ${data.disclosingAddress ? `<p style="margin-left: 1rem;">${data.disclosingAddress}</p>` : ''}
                    </div>
                    
                    <div style="margin: 1.5rem 0;">
                        <p><strong>Receiving Party:</strong> ${data.receivingParty}</p>
                        ${data.receivingAddress ? `<p style="margin-left: 1rem;">${data.receivingAddress}</p>` : ''}
                    </div>
                </div>
                
                <div class="nda-content" style="margin-bottom: 2rem;">
                    <h3 style="color: var(--primary-color);">1. Purpose</h3>
                    <p style="margin-bottom: 1.5rem;">${data.purpose}</p>
                    
                    <h3 style="color: var(--primary-color);">2. Definition of Confidential Information</h3>
                    <p style="margin-bottom: 1.5rem;">${data.confidentialInfo}</p>
                    
                    ${data.exceptions ? `
                        <h3 style="color: var(--primary-color);">3. Exceptions</h3>
                        <p style="margin-bottom: 1.5rem;">${data.exceptions}</p>
                    ` : ''}
                    
                    <h3 style="color: var(--primary-color);">4. Obligations of Receiving Party</h3>
                    <p style="margin-bottom: 1rem;">The Receiving Party agrees to:</p>
                    <ul style="margin-bottom: 1.5rem;">
                        <li>Hold and maintain the Confidential Information in strict confidence</li>
                        <li>Not disclose the Confidential Information to any third parties</li>
                        <li>Use the Confidential Information solely for the purpose stated above</li>
                        <li>Take reasonable precautions to protect the confidentiality of the information</li>
                    </ul>
                    
                    <h3 style="color: var(--primary-color);">5. Duration</h3>
                    <p style="margin-bottom: 1.5rem;">This Agreement shall remain in effect for ${data.duration} from the date of execution.</p>
                    
                    ${data.additionalTerms ? `
                        <h3 style="color: var(--primary-color);">6. Additional Terms</h3>
                        <p style="margin-bottom: 1.5rem; white-space: pre-line;">${data.additionalTerms}</p>
                    ` : ''}
                    
                    ${data.governingLaw ? `
                        <h3 style="color: var(--primary-color);">7. Governing Law</h3>
                        <p style="margin-bottom: 1.5rem;">This Agreement shall be governed by the laws of ${data.governingLaw}.</p>
                    ` : ''}
                </div>
                
                <div class="signatures" style="margin-top: 3rem; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                    <div style="text-align: center;">
                        <div style="border-top: 1px solid #000; margin-bottom: 0.5rem;"></div>
                        <p><strong>${data.disclosingParty}</strong></p>
                        <p>Disclosing Party</p>
                        <p>Date: _______________</p>
                    </div>
                    <div style="text-align: center;">
                        <div style="border-top: 1px solid #000; margin-bottom: 0.5rem;"></div>
                        <p><strong>${data.receivingParty}</strong></p>
                        <p>Receiving Party</p>
                        <p>Date: _______________</p>
                    </div>
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
    const requiredFields = ['documentTitle', 'documentDate', 'disclosingParty', 'receivingParty', 'ndaType', 'duration', 'purpose', 'confidentialInfo'];
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
            <title>NDA - ${data.disclosingParty} & ${data.receivingParty}</title>
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
    const blob = new Blob([`<!DOCTYPE html><html><head><title>NDA</title></head><body>${documentHTML}</body></html>`], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NDA_${data.disclosingParty}_${data.receivingParty}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportToExcel(data) {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `NDA Type,${data.ndaType}\n`;
    csvContent += `Disclosing Party,${data.disclosingParty}\n`;
    csvContent += `Receiving Party,${data.receivingParty}\n`;
    csvContent += `Duration,${data.duration}\n`;
    csvContent += `Purpose,"${data.purpose}"\n`;
    csvContent += `Confidential Info,"${data.confidentialInfo}"\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NDA_${data.disclosingParty}_${data.receivingParty}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}