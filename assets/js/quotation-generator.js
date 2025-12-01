/**
 * Quotation Generator JavaScript
 * Handles quotation creation, calculations, and export functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeQuotationGenerator();
});

function initializeQuotationGenerator() {
    // Set default dates
    document.getElementById('quotationDate').value = new Date().toISOString().split('T')[0];
    
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);
    document.getElementById('validUntil').value = validUntil.toISOString().split('T')[0];
    
    // Initialize event listeners
    setupQuotationEventListeners();
    
    // Calculate initial totals
    calculateQuotationTotals();
    
    // Generate quotation number
    generateQuotationNumber();
}

function setupQuotationEventListeners() {
    // Add item functionality
    document.getElementById('addItem').addEventListener('click', addNewQuotationItem);
    
    // Remove item functionality (event delegation)
    document.getElementById('itemsContainer').addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item')) {
            removeQuotationItem(e.target);
        }
    });
    
    // Calculate totals when inputs change
    document.getElementById('itemsContainer').addEventListener('input', function(e) {
        if (e.target.classList.contains('quantity-input') || e.target.classList.contains('rate-input')) {
            calculateQuotationItemAmount(e.target);
            calculateQuotationTotals();
        }
    });
    
    // Discount and tax calculations
    document.getElementById('discountType').addEventListener('change', calculateQuotationTotals);
    document.getElementById('discountValue').addEventListener('input', calculateQuotationTotals);
    document.getElementById('taxRate').addEventListener('input', calculateQuotationTotals);
    document.getElementById('shippingCost').addEventListener('input', calculateQuotationTotals);
    
    // Currency change
    document.getElementById('currency').addEventListener('change', function() {
        updateQuotationCurrencyDisplay();
        calculateQuotationTotals();
    });
    
    // Preview and export buttons
    document.getElementById('previewQuotation').addEventListener('click', previewQuotation);
    document.getElementById('generatePDF').addEventListener('click', () => exportQuotation('pdf'));
    document.getElementById('generateWord').addEventListener('click', () => exportQuotation('word'));
    document.getElementById('generateExcel').addEventListener('click', () => exportQuotation('excel'));
}

function addNewQuotationItem() {
    const container = document.getElementById('itemsContainer');
    const itemRow = document.createElement('div');
    itemRow.className = 'item-row';
    
    itemRow.innerHTML = `
        <div class="form-row">
            <div class="form-group flex-2">
                <label class="form-label">Description *</label>
                <textarea name="itemDescription[]" class="form-textarea" required placeholder="Detailed description of item or service" rows="2"></textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Quantity *</label>
                <input type="number" name="itemQuantity[]" class="form-input quantity-input" required min="1" value="1">
            </div>
            <div class="form-group">
                <label class="form-label">Unit Price *</label>
                <input type="number" name="itemRate[]" class="form-input rate-input" required min="0" step="0.01" placeholder="0.00">
            </div>
            <div class="form-group">
                <label class="form-label">Total</label>
                <input type="text" name="itemAmount[]" class="form-input amount-display" readonly>
            </div>
            <div class="form-group">
                <button type="button" class="btn-small remove-item" style="margin-top: 1.5rem;">Remove</button>
            </div>
        </div>
    `;
    
    container.appendChild(itemRow);
}

function removeQuotationItem(button) {
    const itemRow = button.closest('.item-row');
    const container = document.getElementById('itemsContainer');
    
    if (container.children.length > 1) {
        itemRow.remove();
        calculateQuotationTotals();
    } else {
        alert('You must have at least one item in the quotation.');
    }
}

function calculateQuotationItemAmount(input) {
    const itemRow = input.closest('.item-row');
    const quantity = parseFloat(itemRow.querySelector('.quantity-input').value) || 0;
    const rate = parseFloat(itemRow.querySelector('.rate-input').value) || 0;
    const amount = quantity * rate;
    
    const amountDisplay = itemRow.querySelector('.amount-display');
    amountDisplay.value = formatQuotationCurrency(amount);
}

function calculateQuotationTotals() {
    const items = document.querySelectorAll('.item-row');
    let subtotal = 0;
    
    // Calculate subtotal
    items.forEach(item => {
        const quantity = parseFloat(item.querySelector('.quantity-input').value) || 0;
        const rate = parseFloat(item.querySelector('.rate-input').value) || 0;
        subtotal += quantity * rate;
    });
    
    // Calculate discount
    const discountType = document.getElementById('discountType').value;
    const discountValue = parseFloat(document.getElementById('discountValue').value) || 0;
    let discountAmount = 0;
    
    if (discountType === 'percentage') {
        discountAmount = (subtotal * discountValue) / 100;
    } else if (discountType === 'fixed') {
        discountAmount = discountValue;
    }
    
    // Calculate shipping
    const shippingCost = parseFloat(document.getElementById('shippingCost').value) || 0;
    
    // Calculate tax on (subtotal - discount + shipping)
    const taxableAmount = subtotal - discountAmount + shippingCost;
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    const taxAmount = (taxableAmount * taxRate) / 100;
    
    // Calculate total
    const total = subtotal - discountAmount + shippingCost + taxAmount;
    
    // Update display
    document.getElementById('subtotalDisplay').textContent = formatQuotationCurrency(subtotal);
    document.getElementById('discountDisplay').textContent = formatQuotationCurrency(discountAmount);
    document.getElementById('shippingDisplay').textContent = formatQuotationCurrency(shippingCost);
    document.getElementById('taxDisplay').textContent = formatQuotationCurrency(taxAmount);
    document.getElementById('totalDisplay').textContent = formatQuotationCurrency(total);
}

function formatQuotationCurrency(amount) {
    const currency = document.getElementById('currency').value;
    const currencySymbols = {
        'USD': '$', 'EUR': '€', 'GBP': '£', 'INR': '₹', 'CAD': 'C$', 'AUD': 'A$'
    };
    
    const symbol = currencySymbols[currency] || '$';
    return symbol + amount.toFixed(2);
}

function updateQuotationCurrencyDisplay() {
    calculateQuotationTotals();
    
    document.querySelectorAll('.amount-display').forEach(display => {
        const itemRow = display.closest('.item-row');
        const quantity = parseFloat(itemRow.querySelector('.quantity-input').value) || 0;
        const rate = parseFloat(itemRow.querySelector('.rate-input').value) || 0;
        const amount = quantity * rate;
        display.value = formatQuotationCurrency(amount);
    });
}

function generateQuotationNumber() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    const quotationNumber = `QUO-${year}${month}${day}-${random}`;
    document.getElementById('quotationNumber').value = quotationNumber;
}

function previewQuotation() {
    const formData = collectQuotationFormData();
    if (!validateQuotationFormData(formData)) {
        return;
    }
    
    const previewHTML = generateQuotationHTML(formData);
    document.getElementById('quotationPreview').innerHTML = previewHTML;
    document.getElementById('previewContainer').style.display = 'block';
    
    document.getElementById('previewContainer').scrollIntoView({ behavior: 'smooth' });
}

function collectQuotationFormData() {
    const form = document.getElementById('quotationForm');
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
    const discountType = formData.get('discountType');
    const discountValue = parseFloat(formData.get('discountValue')) || 0;
    let discountAmount = 0;
    
    if (discountType === 'percentage') {
        discountAmount = (subtotal * discountValue) / 100;
    } else if (discountType === 'fixed') {
        discountAmount = discountValue;
    }
    
    const shippingCost = parseFloat(formData.get('shippingCost')) || 0;
    const taxableAmount = subtotal - discountAmount + shippingCost;
    const taxRate = parseFloat(formData.get('taxRate')) || 0;
    const taxAmount = (taxableAmount * taxRate) / 100;
    const total = subtotal - discountAmount + shippingCost + taxAmount;
    
    return {
        businessName: formData.get('businessName'),
        businessEmail: formData.get('businessEmail'),
        businessAddress: formData.get('businessAddress'),
        businessPhone: formData.get('businessPhone'),
        website: formData.get('website'),
        clientName: formData.get('clientName'),
        clientEmail: formData.get('clientEmail'),
        clientAddress: formData.get('clientAddress'),
        quotationNumber: formData.get('quotationNumber'),
        quotationDate: formData.get('quotationDate'),
        validUntil: formData.get('validUntil'),
        currency: formData.get('currency'),
        items: items,
        discountType: discountType,
        discountValue: discountValue,
        discountAmount: discountAmount,
        shippingCost: shippingCost,
        taxRate: taxRate,
        taxAmount: taxAmount,
        paymentTerms: formData.get('paymentTerms'),
        deliveryTime: formData.get('deliveryTime'),
        notes: formData.get('notes'),
        subtotal: subtotal,
        total: total
    };
}

function validateQuotationFormData(data) {
    const requiredFields = ['businessName', 'businessEmail', 'businessAddress', 'clientName', 'clientAddress', 'quotationNumber', 'quotationDate'];
    
    for (const field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
            return false;
        }
    }
    
    if (data.items.length === 0) {
        alert('Please add at least one item to the quotation');
        return false;
    }
    
    return true;
}

function generateQuotationHTML(data) {
    const currencySymbols = {
        'USD': '$', 'EUR': '€', 'GBP': '£', 'INR': '₹', 'CAD': 'C$', 'AUD': 'A$'
    };
    const symbol = currencySymbols[data.currency] || '$';
    
    return `
        <div class="quotation-header">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 2rem;">
                <div>
                    <h1 style="color: var(--primary-color); margin-bottom: 0.5rem;">QUOTATION</h1>
                    <p style="margin: 0; color: var(--text-light);">Quote #${data.quotationNumber}</p>
                </div>
                <div style="text-align: right;">
                    <h2 style="margin-bottom: 0.5rem;">${data.businessName}</h2>
                    <p style="margin: 0; white-space: pre-line;">${data.businessAddress}</p>
                    ${data.businessPhone ? `<p style="margin: 0.25rem 0;">Phone: ${data.businessPhone}</p>` : ''}
                    <p style="margin: 0.25rem 0;">Email: ${data.businessEmail}</p>
                    ${data.website ? `<p style="margin: 0.25rem 0;">Website: ${data.website}</p>` : ''}
                </div>
            </div>
        </div>
        
        <div class="quotation-details" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
            <div>
                <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">Quote For:</h3>
                <p style="font-weight: 600; margin-bottom: 0.25rem;">${data.clientName}</p>
                <p style="margin: 0; white-space: pre-line;">${data.clientAddress}</p>
                ${data.clientEmail ? `<p style="margin: 0.25rem 0;">Email: ${data.clientEmail}</p>` : ''}
            </div>
            <div style="text-align: right;">
                <p><strong>Quote Date:</strong> ${formatDate(data.quotationDate)}</p>
                ${data.validUntil ? `<p><strong>Valid Until:</strong> ${formatDate(data.validUntil)}</p>` : ''}
                <p><strong>Currency:</strong> ${data.currency}</p>
                ${data.paymentTerms ? `<p><strong>Payment Terms:</strong> ${data.paymentTerms}</p>` : ''}
                ${data.deliveryTime ? `<p><strong>Delivery Time:</strong> ${data.deliveryTime}</p>` : ''}
            </div>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 2rem;">
            <thead>
                <tr style="background: var(--primary-color); color: white;">
                    <th style="padding: 0.75rem; text-align: left; border: 1px solid var(--border-color);">Description</th>
                    <th style="padding: 0.75rem; text-align: center; border: 1px solid var(--border-color);">Qty</th>
                    <th style="padding: 0.75rem; text-align: right; border: 1px solid var(--border-color);">Unit Price</th>
                    <th style="padding: 0.75rem; text-align: right; border: 1px solid var(--border-color);">Total</th>
                </tr>
            </thead>
            <tbody>
                ${data.items.map(item => `
                    <tr>
                        <td style="padding: 0.75rem; border: 1px solid var(--border-color); white-space: pre-line;">${item.description}</td>
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
                ${data.discountAmount > 0 ? `
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">
                        <span>Discount ${data.discountType === 'percentage' ? `(${data.discountValue}%)` : ''}:</span>
                        <span>-${symbol}${data.discountAmount.toFixed(2)}</span>
                    </div>
                ` : ''}
                ${data.shippingCost > 0 ? `
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">
                        <span>Shipping:</span>
                        <span>${symbol}${data.shippingCost.toFixed(2)}</span>
                    </div>
                ` : ''}
                ${data.taxRate > 0 ? `
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">
                        <span>Tax (${data.taxRate}%):</span>
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
                <h4>Terms & Conditions:</h4>
                <p style="white-space: pre-line;">${data.notes}</p>
            </div>
        ` : ''}
        
        <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--border-color); text-align: center; color: var(--text-light); font-size: 0.875rem;">
            <p>Thank you for considering our services!</p>
        </div>
    `;
}

function exportQuotation(format) {
    const formData = collectQuotationFormData();
    if (!validateQuotationFormData(formData)) {
        return;
    }
    
    switch (format) {
        case 'pdf':
            exportQuotationToPDF(formData);
            break;
        case 'word':
            exportQuotationToWord(formData);
            break;
        case 'excel':
            exportQuotationToExcel(formData);
            break;
    }
}

function exportQuotationToPDF(data) {
    const printWindow = window.open('', '_blank');
    const quotationHTML = generateQuotationHTML(data);
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Quotation ${data.quotationNumber}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .quotation-preview { max-width: 800px; margin: 0 auto; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 8px; border: 1px solid #ddd; }
                th { background-color: #2563eb; color: white; }
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="quotation-preview">${quotationHTML}</div>
            <div class="no-print" style="text-align: center; margin-top: 20px;">
                <button onclick="window.print()">Print/Save as PDF</button>
                <button onclick="window.close()">Close</button>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

function exportQuotationToWord(data) {
    const quotationHTML = generateQuotationHTML(data);
    const blob = new Blob([`
        <!DOCTYPE html>
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
        <head>
            <meta charset='utf-8'>
            <title>Quotation ${data.quotationNumber}</title>
        </head>
        <body>${quotationHTML}</body>
        </html>
    `], { type: 'application/msword' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Quotation_${data.quotationNumber}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportQuotationToExcel(data) {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    csvContent += `Quotation Number,${data.quotationNumber}\n`;
    csvContent += `Quotation Date,${data.quotationDate}\n`;
    csvContent += `Valid Until,${data.validUntil || 'N/A'}\n`;
    csvContent += `Business Name,${data.businessName}\n`;
    csvContent += `Client Name,${data.clientName}\n`;
    csvContent += `Currency,${data.currency}\n\n`;
    
    csvContent += "Description,Quantity,Unit Price,Total\n";
    
    data.items.forEach(item => {
        csvContent += `"${item.description}",${item.quantity},${item.rate},${item.amount}\n`;
    });
    
    csvContent += `\nSubtotal,,${data.subtotal}\n`;
    if (data.discountAmount > 0) {
        csvContent += `Discount,,${data.discountAmount}\n`;
    }
    if (data.shippingCost > 0) {
        csvContent += `Shipping,,${data.shippingCost}\n`;
    }
    if (data.taxRate > 0) {
        csvContent += `Tax (${data.taxRate}%),,${data.taxAmount}\n`;
    }
    csvContent += `Total,,${data.total}\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Quotation_${data.quotationNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}