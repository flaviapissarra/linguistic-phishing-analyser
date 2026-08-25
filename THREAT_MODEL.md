# Threat Model: Linguistic Phishing Analyser

## 1. System Overview
The **Linguistic Phishing Analyser** is a client-side web application designed to analyze suspicious emails for phishing indicators. It processes `.eml` files and raw text directly in the user's browser using JavaScript. 

**Key Architectural Decisions:**
- **100% Client-Side:** No backend server, no database, and no external API calls for core analysis.
- **Zero Data Retention:** Email content is processed in memory and discarded upon page refresh or manual clearing.
- **Static Hosting:** Hosted on GitHub Pages (static HTML/CSS/JS).

## 2. Trust Boundaries
- **User Input (Untrusted):** The `.eml` file and raw text pasted by the user are considered untrusted and potentially malicious.
- **Browser Environment (Trusted/Sandboxed):** The JavaScript execution environment provided by the browser.
- **External CDNs (Partially Trusted):** Third-party libraries (e.g., DOMPurify, Chart.js) loaded via CDN. Mitigated via Subresource Integrity (SRI).
- **GitHub Pages Infrastructure (Trusted):** The hosting provider.

## 3. Threat Modeling Methodology (STRIDE)
We use the STRIDE model to identify potential threats across the application's attack surface.

| Threat Category | Description |
| :--- | :--- |
| **S**poofing | Impersonating the tool or its developer to steal data. |
| **T**ampering | Modifying the application code or the user's input in transit/memory. |
| **R**epudiation | Users denying actions (less relevant here due to no auth/logging). |
| **I**nformation Disclosure | Leaking the contents of the analyzed email to third parties. |
| **D**enial of Service (DoS) | Crashing the user's browser via resource exhaustion. |
| **E**levation of Privilege | Gaining unauthorized access to the user's local system or browser storage. |

## 4. Identified Threats and Mitigations

### 4.1. Cross-Site Scripting (XSS) via Malicious Payloads
- **Category:** Tampering / Information Disclosure
- **Threat:** An attacker sends a phishing email containing a malicious JavaScript payload (e.g., `<script>alert(1)</script>` or `onerror=` attributes). When the user pastes this into the tool and the tool renders the email body, the script executes in the context of the application.
- **Mitigation:** 
  - **Strict Content Security Policy (CSP):** Restricts script execution to `'self'` and trusted CDNs.
  - **DOMPurify Integration:** All user-supplied content is sanitized before being inserted into the DOM.
  - **Safe DOM APIs:** Core logic uses `textContent` instead of `innerHTML` whenever possible.

### 4.2. Regular Expression Denial of Service (ReDoS)
- **Category:** Denial of Service
- **Threat:** An attacker crafts a specific string (e.g., in the email body or headers) that causes a poorly written regular expression to experience catastrophic backtracking, freezing the user's browser tab.
- **Mitigation:**
  - **Regex Auditing:** All regular expressions used for header parsing and linguistic analysis are tested against ReDoS vulnerabilities (e.g., using `safe-regex`).
  - **Input Length Limits:** File uploads are capped at 5MB, and text area inputs are monitored to prevent processing excessively large payloads.

### 4.3. Supply Chain Attack via Compromised CDN
- **Category:** Tampering
- **Threat:** An attacker compromises a third-party library hosted on a CDN (e.g., jsdelivr). When the user loads the tool, the malicious script is executed.
- **Mitigation:**
  - **Subresource Integrity (SRI):** All external scripts and stylesheets include `integrity` hashes. The browser will refuse to execute the resource if the hash does not match the downloaded file.
  - **Pinned Versions:** CDN URLs specify exact version numbers (e.g., `dompurify@3.0.6`), preventing unexpected breaking changes or silent compromises.

### 4.4. Phishing of the Tool Itself (Typosquatting/Cloning)
- **Category:** Spoofing
- **Threat:** An attacker creates a clone of the Linguistic Phishing Analyser on a similar domain (e.g., `linguistic-phishing-analyzr.com`) to trick users into pasting sensitive corporate emails, which the attacker then intercepts.
- **Mitigation:**
  - **Clear Branding & Verification:** The official tool is hosted strictly on `flaviapissarra.github.io/linguistic-phishing-analyser/`.
  - **Privacy-First Architecture:** Since the tool is 100% client-side, a clone *could* theoretically steal data. However, the official `SECURITY.md` and `PRIVACY.md` explicitly state that the official tool *never* sends data out, providing a baseline for users to verify behavior via browser DevTools (Network tab).

### 4.5. MIME Parsing Vulnerabilities
- **Category:** Tampering / DoS
- **Threat:** A malformed `.eml` file causes the JavaScript MIME parser to enter an infinite loop or throw an unhandled exception.
- **Mitigation:**
  - **Graceful Error Handling:** All parsing logic is wrapped in `try...catch` blocks.
  - **Iterative Parsing Limits:** The header parser stops after a predefined maximum number of lines to prevent infinite loops on malformed headers.

## 5. Residual Risks
- **Browser Zero-Days:** The tool relies on the security of the user's browser sandbox. A vulnerability in the browser's JavaScript engine (e.g., V8, SpiderMonkey) could theoretically be exploited via a crafted payload, though this is outside the scope of the application's direct control.
- **User Error:** Users might misinterpret the tool's "Low Risk" score as a guarantee of safety, leading them to click malicious links. This is mitigated by the explicit disclaimer modal and clear verdict language.

## 6. Future Considerations
- **Feedback Loop Security:** When the Human-in-the-Loop (HITL) feedback mechanism is implemented, data will be sent to an external endpoint (e.g., Google Forms). This will require a revised threat model to address data in transit (TLS), endpoint authentication, and PII scrubbing before transmission.
