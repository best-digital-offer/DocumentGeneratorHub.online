/**
 * Generator Creation Script
 * This script creates all the remaining document generators
 */

const fs = require('fs');
const path = require('path');

// Generator configurations
const generators = {
    business: [
        { name: 'purchase-order-generator', title: 'Purchase Order Generator', description: 'Create professional purchase orders with item details and vendor information' },
        { name: 'receipt-generator', title: 'Receipt Generator', description: 'Generate payment receipts and acknowledgments for transactions' },
        { name: 'delivery-challan-generator', title: 'Delivery Challan Generator', description: 'Create delivery challans for goods transportation and logistics' },
        { name: 'business-proposal-generator', title: 'Business Proposal Generator', description: 'Generate comprehensive business proposals and project bids' },
        { name: 'project-proposal-generator', title: 'Project Proposal Generator', description: 'Create detailed project proposals with timelines and budgets' },
        { name: 'grant-proposal-generator', title: 'Grant Proposal Generator', description: 'Generate grant applications and funding proposals' },
        { name: 'business-plan-generator', title: 'Business Plan Generator', description: 'Create comprehensive business plans with financial projections' },
        { name: 'expense-report-generator', title: 'Expense Report Generator', description: 'Generate detailed expense reports for business reimbursements' }
    ],
    legal: [
        { name: 'contract-generator', title: 'Contract Generator', description: 'Create legal contracts and agreements with customizable terms' },
        { name: 'nda-generator', title: 'NDA Generator', description: 'Generate non-disclosure agreements for confidential information protection' },
        { name: 'partnership-agreement-generator', title: 'Partnership Agreement Generator', description: 'Create business partnership agreements with profit sharing terms' },
        { name: 'rent-lease-agreement-generator', title: 'Rent/Lease Agreement Generator', description: 'Generate rental and lease agreements for properties' },
        { name: 'loan-agreement-generator', title: 'Loan Agreement Generator', description: 'Create loan agreements with repayment terms and conditions' },
        { name: 'service-agreement-generator', title: 'Service Agreement Generator', description: 'Generate service contracts for professional services' },
        { name: 'will-testament-generator', title: 'Will/Testament Generator', description: 'Create last will and testament documents with asset distribution' },
        { name: 'power-of-attorney-generator', title: 'Power of Attorney Generator', description: 'Generate power of attorney documents for legal representation' }
    ],
    'hr-salary': [
        { name: 'appointment-letter-generator', title: 'Appointment Letter Generator', description: 'Create professional job appointment letters with terms and conditions' },
        { name: 'experience-certificate-generator', title: 'Experience Certificate Generator', description: 'Generate experience certificates for employees' },
        { name: 'promotion-letter-generator', title: 'Promotion Letter Generator', description: 'Create employee promotion letters with new role details' },
        { name: 'warning-letter-generator', title: 'Warning Letter Generator', description: 'Generate disciplinary warning letters for employees' },
        { name: 'termination-letter-generator', title: 'Termination Letter Generator', description: 'Create employment termination letters with proper notice' },
        { name: 'internship-letter-generator', title: 'Internship Letter Generator', description: 'Generate internship offer letters and agreements' }
    ],
    'personal-career': [
        { name: 'resume-generator', title: 'Resume Generator', description: 'Build professional resumes with ATS-friendly templates' },
        { name: 'cover-letter-generator', title: 'Cover Letter Generator', description: 'Create compelling cover letters for job applications' },
        { name: 'job-application-generator', title: 'Job Application Generator', description: 'Generate formal job application letters' },
        { name: 'personal-loan-agreement-generator', title: 'Personal Loan Agreement Generator', description: 'Create personal loan agreements between individuals' },
        { name: 'rent-receipt-generator', title: 'Rent Receipt Generator', description: 'Generate rent payment receipts for tenants and landlords' },
        { name: 'roommate-agreement-generator', title: 'Roommate Agreement Generator', description: 'Create roommate agreements with shared responsibilities' }
    ],
    education: [
        { name: 'certificate-generator', title: 'Certificate Generator', description: 'Create professional certificates for courses and achievements' },
        { name: 'award-certificate-generator', title: 'Award Certificate Generator', description: 'Generate award certificates for recognition and achievements' },
        { name: 'recommendation-letter-generator', title: 'Recommendation Letter Generator', description: 'Create professional recommendation letters for students and employees' },
        { name: 'scholarship-application-generator', title: 'Scholarship Application Generator', description: 'Generate scholarship application forms and essays' },
        { name: 'transcript-template-generator', title: 'Transcript Template Generator', description: 'Create academic transcript templates for educational institutions' },
        { name: 'id-card-generator', title: 'ID Card Generator', description: 'Generate student and employee ID cards with photos' }
    ],
    specialized: [
        { name: 'gst-invoice-generator', title: 'GST Invoice Generator', description: 'Create GST-compliant invoices for Indian businesses' },
        { name: 'freelancer-invoice-pack', title: 'Freelancer Invoice Pack', description: 'Complete invoice package for freelancers and consultants' },
        { name: 'restaurant-bill-generator', title: 'Restaurant Bill Generator', description: 'Generate restaurant bills and receipts with menu items' },
        { name: 'real-estate-agreement-generator', title: 'Real Estate Agreement Generator', description: 'Create property sale and purchase agreements' },
        { name: 'medical-prescription-generator', title: 'Medical Prescription Generator', description: 'Generate medical prescriptions and treatment records' }
    ]
};

