# Security Policy

## Supported Versions

Since the **Linguistic Phishing Analyser** is a client-side web application hosted on GitHub Pages, the only supported version is the current `main` branch. 

## Reporting a Vulnerability

I take the security of this tool seriously. If you discover a security vulnerability, please report it responsibly. **Do not open a public GitHub issue for security vulnerabilities.**

Please send an email to **flaviapissarra+linguisticphishinganalyser@gmail.com** with the following details:
- A clear description of the vulnerability.
- Step-by-step instructions to reproduce the issue.
- The potential impact of the vulnerability.
- (Optional) A suggested fix or mitigation.

### What to Expect
- **Acknowledgment:** I will acknowledge receipt of your report within **48 hours**.
- **Assessment:** I will provide an initial assessment and a timeline for a fix within **7 days**.
- **Resolution:** Once a fix is deployed, I will notify you and credit you in the release notes (unless you prefer to remain anonymous).

## Scope

### In Scope
- Cross-Site Scripting (XSS) via malicious email payloads.
- Regular Expression Denial of Service (ReDoS) via crafted `.eml` files.
- Bypasses of the Content Security Policy (CSP).
- Data leakage (if any data is found to be transmitted to external servers).
- Subresource Integrity (SRI) bypasses on external libraries.

### Out of Scope
- UI/UX bugs or visual glitches.
- Feature requests or suggestions for new analysis pillars.
- Theoretical attacks that require physical access to the user's device.
- Vulnerabilities in third-party libraries that are already patched in their latest releases (please report these to the library maintainers instead).

## Security Architecture Note

This tool is designed with a **privacy-first, zero-trust architecture**. It runs 100% client-side in the user's browser. There is no backend, no database, and no server-side processing. All analysis, including the parsing of potentially malicious `.eml` files, is sandboxed within the browser's JavaScript engine. 

Thank you for helping keep this tool safe!
