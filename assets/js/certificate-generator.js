document.addEventListener('DOMContentLoaded', function() {
    // Set default date
    document.getElementById('documentDate').value = new Date().toISOString().split('T')[0];
    
    // Load certificate-specific content
    const dynamicContent = document.getElementById('dynamicContent');
    dynamicContent.innerHTML = `
        <div class="form-section">
            <h3>Certificate Details</h3>
            <div class="form-group">
                <label for="certificateType" class="form-label">Certificate Type *</label>
                <select id="certificateType" name="certificateType" class="form-select" required>
                    <option value="">Select certificate type</option>
                    <option value="Course Completion">Course Completion</option>
                    <option value="Achievement">Achievement</option>
                    <option value="Participation">Participation</option>
                    <option value="Excellence">Excellence</option>
                    <option value="Training">Training</option>
                    <option value="Workshop">Workshop</option>
                </select>
            </div>
            <div class="form-group">
                <label for="recipientName" class="form-label">Recipient Name *</label>
                <input type="text" id="recipientName" name="recipientName" class="form-input" required placeholder="Enter recipient's full name">
            </div>
            <div class="form-group">
                <label for="courseName" class="form-label">Course/Program Name *</label>
                <input type="text" id="courseName" name="courseName" class="form-input" required placeholder="Enter course or program name">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="completionDate" class="form-label">Completion Date</label>
                    <input type="date" id="completionDate" name="completionDate" class="form-input">
                </div>
                <div class="form-group">
                    <label for="duration" class="form-label">Duration</label>
                    <input type="text" id="duration" name="duration" class="form-input" placeholder="e.g., 40 hours, 3 months">
                </div>
            </div>
        </div>
        
        <div class="form-section">
            <h3>Issuing Organization</h3>
            <div class="form-group">
                <label for="organizationName" class="form-label">Organization Name *</label>
                <input type="text" id="organizationName" name="organizationName" class="form-input" required placeholder="Enter organization name">
            </div>
            <div class="form-group">
                <label for="signatoryName" class="form-label">Signatory Name</label>
                <input type="text" id="signatoryName" name="signatoryName" class="form-input" placeholder="Name of person signing the certificate">
            </div>
            <div class="form-group">
                <label for="signatoryTitle" class="form-label">Signatory Title</label>
                <input type="text" id="signatoryTitle" name="signatoryTitle" class="form-input" placeholder="e.g., Director, CEO, Manager">
            </div>
        </div>
        
        <div class="form-section">
            <h3>Additional Information</h3>
            <div class="form-group">
                <label for="certificateId" class="form-label">Certificate ID</label>
                <input type="text" id="certificateId" name="certificateId" class="form-input" placeholder="Unique certificate identifier">
            </div>
            <div class="form-group">
                <label for="additionalText" class="form-label">Additional Text</label>
                <textarea id="additionalText" name="additionalText" class="form-textarea" placeholder="Any additional information or achievements" rows="3"></textarea>
            </div>
        </div>
    `;
    
    // Generate certificate ID
    const certId = 'CERT-' + Date.now().toString().slice(-8);
    document.getElementById('certificateId').value = certId;
    
    // Setup event listeners for buttons
    document.getElementById('previewDocument').addEventListener('click', previewDocument);
    document.getElementById('generatePDF').addEventListener('click', () => exportDocument('pdf'));
    document.getElementById('generateWord').addEventListener('click', () => exportDocument('word'));
    document.getElementById('generateExcel').addEventListener('click', () => exportDocument('excel'));
    
    // Override document generation
    window.generateDocumentHTML = function(data) {
        return `
            <div class="certificate" style="border: 8px solid var(--primary-color); padding: 3rem; text-align: center; background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%); min-height: 600px; display: flex; flex-direction: column; justify-content: center;">
                <div style="border: 2px solid var(--primary-color); padding: 2rem; background: white;">
                    <h1 style="color: var(--primary-color); font-size: 2.5rem; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 2px;">Certificate</h1>
                    <h2 style="color: var(--secondary-color); margin-bottom: 2rem; font-size: 1.5rem;">of ${data.certificateType}</h2>
                    
                    <div style="margin: 2rem 0;">
                        <p style="font-size: 1.125rem; margin-bottom: 1rem;">This is to certify that</p>
                        <h3 style="color: var(--primary-color); font-size: 2rem; margin: 1rem 0; text-decoration: underline; text-decoration-color: var(--secondary-color);">${data.recipientName}</h3>
                        <p style="font-size: 1.125rem; margin-bottom: 1rem;">has successfully completed</p>
                        <h4 style="color: var(--text-dark); font-size: 1.5rem; margin: 1rem 0; font-style: italic;">${data.courseName}</h4>
                    </div>
                    
                    ${data.duration ? `<p style="margin: 1rem 0;">Duration: ${data.duration}</p>` : ''}
                    ${data.completionDate ? `<p style="margin: 1rem 0;">Completed on: ${formatDate(data.completionDate)}</p>` : ''}
                    ${data.additionalText ? `<p style="margin: 1rem 0; font-style: italic;">${data.additionalText}</p>` : ''}
                    
                    <div style="margin-top: 3rem; display: flex; justify-content: space-between; align-items: end;">
                        <div style="text-align: left;">
                            <p style="margin-bottom: 0.5rem; font-size: 0.875rem;">Date: ${formatDate(data.documentDate)}</p>
                            ${data.certificateId ? `<p style="font-size: 0.875rem;">Certificate ID: ${data.certificateId}</p>` : ''}
                        </div>
                        
                        <div style="text-align: right;">
                            <div style="border-top: 2px solid var(--text-dark); width: 200px; margin-bottom: 0.5rem;"></div>
                            ${data.signatoryName ? `<p style="font-weight: 600; margin-bottom: 0.25rem;">${data.signatoryName}</p>` : ''}
                            ${data.signatoryTitle ? `<p style="font-size: 0.875rem; color: var(--text-light);">${data.signatoryTitle}</p>` : ''}
                            <p style="font-weight: 600; margin-top: 0.5rem;">${data.organizationName}</p>
                        </div>
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
    const requiredFields = ['documentTitle', 'documentDate', 'certificateType', 'recipientName', 'courseName', 'organizationName'];
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
            <title>Certificate - ${data.recipientName}</title>
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
    const blob = new Blob([`<!DOCTYPE html><html><head><title>Certificate - ${data.recipientName}</title></head><body>${documentHTML}</body></html>`], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificate_${data.recipientName}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportToExcel(data) {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `Certificate Type,${data.certificateType}\n`;
    csvContent += `Recipient,${data.recipientName}\n`;
    csvContent += `Course,${data.courseName}\n`;
    csvContent += `Organization,${data.organizationName}\n`;
    csvContent += `Date,${data.documentDate}\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Certificate_${data.recipientName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}