// Base HTML template
function createGeneratorHTML(category, generator) {
    const categoryPath = category.replace('-', '');
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Free ${generator.title} - Create Professional Documents Online | Document Generator Hub</title>
    <meta name="description" content="${generator.description}. Free online generator with professional templates and multiple export formats.">
    <meta name="keywords" content="${generator.name.replace(/-/g, ' ')}, free ${generator.title.toLowerCase()}, professional document generator, online ${generator.title.toLowerCase()}">
    <link rel="canonical" href="https://documentgeneratorhub.online/generators/${category}/${generator.name}.html">
    <link rel="stylesheet" href="../../assets/css/style.css">
    <link rel="stylesheet" href="../../assets/css/responsive.css">
    
    <!-- AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID" crossorigin="anonymous"></script>
    
    <!-- Schema.org -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Free ${generator.title}",
        "url": "https://documentgeneratorhub.online/generators/${category}/${generator.name}.html",
        "description": "${generator.description}",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    }
    </script>
</head>
<body>
    <header class="header">
        <div class="container">
            <nav class="navbar">
                <a href="../../" class="logo">
                    <img src="../../assets/images/logo.svg" alt="Document Generator Hub Logo">
                    <span>DocumentGeneratorHub</span>
                </a>
                <div class="nav-menu">
                    <a href="../../" class="nav-link">Home</a>
                    <a href="../../about.html" class="nav-link">About</a>
                    <div class="dropdown">
                        <a href="#" class="nav-link active">Generators ▾</a>
                        <div class="dropdown-content">
                            <a href="../../index.html#business">Business Documents</a>
                            <a href="../../index.html#legal">Legal Documents</a>
                            <a href="../../index.html#hr">HR & Salary</a>
                            <a href="../../index.html#personal">Personal Documents</a>
                            <a href="../../index.html#education">Education</a>
                        </div>
                    </div>
                    <a href="../../faq.html" class="nav-link">FAQ</a>
                    <a href="../../contact.html" class="nav-link">Contact</a>
                </div>
                <div class="mobile-menu-btn">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </nav>
        </div>
    </header>

    <main class="section">
        <div class="container">
            <div class="generator-header">
                <h1>Free ${generator.title}</h1>
                <p class="section-subtitle">${generator.description}. Export to PDF, Word, or Excel formats instantly.</p>
            </div>

            <div class="generator-container">
                <div class="generator-form">
                    <form id="${generator.name.replace(/-/g, '')}Form">
                        <!-- Form sections will be dynamically generated based on document type -->
                        <div class="form-section">
                            <h3>Document Information</h3>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="documentTitle" class="form-label">Document Title *</label>
                                    <input type="text" id="documentTitle" name="documentTitle" class="form-input" required placeholder="Enter document title">
                                </div>
                                <div class="form-group">
                                    <label for="documentDate" class="form-label">Document Date *</label>
                                    <input type="date" id="documentDate" name="documentDate" class="form-input" required>
                                </div>
                            </div>
                        </div>

                        <!-- Dynamic content area -->
                        <div id="dynamicContent">
                            <!-- Content will be loaded based on document type -->
                        </div>

                        <!-- Generate Buttons -->
                        <div class="form-actions">
                            <button type="button" id="previewDocument" class="btn-secondary">Preview Document</button>
                            <button type="button" id="generatePDF" class="btn-primary">Generate PDF</button>
                            <button type="button" id="generateWord" class="btn-primary">Generate Word</button>
                            <button type="button" id="generateExcel" class="btn-primary">Generate Excel</button>
                        </div>
                    </form>
                </div>

                <!-- Preview Container -->
                <div class="preview-container" id="previewContainer" style="display: none;">
                    <h3>Document Preview</h3>
                    <div id="documentPreview" class="document-preview"></div>
                </div>
            </div>

            <!-- SEO Content -->
            <div class="seo-content" style="margin-top: 3rem;">
                <h2>About ${generator.title}</h2>
                <p>${generator.description}. Our free online generator provides professional templates that you can customize and download in multiple formats.</p>
                
                <h3>Key Features</h3>
                <ul>
                    <li>✅ 100% Free to use</li>
                    <li>✅ No registration required</li>
                    <li>✅ Professional templates</li>
                    <li>✅ Multiple export formats (PDF, Word, Excel)</li>
                    <li>✅ Instant generation</li>
                    <li>✅ Mobile-friendly interface</li>
                </ul>
                
                <h3>How to Use</h3>
                <ol>
                    <li>Fill in the required information in the form above</li>
                    <li>Preview your document to ensure accuracy</li>
                    <li>Choose your preferred format and download</li>
                    <li>Use the document for your business or personal needs</li>
                </ol>
                
                <p><strong>Note:</strong> This tool provides templates for informational purposes. For legal documents, please consult with qualified professionals.</p>
            </div>
        </div>
    </main>

    <!-- AdSense Placement -->
    <div class="ad-container container">
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
             data-ad-slot="1234567890"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
    </div>

    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <h3>Document Generator Hub</h3>
                    <p>Free online document generators for businesses, professionals, and individuals. Create professional documents instantly.</p>
                </div>
                
                <div class="footer-col">
                    <h4>Quick Links</h4>
                    <a href="../../">Home</a>
                    <a href="../../about.html">About Us</a>
                    <a href="../../faq.html">FAQ</a>
                    <a href="../../contact.html">Contact</a>
                </div>
                
                <div class="footer-col">
                    <h4>Legal</h4>
                    <a href="../../privacy-policy.html">Privacy Policy</a>
                    <a href="../../terms-of-service.html">Terms of Service</a>
                    <a href="../../disclaimer.html">Disclaimer</a>
                </div>
                
                <div class="footer-col">
                    <h4>Popular Generators</h4>
                    <a href="../business/invoice-generator.html">Invoice Generator</a>
                    <a href="../hr-salary/salary-slip-generator.html">Salary Slip Generator</a>
                    <a href="../legal/contract-generator.html">Contract Generator</a>
                    <a href="../personal-career/resume-generator.html">Resume Generator</a>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2024 Document Generator Hub. All rights reserved. | All tools are provided for educational and informational purposes.</p>
                <p class="disclaimer-note">Disclaimer: Our document generators provide templates and tools for creating documents. We are not legal professionals and do not provide legal advice. For important legal matters, please consult with a qualified attorney.</p>
            </div>
        </div>
    </footer>

    <script src="../../assets/js/main.js"></script>
    <script src="../../assets/js/universal-generator.js"></script>
    
    <style>
        .generator-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            margin-top: 2rem;
        }
        
        @media (max-width: 1024px) {
            .generator-container {
                grid-template-columns: 1fr;
            }
        }
        
        .form-section {
            background: white;
            padding: 2rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-sm);
            margin-bottom: 2rem;
            border: 1px solid var(--border-color);
        }
        
        .form-section h3 {
            margin-bottom: 1.5rem;
            color: var(--primary-color);
            border-bottom: 2px solid var(--primary-light);
            padding-bottom: 0.5rem;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        
        @media (max-width: 768px) {
            .form-row {
                grid-template-columns: 1fr;
            }
        }
        
        .form-actions {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            margin-top: 2rem;
        }
        
        .document-preview {
            background: white;
            padding: 2rem;
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            font-family: 'Arial', sans-serif;
            line-height: 1.4;
        }
    </style>
</body>
</html>`;
}

// Create all generators
function createAllGenerators() {
    Object.keys(generators).forEach(category => {
        generators[category].forEach(generator => {
            const filePath = path.join(__dirname, 'generators', category, `${generator.name}.html`);
            const htmlContent = createGeneratorHTML(category, generator);
            
            try {
                fs.writeFileSync(filePath, htmlContent, 'utf8');
                console.log(`Created: ${filePath}`);
            } catch (error) {
                console.error(`Error creating ${filePath}:`, error.message);
            }
        });
    });
}

// Create universal generator JavaScript
function createUniversalGeneratorJS() {
    const jsContent = `/**
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
    container.innerHTML = \`
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
    \`;
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
            alert(\`Please fill in the \${field.replace(/([A-Z])/g, ' $1').toLowerCase()}\`);
            return false;
        }
    }
    
    return true;
}

function generateDocumentHTML(data) {
    return \`
        <div class="document-header">
            <h1 style="color: var(--primary-color); text-align: center; margin-bottom: 2rem;">\${data.documentTitle || 'Document'}</h1>
            <p style="text-align: right; margin-bottom: 2rem;">Date: \${formatDate(data.documentDate)}</p>
        </div>
        
        <div class="document-content">
            \${data.documentContent ? \`<div style="margin-bottom: 2rem; white-space: pre-line;">\${data.documentContent}</div>\` : ''}
            
            \${data.authorName || data.organizationName ? \`
                <div style="margin-top: 3rem;">
                    \${data.authorName ? \`<p><strong>Author:</strong> \${data.authorName}</p>\` : ''}
                    \${data.organizationName ? \`<p><strong>Organization:</strong> \${data.organizationName}</p>\` : ''}
                </div>
            \` : ''}
            
            \${data.additionalNotes ? \`
                <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                    <h4>Additional Notes:</h4>
                    <p style="white-space: pre-line;">\${data.additionalNotes}</p>
                </div>
            \` : ''}
        </div>
        
        <div style="margin-top: 3rem; text-align: center; color: var(--text-light); font-size: 0.875rem;">
            <p>Generated using Document Generator Hub</p>
        </div>
    \`;
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
    
    printWindow.document.write(\`
        <!DOCTYPE html>
        <html>
        <head>
            <title>\${data.documentTitle || 'Document'}</title>
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
            <div class="document-preview">\${documentHTML}</div>
            <div class="no-print" style="text-align: center; margin-top: 20px;">
                <button onclick="window.print()">Print/Save as PDF</button>
                <button onclick="window.close()">Close</button>
            </div>
        </body>
        </html>
    \`);
    
    printWindow.document.close();
}

function exportToWord(data) {
    const documentHTML = generateDocumentHTML(data);
    const blob = new Blob([\`
        <!DOCTYPE html>
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
        <head>
            <meta charset='utf-8'>
            <title>\${data.documentTitle || 'Document'}</title>
        </head>
        <body>\${documentHTML}</body>
        </html>
    \`], { type: 'application/msword' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`\${data.documentTitle || 'Document'}.doc\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportToExcel(data) {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    csvContent += \`Document Title,\${data.documentTitle || 'Document'}\\n\`;
    csvContent += \`Document Date,\${data.documentDate}\\n\`;
    if (data.authorName) csvContent += \`Author,\${data.authorName}\\n\`;
    if (data.organizationName) csvContent += \`Organization,\${data.organizationName}\\n\`;
    csvContent += \`\\nContent:\\n"\${data.documentContent || ''}"\`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", \`\${data.documentTitle || 'Document'}.csv\`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}`;

    const jsPath = path.join(__dirname, 'assets', 'js', 'universal-generator.js');
    try {
        fs.writeFileSync(jsPath, jsContent, 'utf8');
        console.log(`Created: ${jsPath}`);
    } catch (error) {
        console.error(`Error creating ${jsPath}:`, error.message);
    }
}

// Run the generator creation
console.log('Creating all document generators...');
createAllGenerators();
createUniversalGeneratorJS();
console.log('All generators created successfully!');

// Export for use in other scripts
module.exports = { generators, createGeneratorHTML };