/**
 * Salary Slip Generator JavaScript
 * Handles salary slip creation with PF, ESI, and tax calculations
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeSalarySlipGenerator();
});

function initializeSalarySlipGenerator() {
    // Set default year to current year
    document.getElementById('salaryYear').value = new Date().getFullYear();
    
    // Set default month to current month
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    document.getElementById('salaryMonth').value = currentMonth;
    
    // Initialize event listeners
    setupSalarySlipEventListeners();
    
    // Calculate initial salary
    calculateSalary();
}

function setupSalarySlipEventListeners() {
    // Salary component inputs
    const salaryInputs = ['basicSalary', 'hra', 'conveyanceAllowance', 'medicalAllowance', 'specialAllowance', 'otherAllowances'];
    salaryInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calculateSalary);
    });
    
    // Deduction inputs
    const deductionInputs = ['professionalTax', 'incomeTax', 'loanDeduction', 'otherDeductions'];
    deductionInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calculateSalary);
    });
    
    // PF and ESI checkboxes
    document.getElementById('enablePF').addEventListener('change', function() {
        document.getElementById('pfDeduction').readOnly = !this.checked;
        if (!this.checked) {
            document.getElementById('pfDeduction').value = '0';
        }
        calculateSalary();
    });
    
    document.getElementById('enableESI').addEventListener('change', function() {
        document.getElementById('esiDeduction').readOnly = !this.checked;
        if (!this.checked) {
            document.getElementById('esiDeduction').value = '0';
        }
        calculateSalary();
    });
    
    // Basic salary change for PF calculation
    document.getElementById('basicSalary').addEventListener('input', function() {
        if (document.getElementById('enablePF').checked) {
            calculatePFDeduction();
        }
        calculateSalary();
    });
    
    // Working days and present days
    document.getElementById('workingDays').addEventListener('input', calculateSalary);
    document.getElementById('presentDays').addEventListener('input', calculateSalary);
    
    // Preview and export buttons
    document.getElementById('previewSalarySlip').addEventListener('click', previewSalarySlip);
    document.getElementById('generatePDF').addEventListener('click', () => exportSalarySlip('pdf'));
    document.getElementById('generateWord').addEventListener('click', () => exportSalarySlip('word'));
    document.getElementById('generateExcel').addEventListener('click', () => exportSalarySlip('excel'));
}

function calculatePFDeduction() {
    const basicSalary = parseFloat(document.getElementById('basicSalary').value) || 0;
    const pfDeduction = basicSalary * 0.12; // 12% of basic salary
    document.getElementById('pfDeduction').value = pfDeduction.toFixed(2);
}

function calculateESIDeduction() {
    const grossSalary = calculateGrossSalary();
    const esiDeduction = grossSalary * 0.0075; // 0.75% of gross salary
    document.getElementById('esiDeduction').value = esiDeduction.toFixed(2);
}

function calculateGrossSalary() {
    const basicSalary = parseFloat(document.getElementById('basicSalary').value) || 0;
    const hra = parseFloat(document.getElementById('hra').value) || 0;
    const conveyanceAllowance = parseFloat(document.getElementById('conveyanceAllowance').value) || 0;
    const medicalAllowance = parseFloat(document.getElementById('medicalAllowance').value) || 0;
    const specialAllowance = parseFloat(document.getElementById('specialAllowance').value) || 0;
    const otherAllowances = parseFloat(document.getElementById('otherAllowances').value) || 0;
    
    return basicSalary + hra + conveyanceAllowance + medicalAllowance + specialAllowance + otherAllowances;
}

function calculateTotalDeductions() {
    let pfDeduction = 0;
    let esiDeduction = 0;
    
    // Calculate PF if enabled
    if (document.getElementById('enablePF').checked) {
        pfDeduction = parseFloat(document.getElementById('pfDeduction').value) || 0;
    }
    
    // Calculate ESI if enabled
    if (document.getElementById('enableESI').checked) {
        esiDeduction = parseFloat(document.getElementById('esiDeduction').value) || 0;
    }
    
    const professionalTax = parseFloat(document.getElementById('professionalTax').value) || 0;
    const incomeTax = parseFloat(document.getElementById('incomeTax').value) || 0;
    const loanDeduction = parseFloat(document.getElementById('loanDeduction').value) || 0;
    const otherDeductions = parseFloat(document.getElementById('otherDeductions').value) || 0;
    
    return pfDeduction + esiDeduction + professionalTax + incomeTax + loanDeduction + otherDeductions;
}

function calculateSalary() {
    // Calculate automatic deductions
    if (document.getElementById('enablePF').checked) {
        calculatePFDeduction();
    }
    
    if (document.getElementById('enableESI').checked) {
        calculateESIDeduction();
    }
    
    // Calculate totals
    const grossSalary = calculateGrossSalary();
    const totalDeductions = calculateTotalDeductions();
    
    // Apply pro-rata calculation based on working days
    const workingDays = parseFloat(document.getElementById('workingDays').value) || 30;
    const presentDays = parseFloat(document.getElementById('presentDays').value) || 30;
    const proRataFactor = presentDays / workingDays;
    
    const proRatedGross = grossSalary * proRataFactor;
    const proRatedDeductions = totalDeductions * proRataFactor;
    const netSalary = proRatedGross - proRatedDeductions;
    
    // Update display
    document.getElementById('grossSalaryDisplay').textContent = formatINR(proRatedGross);
    document.getElementById('totalDeductionsDisplay').textContent = formatINR(proRatedDeductions);
    document.getElementById('netSalaryDisplay').textContent = formatINR(netSalary);
}

function formatINR(amount) {
    return '₹' + amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function previewSalarySlip() {
    const formData = collectSalarySlipFormData();
    if (!validateSalarySlipFormData(formData)) {
        return;
    }
    
    const previewHTML = generateSalarySlipHTML(formData);
    document.getElementById('salarySlipPreview').innerHTML = previewHTML;
    document.getElementById('previewContainer').style.display = 'block';
    
    document.getElementById('previewContainer').scrollIntoView({ behavior: 'smooth' });
}

function collectSalarySlipFormData() {
    const form = document.getElementById('salarySlipForm');
    const formData = new FormData(form);
    
    // Calculate values
    const grossSalary = calculateGrossSalary();
    const totalDeductions = calculateTotalDeductions();
    const workingDays = parseFloat(formData.get('workingDays')) || 30;
    const presentDays = parseFloat(formData.get('presentDays')) || 30;
    const proRataFactor = presentDays / workingDays;
    
    const proRatedGross = grossSalary * proRataFactor;
    const proRatedDeductions = totalDeductions * proRataFactor;
    const netSalary = proRatedGross - proRatedDeductions;
    
    return {
        companyName: formData.get('companyName'),
        companyAddress: formData.get('companyAddress'),
        pfNumber: formData.get('pfNumber'),
        esiNumber: formData.get('esiNumber'),
        employeeName: formData.get('employeeName'),
        employeeId: formData.get('employeeId'),
        designation: formData.get('designation'),
        department: formData.get('department'),
        dateOfJoining: formData.get('dateOfJoining'),
        panNumber: formData.get('panNumber'),
        pfAccountNumber: formData.get('pfAccountNumber'),
        esiAccountNumber: formData.get('esiAccountNumber'),
        salaryMonth: formData.get('salaryMonth'),
        salaryYear: formData.get('salaryYear'),
        workingDays: workingDays,
        presentDays: presentDays,
        basicSalary: parseFloat(formData.get('basicSalary')) || 0,
        hra: parseFloat(formData.get('hra')) || 0,
        conveyanceAllowance: parseFloat(formData.get('conveyanceAllowance')) || 0,
        medicalAllowance: parseFloat(formData.get('medicalAllowance')) || 0,
        specialAllowance: parseFloat(formData.get('specialAllowance')) || 0,
        otherAllowances: parseFloat(formData.get('otherAllowances')) || 0,
        pfDeduction: document.getElementById('enablePF').checked ? (parseFloat(formData.get('pfDeduction')) || 0) : 0,
        esiDeduction: document.getElementById('enableESI').checked ? (parseFloat(formData.get('esiDeduction')) || 0) : 0,
        professionalTax: parseFloat(formData.get('professionalTax')) || 0,
        incomeTax: parseFloat(formData.get('incomeTax')) || 0,
        loanDeduction: parseFloat(formData.get('loanDeduction')) || 0,
        otherDeductions: parseFloat(formData.get('otherDeductions')) || 0,
        grossSalary: proRatedGross,
        totalDeductions: proRatedDeductions,
        netSalary: netSalary
    };
}

function validateSalarySlipFormData(data) {
    const requiredFields = ['companyName', 'companyAddress', 'employeeName', 'employeeId', 'designation', 'salaryMonth', 'salaryYear'];
    
    for (const field of requiredFields) {
        if (!data[field] || data[field].toString().trim() === '') {
            alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
            return false;
        }
    }
    
    if (data.basicSalary <= 0) {
        alert('Please enter a valid basic salary');
        return false;
    }
    
    return true;
}

function generateSalarySlipHTML(data) {
    return `
        <div class="salary-slip-header" style="text-align: center; margin-bottom: 2rem; border-bottom: 2px solid var(--primary-color); padding-bottom: 1rem;">
            <h1 style="color: var(--primary-color); margin-bottom: 0.5rem;">${data.companyName}</h1>
            <p style="margin: 0; color: var(--text-light);">${data.companyAddress}</p>
            ${data.pfNumber ? `<p style="margin: 0.25rem 0; font-size: 0.875rem;">PF No: ${data.pfNumber}</p>` : ''}
            ${data.esiNumber ? `<p style="margin: 0.25rem 0; font-size: 0.875rem;">ESI No: ${data.esiNumber}</p>` : ''}
            <h2 style="margin-top: 1rem; color: var(--primary-color);">SALARY SLIP</h2>
            <p style="margin: 0; font-weight: 600;">For the month of ${data.salaryMonth} ${data.salaryYear}</p>
        </div>
        
        <div class="employee-details" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
            <div>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); font-weight: 600; background: var(--bg-light);">Employee Name:</td>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color);">${data.employeeName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); font-weight: 600; background: var(--bg-light);">Employee ID:</td>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color);">${data.employeeId}</td>
                    </tr>
                    <tr>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); font-weight: 600; background: var(--bg-light);">Designation:</td>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color);">${data.designation}</td>
                    </tr>
                    ${data.department ? `
                    <tr>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); font-weight: 600; background: var(--bg-light);">Department:</td>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color);">${data.department}</td>
                    </tr>
                    ` : ''}
                </table>
            </div>
            <div>
                <table style="width: 100%; border-collapse: collapse;">
                    ${data.dateOfJoining ? `
                    <tr>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); font-weight: 600; background: var(--bg-light);">Date of Joining:</td>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color);">${formatDate(data.dateOfJoining)}</td>
                    </tr>
                    ` : ''}
                    ${data.panNumber ? `
                    <tr>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); font-weight: 600; background: var(--bg-light);">PAN Number:</td>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color);">${data.panNumber}</td>
                    </tr>
                    ` : ''}
                    <tr>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); font-weight: 600; background: var(--bg-light);">Working Days:</td>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color);">${data.workingDays}</td>
                    </tr>
                    <tr>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); font-weight: 600; background: var(--bg-light);">Present Days:</td>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color);">${data.presentDays}</td>
                    </tr>
                </table>
            </div>
        </div>
        
        <div class="salary-breakdown" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
            <div>
                <h3 style="color: var(--primary-color); margin-bottom: 1rem; text-align: center; background: var(--bg-light); padding: 0.5rem;">EARNINGS</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); font-weight: 600;">Basic Salary</td>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); text-align: right;">${formatINR(data.basicSalary * (data.presentDays / data.workingDays))}</td>
                    </tr>
                    ${data.hra > 0 ? `
                    <tr>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); font-weight: 600;">HRA</td>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); text-align: right;">${formatINR(data.hra * (data.presentDays / data.workingDays))}</td>
                    </tr>
                    ` : ''}
                    ${data.conveyanceAllowance > 0 ? `
                    <tr>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); font-weight: 600;">Conveyance Allowance</td>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); text-align: right;">${formatINR(data.conveyanceAllowance * (data.presentDays / data.workingDays))}</td>
                    </tr>
                    ` : ''}
                    ${data.medicalAllowance > 0 ? `
                    <tr>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); font-weight: 600;">Medical Allowance</td>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); text-align: right;">${formatINR(data.medicalAllowance * (data.presentDays / data.workingDays))}</td>
                    </tr>
                    ` : ''}
                    ${data.specialAllowance > 0 ? `
                    <tr>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); font-weight: 600;">Special Allowance</td>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); text-align: right;">${formatINR(data.specialAllowance * (data.presentDays / data.workingDays))}</td>
                    </tr>
                    ` : ''}
                    ${data.otherAllowances > 0 ? `
                    <tr>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); font-weight: 600;">Other Allowances</td>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); text-align: right;">${formatINR(data.otherAllowances * (data.presentDays / data.workingDays))}</td>
                    </tr>
                    ` : ''}
                    <tr style="background: var(--primary-color); color: white;">
                        <td style="padding: 0.75rem; border: 1px solid var(--border-color); font-weight: 600;">GROSS SALARY</td>
                        <td style="padding: 0.75rem; border: 1px solid var(--border-color); text-align: right; font-weight: 600;">${formatINR(data.grossSalary)}</td>
                    </tr>
                </table>
            </div>
            
            <div>
                <h3 style="color: var(--error-color); margin-bottom: 1rem; text-align: center; background: var(--bg-light); padding: 0.5rem;">DEDUCTIONS</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    ${data.pfDeduction > 0 ? `
                    <tr>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); font-weight: 600;">PF Deduction</td>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); text-align: right;">${formatINR(data.pfDeduction * (data.presentDays / data.workingDays))}</td>
                    </tr>
                    ` : ''}
                    ${data.esiDeduction > 0 ? `
                    <tr>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); font-weight: 600;">ESI Deduction</td>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); text-align: right;">${formatINR(data.esiDeduction * (data.presentDays / data.workingDays))}</td>
                    </tr>
                    ` : ''}
                    ${data.professionalTax > 0 ? `
                    <tr>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); font-weight: 600;">Professional Tax</td>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); text-align: right;">${formatINR(data.professionalTax)}</td>
                    </tr>
                    ` : ''}
                    ${data.incomeTax > 0 ? `
                    <tr>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); font-weight: 600;">Income Tax (TDS)</td>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); text-align: right;">${formatINR(data.incomeTax * (data.presentDays / data.workingDays))}</td>
                    </tr>
                    ` : ''}
                    ${data.loanDeduction > 0 ? `
                    <tr>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); font-weight: 600;">Loan Deduction</td>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); text-align: right;">${formatINR(data.loanDeduction)}</td>
                    </tr>
                    ` : ''}
                    ${data.otherDeductions > 0 ? `
                    <tr>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); font-weight: 600;">Other Deductions</td>
                        <td style="padding: 0.5rem; border: 1px solid var(--border-color); text-align: right;">${formatINR(data.otherDeductions)}</td>
                    </tr>
                    ` : ''}
                    <tr style="background: var(--error-color); color: white;">
                        <td style="padding: 0.75rem; border: 1px solid var(--border-color); font-weight: 600;">TOTAL DEDUCTIONS</td>
                        <td style="padding: 0.75rem; border: 1px solid var(--border-color); text-align: right; font-weight: 600;">${formatINR(data.totalDeductions)}</td>
                    </tr>
                </table>
            </div>
        </div>
        
        <div class="net-salary" style="text-align: center; margin: 2rem 0; padding: 1.5rem; background: var(--success-color); color: white; border-radius: var(--radius-lg);">
            <h2 style="margin: 0; font-size: 1.5rem;">NET SALARY: ${formatINR(data.netSalary)}</h2>
            <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem;">Amount in Words: ${numberToWords(Math.round(data.netSalary))} Rupees Only</p>
        </div>
        
        ${data.pfAccountNumber || data.esiAccountNumber ? `
        <div class="account-details" style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
            <h4>Account Details:</h4>
            ${data.pfAccountNumber ? `<p><strong>PF Account Number:</strong> ${data.pfAccountNumber}</p>` : ''}
            ${data.esiAccountNumber ? `<p><strong>ESI Account Number:</strong> ${data.esiAccountNumber}</p>` : ''}
        </div>
        ` : ''}
        
        <div style="margin-top: 3rem; text-align: center; color: var(--text-light); font-size: 0.875rem;">
            <p>This is a computer-generated salary slip and does not require a signature.</p>
        </div>
    `;
}

function numberToWords(num) {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (num === 0) return 'Zero';
    
    function convertHundreds(n) {
        let result = '';
        if (n >= 100) {
            result += ones[Math.floor(n / 100)] + ' Hundred ';
            n %= 100;
        }
        if (n >= 20) {
            result += tens[Math.floor(n / 10)] + ' ';
            n %= 10;
        } else if (n >= 10) {
            result += teens[n - 10] + ' ';
            return result;
        }
        if (n > 0) {
            result += ones[n] + ' ';
        }
        return result;
    }
    
    let result = '';
    let crore = Math.floor(num / 10000000);
    if (crore > 0) {
        result += convertHundreds(crore) + 'Crore ';
        num %= 10000000;
    }
    
    let lakh = Math.floor(num / 100000);
    if (lakh > 0) {
        result += convertHundreds(lakh) + 'Lakh ';
        num %= 100000;
    }
    
    let thousand = Math.floor(num / 1000);
    if (thousand > 0) {
        result += convertHundreds(thousand) + 'Thousand ';
        num %= 1000;
    }
    
    if (num > 0) {
        result += convertHundreds(num);
    }
    
    return result.trim();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
}

function exportSalarySlip(format) {
    const formData = collectSalarySlipFormData();
    if (!validateSalarySlipFormData(formData)) {
        return;
    }
    
    switch (format) {
        case 'pdf':
            exportSalarySlipToPDF(formData);
            break;
        case 'word':
            exportSalarySlipToWord(formData);
            break;
        case 'excel':
            exportSalarySlipToExcel(formData);
            break;
    }
}

function exportSalarySlipToPDF(data) {
    const printWindow = window.open('', '_blank');
    const salarySlipHTML = generateSalarySlipHTML(data);
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Salary Slip - ${data.employeeName} - ${data.salaryMonth} ${data.salaryYear}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .salary-slip-preview { max-width: 800px; margin: 0 auto; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 8px; border: 1px solid #ddd; }
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="salary-slip-preview">${salarySlipHTML}</div>
            <div class="no-print" style="text-align: center; margin-top: 20px;">
                <button onclick="window.print()">Print/Save as PDF</button>
                <button onclick="window.close()">Close</button>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

function exportSalarySlipToWord(data) {
    const salarySlipHTML = generateSalarySlipHTML(data);
    const blob = new Blob([`
        <!DOCTYPE html>
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
        <head>
            <meta charset='utf-8'>
            <title>Salary Slip - ${data.employeeName}</title>
        </head>
        <body>${salarySlipHTML}</body>
        </html>
    `], { type: 'application/msword' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SalarySlip_${data.employeeName}_${data.salaryMonth}_${data.salaryYear}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportSalarySlipToExcel(data) {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    csvContent += `Company Name,${data.companyName}\n`;
    csvContent += `Employee Name,${data.employeeName}\n`;
    csvContent += `Employee ID,${data.employeeId}\n`;
    csvContent += `Designation,${data.designation}\n`;
    csvContent += `Salary Month,${data.salaryMonth} ${data.salaryYear}\n`;
    csvContent += `Working Days,${data.workingDays}\n`;
    csvContent += `Present Days,${data.presentDays}\n\n`;
    
    csvContent += "EARNINGS\n";
    csvContent += `Basic Salary,${data.basicSalary * (data.presentDays / data.workingDays)}\n`;
    if (data.hra > 0) csvContent += `HRA,${data.hra * (data.presentDays / data.workingDays)}\n`;
    if (data.conveyanceAllowance > 0) csvContent += `Conveyance Allowance,${data.conveyanceAllowance * (data.presentDays / data.workingDays)}\n`;
    if (data.medicalAllowance > 0) csvContent += `Medical Allowance,${data.medicalAllowance * (data.presentDays / data.workingDays)}\n`;
    if (data.specialAllowance > 0) csvContent += `Special Allowance,${data.specialAllowance * (data.presentDays / data.workingDays)}\n`;
    if (data.otherAllowances > 0) csvContent += `Other Allowances,${data.otherAllowances * (data.presentDays / data.workingDays)}\n`;
    csvContent += `Gross Salary,${data.grossSalary}\n\n`;
    
    csvContent += "DEDUCTIONS\n";
    if (data.pfDeduction > 0) csvContent += `PF Deduction,${data.pfDeduction * (data.presentDays / data.workingDays)}\n`;
    if (data.esiDeduction > 0) csvContent += `ESI Deduction,${data.esiDeduction * (data.presentDays / data.workingDays)}\n`;
    if (data.professionalTax > 0) csvContent += `Professional Tax,${data.professionalTax}\n`;
    if (data.incomeTax > 0) csvContent += `Income Tax,${data.incomeTax * (data.presentDays / data.workingDays)}\n`;
    if (data.loanDeduction > 0) csvContent += `Loan Deduction,${data.loanDeduction}\n`;
    if (data.otherDeductions > 0) csvContent += `Other Deductions,${data.otherDeductions}\n`;
    csvContent += `Total Deductions,${data.totalDeductions}\n\n`;
    
    csvContent += `Net Salary,${data.netSalary}\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SalarySlip_${data.employeeName}_${data.salaryMonth}_${data.salaryYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}