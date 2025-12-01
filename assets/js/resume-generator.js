document.addEventListener('DOMContentLoaded', function() {
    // Set default date
    document.getElementById('documentDate').value = new Date().toISOString().split('T')[0];
    
    // Load resume-specific content
    const dynamicContent = document.getElementById('dynamicContent');
    dynamicContent.innerHTML = `
        <div class="form-section">
            <h3>Personal Information</h3>
            <div class="form-row">
                <div class="form-group">
                    <label for="fullName" class="form-label">Full Name *</label>
                    <input type="text" id="fullName" name="fullName" class="form-input" required placeholder="Enter your full name">
                </div>
                <div class="form-group">
                    <label for="email" class="form-label">Email *</label>
                    <input type="email" id="email" name="email" class="form-input" required placeholder="your.email@example.com">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="phone" class="form-label">Phone Number *</label>
                    <input type="tel" id="phone" name="phone" class="form-input" required placeholder="+1 (555) 123-4567">
                </div>
                <div class="form-group">
                    <label for="location" class="form-label">Location</label>
                    <input type="text" id="location" name="location" class="form-input" placeholder="City, State">
                </div>
            </div>
            <div class="form-group">
                <label for="professionalSummary" class="form-label">Professional Summary *</label>
                <textarea id="professionalSummary" name="professionalSummary" class="form-textarea" required placeholder="Brief professional summary highlighting your key skills and experience" rows="4"></textarea>
            </div>
        </div>
        
        <div class="form-section">
            <h3>Work Experience</h3>
            <div id="experienceContainer">
                <div class="experience-item">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Job Title</label>
                            <input type="text" name="jobTitle[]" class="form-input" placeholder="Software Engineer">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Company</label>
                            <input type="text" name="company[]" class="form-input" placeholder="Company Name">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Start Date</label>
                            <input type="month" name="startDate[]" class="form-input">
                        </div>
                        <div class="form-group">
                            <label class="form-label">End Date</label>
                            <input type="month" name="endDate[]" class="form-input" placeholder="Leave blank if current">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Job Description</label>
                        <textarea name="jobDescription[]" class="form-textarea" placeholder="Describe your responsibilities and achievements" rows="3"></textarea>
                    </div>
                </div>
            </div>
            <button type="button" id="addExperience" class="btn-secondary">Add Experience</button>
        </div>
        
        <div class="form-section">
            <h3>Education</h3>
            <div class="form-row">
                <div class="form-group">
                    <label for="degree" class="form-label">Degree</label>
                    <input type="text" id="degree" name="degree" class="form-input" placeholder="Bachelor of Science">
                </div>
                <div class="form-group">
                    <label for="institution" class="form-label">Institution</label>
                    <input type="text" id="institution" name="institution" class="form-input" placeholder="University Name">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="graduationYear" class="form-label">Graduation Year</label>
                    <input type="number" id="graduationYear" name="graduationYear" class="form-input" min="1950" max="2030" placeholder="2024">
                </div>
                <div class="form-group">
                    <label for="gpa" class="form-label">GPA (Optional)</label>
                    <input type="text" id="gpa" name="gpa" class="form-input" placeholder="3.8/4.0">
                </div>
            </div>
        </div>
        
        <div class="form-section">
            <h3>Skills</h3>
            <div class="form-group">
                <label for="skills" class="form-label">Technical Skills</label>
                <textarea id="skills" name="skills" class="form-textarea" placeholder="List your technical skills separated by commas (e.g., JavaScript, Python, React, Node.js)" rows="3"></textarea>
            </div>
        </div>
    `;
    
    // Add experience functionality
    document.getElementById('addExperience').addEventListener('click', function() {
        const container = document.getElementById('experienceContainer');
        const newItem = container.firstElementChild.cloneNode(true);
        // Clear values
        newItem.querySelectorAll('input, textarea').forEach(input => input.value = '');
        container.appendChild(newItem);
    });
    
    // Setup event listeners for buttons
    document.getElementById('previewDocument').addEventListener('click', previewDocument);
    document.getElementById('generatePDF').addEventListener('click', () => exportDocument('pdf'));
    document.getElementById('generateWord').addEventListener('click', () => exportDocument('word'));
    document.getElementById('generateExcel').addEventListener('click', () => exportDocument('excel'));
    
    // Override document generation
    window.generateDocumentHTML = function(data) {
        // Collect experience data
        const jobTitles = document.querySelectorAll('input[name="jobTitle[]"]');
        const companies = document.querySelectorAll('input[name="company[]"]');
        const startDates = document.querySelectorAll('input[name="startDate[]"]');
        const endDates = document.querySelectorAll('input[name="endDate[]"]');
        const jobDescriptions = document.querySelectorAll('textarea[name="jobDescription[]"]');
        
        let experienceHTML = '';
        for (let i = 0; i < jobTitles.length; i++) {
            if (jobTitles[i].value.trim()) {
                const endDate = endDates[i].value || 'Present';
                experienceHTML += `
                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="margin-bottom: 0.25rem;">${jobTitles[i].value} - ${companies[i].value}</h4>
                        <p style="color: var(--text-light); margin-bottom: 0.5rem; font-style: italic;">${formatMonth(startDates[i].value)} - ${endDate === 'Present' ? 'Present' : formatMonth(endDate)}</p>
                        <p style="white-space: pre-line;">${jobDescriptions[i].value}</p>
                    </div>
                `;
            }
        }
        
        return `
            <div class="resume-header" style="text-align: center; margin-bottom: 2rem; border-bottom: 2px solid var(--primary-color); padding-bottom: 1rem;">
                <h1 style="color: var(--primary-color); margin-bottom: 0.5rem;">${data.fullName}</h1>
                <p style="margin: 0.25rem 0;">${data.email} | ${data.phone}</p>
                ${data.location ? `<p style="margin: 0.25rem 0;">${data.location}</p>` : ''}
            </div>
            
            <div class="resume-section" style="margin-bottom: 2rem;">
                <h3 style="color: var(--primary-color); border-bottom: 1px solid var(--primary-color); padding-bottom: 0.25rem; margin-bottom: 1rem;">Professional Summary</h3>
                <p style="white-space: pre-line;">${data.professionalSummary}</p>
            </div>
            
            ${experienceHTML ? `
                <div class="resume-section" style="margin-bottom: 2rem;">
                    <h3 style="color: var(--primary-color); border-bottom: 1px solid var(--primary-color); padding-bottom: 0.25rem; margin-bottom: 1rem;">Work Experience</h3>
                    ${experienceHTML}
                </div>
            ` : ''}
            
            ${data.degree || data.institution ? `
                <div class="resume-section" style="margin-bottom: 2rem;">
                    <h3 style="color: var(--primary-color); border-bottom: 1px solid var(--primary-color); padding-bottom: 0.25rem; margin-bottom: 1rem;">Education</h3>
                    <div>
                        <h4 style="margin-bottom: 0.25rem;">${data.degree}</h4>
                        <p style="color: var(--text-light); margin-bottom: 0.25rem;">${data.institution}</p>
                        ${data.graduationYear ? `<p style="color: var(--text-light);">Graduated: ${data.graduationYear}</p>` : ''}
                        ${data.gpa ? `<p style="color: var(--text-light);">GPA: ${data.gpa}</p>` : ''}
                    </div>
                </div>
            ` : ''}
            
            ${data.skills ? `
                <div class="resume-section">
                    <h3 style="color: var(--primary-color); border-bottom: 1px solid var(--primary-color); padding-bottom: 0.25rem; margin-bottom: 1rem;">Technical Skills</h3>
                    <p>${data.skills}</p>
                </div>
            ` : ''}
        `;
    };
});

function formatMonth(monthString) {
    if (!monthString) return '';
    const date = new Date(monthString + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
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
    const requiredFields = ['documentTitle', 'documentDate', 'fullName', 'email', 'phone', 'professionalSummary'];
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
            <title>Resume - ${data.fullName}</title>
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
    const blob = new Blob([`<!DOCTYPE html><html><head><title>Resume - ${data.fullName}</title></head><body>${documentHTML}</body></html>`], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Resume_${data.fullName}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportToExcel(data) {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `Name,${data.fullName}\n`;
    csvContent += `Email,${data.email}\n`;
    csvContent += `Phone,${data.phone}\n`;
    csvContent += `Location,${data.location || 'N/A'}\n`;
    csvContent += `Summary,"${data.professionalSummary}"\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Resume_${data.fullName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}