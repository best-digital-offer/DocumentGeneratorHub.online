/**
 * Invoice Generator JavaScript
 * Handles invoice creation, calculations, and export functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeInvoiceGenerator();
});

function initializeInvoiceGenerator() {
    // Set default date to today
    document.getElementById('invoiceDate').value = new Date().toISOString().split('T')[0];
    
    // Set default due date to 30 days from today
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    document.getElementById('dueDate').value = dueDate.toISOString().split('T')[0];
    
    // Initialize event listeners
    setupEventListeners();
    
    // Calculate initial totals
    calculateTotals();
}

function setupEventListeners() {
    // Add item functionality
    document.getElementById('addItem').addEventListener('click', addNewItem);
    
    // Remove item functionality (event delegation)
    document.getElementById('itemsContainer').addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item')) {
            removeItem(e.target);
        }
    });
    
    // Calculate totals when inputs change
    document.getElementById('itemsContainer').addEventListener('input', function(e) {
        if (e.target.classList.contains('quantity-input') || e.target.classList.contains('rate-input')) {
            calculateItemAmount(e.target);
            calculateTotals();
        }
    });
    
    // Tax calculation
    document.getElementById('taxRate').addEventListener('input', calculateTotals);
    document.getElementById('taxType').addEventListener('change', calculateTotals);
    
    // Currency change
    document.getElementById('currency').addEventListener('change', function() {
        updateCurrencyDisplay();
        calculateTotals();
    });
    
    // Preview and export buttons
    document.getElementById('previewInvoice').addEventListener('click', previewInvoice);
    document.getElementById('generatePDF').addEventListener('click', () => exportInvoice('pdf'));
    document.getElementById('generateWord').addEventListener('click', () => exportInvoice('word'));
    document.getElementById('generateExcel').addEventListener('click', () => exportInvoice('excel'));
    
    // Auto-generate invoice number
    generateInvoiceNumber();
}

function addNewItem() {
    const container = document.getElementById('itemsContainer');
    const itemRow = document.createElement('div');
    itemRow.className = 'item-row';
    
    itemRow.innerHTML = `
        <div class="form-row">
            <div class="form-group flex-2">
                <label class="form-label">Description *</label>
                <input type="text" name="itemDescription[]" class="form-input" required placeholder="Item or service description">
            </div>
            <div class="form-group">
                <label class="form-label">Quantity *</label>
                <input type="number" name="itemQuantity[]" class="form-input quantity-input" required min="1" value="1">
            </div>
            <div class="form-group">
                <label class="form-label">Rate *</label>
                <input type="number" name="itemRate[]" class="form-input rate-input" required min="0" step="0.01" placeholder="0.00">
            </div>
            <div class="form-group">
                <label class="form-label">Amount</label>
                <input type="text" name="itemAmount[]" class="form-input amount-display" readonly>
            </div>
            <div class="form-group">
                <button type="button" class="btn-small remove-item" style="margin-top: 1.5rem;">Remove</button>
            </div>
        </div>
    `;
    
    container.appendChild(itemRow);
}

function removeItem(button) {
    const itemRow = button.closest('.item-row');
    const container = document.getElementById('itemsContainer');
    
    // Don't remove if it's the last item
    if (container.children.length > 1) {
        itemRow.remove();
        calculateTotals();
    } else {
        alert('You must have at least one item in the invoice.');
    }
}

function calculateItemAmount(input) {
    const itemRow = input.closest('.item-row');
    const quantity = parseFloat(itemRow.querySelector('.quantity-input').value) || 0;
    const rate = parseFloat(itemRow.querySelector('.rate-input').value) || 0;
    const amount = quantity * rate;
    
    const amountDisplay = itemRow.querySelector('.amount-display');
    amountDisplay.value = formatCurrency(amount);
}

function calculateTotals() {
    const items = document.querySelectorAll('.item-row');
    let subtotal = 0;
    
    // Calculate subtotal
    items.forEach(item => {
        const quantity = parseFloat(item.querySelector('.quantity-input').value) || 0;
        const rate = parseFloat(item.querySelector('.rate-input').value) || 0;
        subtotal += quantity * rate;
    });
    
    // Calculate tax
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    const taxAmount = (subtotal * taxRate) / 100;
    
    // Calculate total
    const total = subtotal + taxAmount;
    
    // Update display
    document.getElementById('subtotalDisplay').textContent = formatCurrency(subtotal);
    document.getElementById('taxDisplay').textContent = formatCurrency(taxAmount);
    document.getElementById('totalDisplay').textContent = formatCurrency(total);
}

function formatCurrency(amount) {
    const currency = document.getElementById('currency').value;
    const currencySymbols = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'INR': '₹',
        'CAD': 'C$',
        'AUD': 'A$'
    };
    
    const symbol = currencySymbols[currency] || '$';
    return symbol + amount.toFixed(2);
}

function updateCurrencyDisplay() {
    calculateTotals();
    
    // Update all amount displays
    document.querySelectorAll('.amount-display').forEach(display => {
        const itemRow = display.closest('.item-row');
        const quantity = parseFloat(itemRow.querySelector('.quantity-input').value) || 0;
        const rate = parseFloat(itemRow.querySelector('.rate-input').value) || 0;
        const amount = quantity * rate;
        display.value = formatCurrency(amount);
    });
}

function generateInvoiceNumber() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    const invoiceNumber = `INV-${year}${month}${day}-${random}`;
    document.getElementById('invoiceNumber').value = invoiceNumber;
}

function previewInvoice() {
    const formData = collectFormData();
    if (!validateFormData(formData)) {
        return;
    }
    
    const previewHTML = generateInvoiceHTML(formData);
    document.getElementById('invoicePreview').innerHTML = previewHTML;
    document.getElementById('previewContainer').style.display = 'block';
    
    // Scroll to preview
    document.getElementById('previewContainer').scrollIntoView({ behavior: 'smooth' });
}

function collectFormData() {
    const form = document.getElementById('invoiceForm');
    const formData = new FormData(form);
    
    // Collect items
    const items = [];
    const descriptions = formData.getAll('itemDescription[]');
    const quantities = formData.getAll('itemQuantity[]');
    const rates = formData.getAll('itemRate[]');
    
    for (let i = 0; i < descriptions.length; i++) {
        if (descriptions[i].trim()) {
            items.push({
                description: descriptions[i],
                quantity: parseFloat(quantities[i]) || 0,
                rate: parseFloat(rates[i]) || 0,
                amount: (parseFloat(quantities[i]) || 0) * (parseFloat(rates[i]) || 0)
            });
        }
    }
    
    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxRate = parseFloat(formData.get('taxRate')) || 0;
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;
    
    return {
        businessName: formData.get('businessName'),
        businessEmail: formData.get('businessEmail'),
        businessAddress: formData.get('businessAddress'),
        businessPhone: formData.get('businessPhone'),
        gstNumber: formData.get('gstNumber'),
        clientName: formData.get('clientName'),
        clientEmail: formData.get('clientEmail'),
        clientAddress: formData.get('clientAddress'),
        invoiceNumber: formData.get('invoiceNumber'),
        invoiceDate: formData.get('invoiceDate'),
        dueDate: formData.get('dueDate'),
        currency: formData.get('currency'),
        items: items,
        taxType: formData.get('taxType'),
        taxRate: taxRate,
        notes: formData.get('notes'),
        subtotal: subtotal,
        taxAmount: taxAmount,
        total: total
    };
}

function validateFormData(data) {
    const requiredFields = ['businessName', 'businessEmail', 'businessAddress', 'clientName', 'clientAddress', 'invoiceNumber', 'invoiceDate'];
    
    for (const field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
            return false;
        }
    }
    
    if (data.items.length === 0) {
        alert('Please add at least one item to the invoice');
        return false;
    }
    
    return true;
}

function generateInvoiceHTML(data) {
    const currencySymbols = {
        'USD': '$', 'EUR': '€', 'GBP': '£', 'INR': '₹', 'CAD': 'C$', 'AUD': 'A$'
    };
    const symbol = currencySymbols[data.currency] || '$';
    
    return `
        <div class="invoice-header">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 2rem;">
                <div>
                    <h1 style="color: var(--primary-color); margin-bottom: 0.5rem;">INVOICE</h1>
                    <p style="margin: 0; color: var(--text-light);">Invoice #${data.invoiceNumber}</p>
                </div>
                <div style="text-align: right;">
                    <h2 style="margin-bottom: 0.5rem;">${data.businessName}</h2>
                    <p style="margin: 0; white-space: pre-line;">${data.businessAddress}</p>
                    ${data.businessPhone ? `<p style="margin: 0.25rem 0;">Phone: ${data.businessPhone}</p>` : ''}
                    <p style="margin: 0.25rem 0;">Email: ${data.businessEmail}</p>
                    ${data.gstNumber ? `<p style="margin: 0.25rem 0;">GST/VAT: ${data.gstNumber}</p>` : ''}
                </div>
            </div>
        </div>
        
        <div class="invoice-details" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
            <div>
                <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">Bill To:</h3>
                <p style="font-weight: 600; margin-bottom: 0.25rem;">${data.clientName}</p>
                <p style="margin: 0; white-space: pre-line;">${data.clientAddress}</p>
                ${data.clientEmail ? `<p style="margin: 0.25rem 0;">Email: ${data.clientEmail}</p>` : ''}
            </div>
            <div style="text-align: right;">
                <p><strong>Invoice Date:</strong> ${formatDate(data.invoiceDate)}</p>
                ${data.dueDate ? `<p><strong>Due Date:</strong> ${formatDate(data.dueDate)}</p>` : ''}
                <p><strong>Currency:</strong> ${data.currency}</p>
            </div>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 2rem;">
            <thead>
                <tr style="background: var(--primary-color); color: white;">
                    <th style="padding: 0.75rem; text-align: left; border: 1px solid var(--border-color);">Description</th>
                    <th style="padding: 0.75rem; text-align: center; border: 1px solid var(--border-color);">Qty</th>
                    <th style="padding: 0.75rem; text-align: right; border: 1px solid var(--border-color);">Rate</th>
                    <th style="padding: 0.75rem; text-align: right; border: 1px solid var(--border-color);">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${data.items.map(item => `
                    <tr>
                        <td style="padding: 0.75rem; border: 1px solid var(--border-color);">${item.description}</td>
                        <td style="padding: 0.75rem; text-align: center; border: 1px solid var(--border-color);">${item.quantity}</td>
                        <td style="padding: 0.75rem; text-align: right; border: 1px solid var(--border-color);">${symbol}${item.rate.toFixed(2)}</td>
                        <td style="padding: 0.75rem; text-align: right; border: 1px solid var(--border-color);">${symbol}${item.amount.toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div style="display: flex; justify-content: flex-end;">
            <div style="min-width: 300px;">
                <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">
                    <span>Subtotal:</span>
                    <span>${symbol}${data.subtotal.toFixed(2)}</span>
                </div>
                ${data.taxRate > 0 ? `
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">
                        <span>${data.taxType.toUpperCase()} (${data.taxRate}%):</span>
                        <span>${symbol}${data.taxAmount.toFixed(2)}</span>
                    </div>
                ` : ''}
                <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; font-weight: 600; font-size: 1.125rem; color: var(--primary-color); border-top: 2px solid var(--primary-color);">
                    <span>Total:</span>
                    <span>${symbol}${data.total.toFixed(2)}</span>
                </div>
            </div>
        </div>
        
        ${data.notes ? `
            <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                <h4>Notes:</h4>
                <p style="white-space: pre-line;">${data.notes}</p>
            </div>
        ` : ''}
        
        <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--border-color); text-align: center; color: var(--text-light); font-size: 0.875rem;">
            <p>Thank you for your business!</p>
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

function exportInvoice(format) {
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
    // Create a new window with the invoice content
    const printWindow = window.open('', '_blank');
    const invoiceHTML = generateInvoiceHTML(data);
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice ${data.invoiceNumber}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .invoice-preview { max-width: 800px; margin: 0 auto; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 8px; border: 1px solid #ddd; }
                th { background-color: #2563eb; color: white; }
                .total-row { font-weight: bold; }
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="invoice-preview">${invoiceHTML}</div>
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
    const invoiceHTML = generateInvoiceHTML(data);
    const blob = new Blob([`
        <!DOCTYPE html>
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
        <head>
            <meta charset='utf-8'>
            <title>Invoice ${data.invoiceNumber}</title>
        </head>
        <body>${invoiceHTML}</body>
        </html>
    `], { type: 'application/msword' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${data.invoiceNumber}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportToExcel(data) {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add header information
    csvContent += `Invoice Number,${data.invoiceNumber}\n`;
    csvContent += `Invoice Date,${data.invoiceDate}\n`;
    csvContent += `Due Date,${data.dueDate || 'N/A'}\n`;
    csvContent += `Business Name,${data.businessName}\n`;
    csvContent += `Client Name,${data.clientName}\n`;
    csvContent += `Currency,${data.currency}\n\n`;
    
    // Add items header
    csvContent += "Description,Quantity,Rate,Amount\n";
    
    // Add items
    data.items.forEach(item => {
        csvContent += `"${item.description}",${item.quantity},${item.rate},${item.amount}\n`;
    });
    
    // Add totals
    csvContent += `\nSubtotal,,${data.subtotal}\n`;
    if (data.taxRate > 0) {
        csvContent += `${data.taxType.toUpperCase()} (${data.taxRate}%),,${data.taxAmount}\n`;
    }
    csvContent += `Total,,${data.total}\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Invoice_${data.invoiceNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}