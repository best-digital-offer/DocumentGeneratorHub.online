document.addEventListener('DOMContentLoaded', function() {
    // Set default date
    document.getElementById('documentDate').value = new Date().toISOString().split('T')[0];
    
    // Load receipt-specific content
    const dynamicContent = document.getElementById('dynamicContent');
    dynamicContent.innerHTML = `
        <div class="form-section">
            <h3>Receipt Details</h3>
            <div class="form-row">
                <div class="form-group">
                    <label for="receiptNumber" class="form-label">Receipt Number *</label>
                    <input type="text" id="receiptNumber" name="receiptNumber" class="form-input" required placeholder="REC-001">
                </div>
                <div class="form-group">
                    <label for="paymentMethod" class="form-label">Payment Method *</label>
                    <select id="paymentMethod" name="paymentMethod" class="form-select" required>
                        <option value="">Select payment method</option>
                        <option value="Cash">Cash</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Debit Card">Debit Card</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Check">Check</option>
                        <option value="Online Payment">Online Payment</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="amount" class="form-label">Amount *</label>
                    <input type="number" id="amount" name="amount" class="form-input" required min="0" step="0.01" placeholder="0.00">
                </div>
                <div class="form-group">
                    <label for="currency" class="form-label">Currency *</label>
                    <select id="currency" name="currency" class="form-select" required>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="INR">INR (₹)</option>
                    </select>
                </div>
            </div>
        </div>
        
        <div class="form-section">
            <h3>Payer Information</h3>
            <div class="form-row">
                <div class="form-group">
                    <label for="payerName" class="form-label">Payer Name *</label>
                    <input type="text" id="payerName" name="payerName" class="form-input" required placeholder="Enter payer name">
                </div>
                <div class="form-group">
                    <label for="payerEmail" class="form-label">Payer Email</label>
                    <input type="email" id="payerEmail" name="payerEmail" class="form-input" placeholder="payer@example.com">
                </div>
            </div>
        </div>
        
        <div class="form-section">
            <h3>Recipient Information</h3>
            <div class="form-row">
                <div class="form-group">
                    <label for="recipientName" class="form-label">Recipient Name *</label>
                    <input type="text" id="recipientName" name="recipientName" class="form-input" required placeholder="Enter recipient name">
                </div>
                <div class="form-group">
                    <label for="recipientAddress" class="form-label">Recipient Address</label>
                    <textarea id="recipientAddress" name="recipientAddress" class="form-textarea" placeholder="Enter recipient address" rows="2"></textarea>
                </div>
            </div>
        </div>
        
        <div class="form-section">
            <h3>Payment Description</h3>
            <div class="form-group">
                <label for="description" class="form-label">Description *</label>
                <textarea id="description" name="description" class="form-textarea" required placeholder="Payment for services/products" rows="3"></textarea>
            </div>
        </div>
    `;
    
    // Generate receipt number
    const receiptNum = 'REC-' + Date.now().toString().slice(-8);
    document.getElementById('receiptNumber').value = receiptNum;
    
    // Setup event listeners for buttons
    document.getElementById('previewDocument').addEventListener('click', previewDocument);
    document.getElementById('generatePDF').addEventListener('click', () => exportDocument('pdf'));
    document.getElementById('generateWord').addEventListener('click', () => exportDocument('word'));
    document.getElementById('generateExcel').addEventListener('click', () => exportDocument('excel'));
    
    // Override document generation
    window.generateDocumentHTML = function(data) {
        const currencySymbols = { 'USD': '$', 'EUR': '€', 'GBP': '£', 'INR': '₹' };
        const symbol = currencySymbols[data.currency] || '$';
        
        return `
            <div class="receipt" style="border: 2px solid var(--primary-color); padding: 2rem; max-width: 600px; margin: 0 auto;">
                <div class="receipt-header" style="text-align: center; margin-bottom: 2rem; border-bottom: 2px solid var(--primary-color); padding-bottom: 1rem;">
                    <h1 style="color: var(--primary-color); margin-bottom: 0.5rem;">RECEIPT</h1>
                    <p style="margin: 0; font-weight: 600;">Receipt #${data.receiptNumber}</p>
                    <p style="margin: 0.25rem 0;">Date: ${formatDate(data.documentDate)}</p>
                </div>
                
                <div class="receipt-details" style="margin-bottom: 2rem;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 1.5rem;">
                        <div>
                            <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">Received From:</h3>
                            <p style="font-weight: 600; margin-bottom: 0.25rem;">${data.payerName}</p>
                            ${data.payerEmail ? `<p style="margin: 0;">${data.payerEmail}</p>` : ''}
                        </div>
                        <div>
                            <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">Received By:</h3>
                            <p style="font-weight: 600; margin-bottom: 0.25rem;">${data.recipientName}</p>
                            ${data.recipientAddress ? `<p style="margin: 0; white-space: pre-line;">${data.recipientAddress}</p>` : ''}
                        </div>
                    </div>
                    
                    <div style="background: var(--bg-light); padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                        <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Payment Details:</h3>
                        <p style="margin-bottom: 0.5rem;"><strong>Amount:</strong> ${symbol}${parseFloat(data.amount).toFixed(2)}</p>
                        <p style="margin-bottom: 0.5rem;"><strong>Payment Method:</strong> ${data.paymentMethod}</p>
                        <p style="margin-bottom: 0.5rem;"><strong>Description:</strong></p>
                        <p style="white-space: pre-line; margin-left: 1rem;">${data.description}</p>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                    <p style="font-weight: 600; color: var(--primary-color);">Thank you for your payment!</p>
                    <p style="font-size: 0.875rem; color: var(--text-light);">This receipt serves as proof of payment.</p>
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
    const requiredFields = ['documentTitle', 'documentDate', 'receiptNumber', 'paymentMethod', 'amount', 'currency', 'payerName', 'recipientName', 'description'];
    for (const field of requiredFields) {
        if (!data[field] || data[field].toString().trim() === '') {
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
            <title>Receipt ${data.receiptNumber}</title>
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
    const blob = new Blob([`<!DOCTYPE html><html><head><title>Receipt ${data.receiptNumber}</title></head><body>${documentHTML}</body></html>`], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_${data.receiptNumber}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportToExcel(data) {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `Receipt Number,${data.receiptNumber}\n`;
    csvContent += `Date,${data.documentDate}\n`;
    csvContent += `Payer,${data.payerName}\n`;
    csvContent += `Recipient,${data.recipientName}\n`;
    csvContent += `Amount,${data.amount}\n`;
    csvContent += `Currency,${data.currency}\n`;
    csvContent += `Payment Method,${data.paymentMethod}\n`;
    csvContent += `Description,"${data.description}"\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Receipt_${data.receiptNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}