/* ============================================
   LINGUISTIC PHISHING ANALYSER - Core Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. STATE & DOM ELEMENTS ---
    const state = {
        emailContent: '',
        headers: {},
        flags: [],
        score: 0
    };

    const DOM = {
        modal: document.getElementById('disclaimer-modal'),
        btnAccept: document.getElementById('btn-accept-disclaimer'),
        dropZone: document.getElementById('drop-zone'),
        fileInput: document.getElementById('file-input'),
        btnBrowse: document.getElementById('btn-browse'),
        rawText: document.getElementById('raw-text-input'),
        btnAnalyze: document.getElementById('btn-analyze'),
        btnClear: document.getElementById('btn-clear'),
        outputSection: document.getElementById('output-section'),
        feedbackSection: document.getElementById('feedback-section'),
        scoreValue: document.getElementById('score-value'),
        riskLevel: document.getElementById('risk-level'),
        verdictText: document.getElementById('verdict-text'),
        flagsList: document.getElementById('flags-list'),
        feedbackForm: document.getElementById('feedback-form')
    };

    // --- 2. DISCLAIMER MODAL LOGIC ---
    function checkDisclaimer() {
        if (!localStorage.getItem('disclaimerAccepted')) {
            DOM.modal.classList.remove('hidden');
        } else {
            DOM.modal.classList.add('hidden');
        }
    }

    DOM.btnAccept.addEventListener('click', () => {
        localStorage.setItem('disclaimerAccepted', 'true');
        DOM.modal.classList.add('hidden');
    });

    // --- 3. INPUT HANDLING (File & Text) ---
    DOM.btnBrowse.addEventListener('click', () => DOM.fileInput.click());

    DOM.fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) processFile(file);
    });

    // Drag and Drop
    DOM.dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        DOM.dropZone.classList.add('dragover');
    });

    DOM.dropZone.addEventListener('dragleave', () => {
        DOM.dropZone.classList.remove('dragover');
    });

    DOM.dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        DOM.dropZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.name.endsWith('.eml')) {
            processFile(file);
        } else {
            alert('Please upload a valid .eml file.');
        }
    });

    function processFile(file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert('File too large. Maximum size is 5MB.');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            state.emailContent = e.target.result;
            DOM.rawText.value = state.emailContent; // Show parsed text in textarea
            DOM.btnAnalyze.disabled = false;
        };
        reader.readAsText(file);
    }

    DOM.rawText.addEventListener('input', (e) => {
        state.emailContent = e.target.value;
        DOM.btnAnalyze.disabled = state.emailContent.trim().length < 10;
    });

    DOM.btnClear.addEventListener('click', () => {
        state.emailContent = '';
        state.headers = {};
        state.flags = [];
        state.score = 0;
        DOM.rawText.value = '';
        DOM.fileInput.value = '';
        DOM.outputSection.classList.add('hidden');
        DOM.feedbackSection.classList.add('hidden');
        DOM.btnAnalyze.disabled = true;
    });

    // --- 4. ANALYSIS ENGINE (The 4 Pillars) ---
    DOM.btnAnalyze.addEventListener('click', () => {
        // Reset state
        state.flags = [];
        state.score = 0;
        
        // Parse Headers (Basic split by double newline)
        const parts = state.emailContent.split(/\r?\n\r?\n/);
        const headerBlock = parts[0] || '';
        const bodyBlock = parts.slice(1).join('\n\n') || '';

        // Run Pillars
        analyzeHeaders(headerBlock);
        analyzeLinguistic(bodyBlock);
        analyzeTechnical(bodyBlock);
        analyzeStructural(headerBlock, bodyBlock);

        // Calculate and Render
        calculateFinalScore();
        renderResults();
    });

    // PILLAR 1: Headers
    function analyzeHeaders(headerText) {
        // Example logic: Check for Reply-To mismatch
        const fromMatch = headerText.match(/From:\s*(.+)/i);
        const replyToMatch = headerText.match(/Reply-To:\s*(.+)/i);
        
        if (fromMatch && replyToMatch && fromMatch[1].trim() !== replyToMatch[1].trim()) {
            addFlag('high', 'Header Forensics', `Mismatch detected: 'From' (${fromMatch[1].trim()}) differs from 'Reply-To' (${replyToMatch[1].trim()}).`);
        }
        
        // TODO: Add SPF/DKIM/DMARC checks here
    }

    // PILLAR 2: Linguistic (Your Core Differentiator)
    function analyzeLinguistic(text) {
        const urgencyTriggers = ['urgent', 'immediately', 'suspended', 'verify your account', 'unauthorized activity', 'action required'];
        const vagueGreetings = ['dear customer', 'dear user', 'valued member', 'sir/madam'];
        
        const lowerText = text.toLowerCase();

        urgencyTriggers.forEach(trigger => {
            if (lowerText.includes(trigger)) {
                addFlag('medium', 'Linguistic Pattern', `Urgency/Fear trigger detected: "${trigger}".`);
            }
        });

        vagueGreetings.forEach(greeting => {
            if (lowerText.includes(greeting)) {
                addFlag('low', 'Linguistic Pattern', `Intentional vagueness detected: "${greeting}".`);
            }
        });

        // TODO: Add false authority and grammatical anomaly checks here
    }

    // PILLAR 3: Technical Indicators
    function analyzeTechnical(text) {
        // Example: IP address in URL
        const ipUrlRegex = /https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
        if (ipUrlRegex.test(text)) {
            addFlag('high', 'Technical Indicator', 'URL uses an IP address instead of a domain name.');
        }

        // TODO: Add typosquatting, shortened links, and suspicious TLD checks here
    }

    // PILLAR 4: Structural Consistency
    function analyzeStructural(headers, body) {
        // Example: Check for generic CTA
        if (body.toLowerCase().includes('click here') || body.toLowerCase().includes('verify now')) {
            addFlag('low', 'Structural Consistency', 'Generic Call-to-Action (CTA) detected without specific context.');
        }
        
        // TODO: Add subject vs body alignment checks here
    }

    // --- 5. SCORING & RENDERING ---
    function addFlag(severity, category, message) {
        state.flags.push({ severity, category, message });
        
        // Weighting: High = 15pts, Medium = 8pts, Low = 3pts
        if (severity === 'high') state.score += 15;
        if (severity === 'medium') state.score += 8;
        if (severity === 'low') state.score += 3;
    }

    function calculateFinalScore() {
        // Cap score at 100
        state.score = Math.min(state.score, 100);
    }

    function renderResults() {
        // Update Score
        DOM.scoreValue.textContent = state.score;
        
        // Update Risk Level & Color
        DOM.riskLevel.className = ''; // Reset classes
        if (state.score <= 30) {
            DOM.riskLevel.textContent = '🟢 Low Risk';
            DOM.riskLevel.classList.add('risk-low');
            DOM.verdictText.textContent = 'This email appears to be legitimate. However, always verify with the sender if unsure.';
        } else if (state.score <= 65) {
            DOM.riskLevel.textContent = '🟡 Medium Risk';
            DOM.riskLevel.classList.add('risk-medium');
            DOM.verdictText.textContent = 'This email contains suspicious elements. Proceed with caution and do not click links.';
        } else {
            DOM.riskLevel.textContent = ' High Risk';
            DOM.riskLevel.classList.add('risk-high');
            DOM.verdictText.textContent = 'High probability of phishing. Do not click links, download attachments, or reply.';
        }

        // Render Flags (SECURITY: Using textContent to prevent XSS)
        DOM.flagsList.innerHTML = ''; // Clear previous
        state.flags.forEach(flag => {
            const li = document.createElement('li');
            li.className = `flag-item ${flag.severity}`;
            
            const icon = document.createElement('span');
            icon.className = 'flag-icon';
            icon.textContent = flag.severity === 'high' ? '🔴' : flag.severity === 'medium' ? '🟡' : '🔵';
            
            const content = document.createElement('div');
            content.className = 'flag-content';
            
            const strong = document.createElement('strong');
            strong.textContent = `${flag.category}:`;
            
            const span = document.createElement('span');
            span.textContent = flag.message; // SAFE: textContent escapes HTML
            
            content.appendChild(strong);
            content.appendChild(span);
            li.appendChild(icon);
            li.appendChild(content);
            DOM.flagsList.appendChild(li);
        });

        // Show Sections
        DOM.outputSection.classList.remove('hidden');
        DOM.feedbackSection.classList.remove('hidden');
        
        // Scroll to results
        DOM.outputSection.scrollIntoView({ behavior: 'smooth' });
    }

    // --- 6. FEEDBACK LOOP ---
    DOM.feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // For now, just show a success message
        alert('Thank you! Your feedback has been recorded and will help improve our gold-standard dataset.');
        DOM.feedbackForm.reset();
    });

    // Initialize
    checkDisclaimer();
});
