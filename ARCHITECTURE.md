# Architecture & Design Decisions

This document outlines the core architectural choices made for the **Linguistic Phishing Analyser**. Every decision was driven by three primary goals: **maximizing user privacy**, **ensuring security by design**, and **leveraging computational linguistics** to detect modern social engineering attacks.

## 1. 100% Client-Side Architecture
**Decision:** The entire application runs in the user's browser using Vanilla JavaScript. There is no backend server, no database, and no API calls for the core analysis.
**Rationale:** 
* **Privacy-First:** Security professionals and individuals often need to analyze sensitive corporate emails. A client-side architecture guarantees that zero data leaves the user's device.
* **Zero Infrastructure Cost:** Eliminates the need for server maintenance, scaling, or cloud hosting fees.
* **Offline Capability:** The tool can function in air-gapped or restricted network environments once the static assets are loaded.

## 2. Limited Header Parsing Strategy
**Decision:** Instead of using a heavy, full-featured MIME parser, the tool extracts only 8 specific headers (`From`, `Reply-To`, `To`, `Subject`, `Return-Path`, `Message-ID`, `X-Originating-IP`, `Authentication-Results`).
**Rationale:**
* **Attack Surface Reduction:** Full MIME parsers are complex and prone to edge-case vulnerabilities. By limiting the scope to high-signal headers, we reduce the risk of parser-based Denial of Service (DoS) or memory exhaustion.
* **Performance:** Extracting specific strings via optimized Regular Expressions is significantly faster and keeps the browser's main thread responsive.

## 3. The 4-Pillar Analysis Model
**Decision:** The detection engine is divided into four distinct pillars: Header Forensics, Linguistic Patterns, Technical Indicators, and Structural Consistency.
**Rationale:**
* **Bridging Disciplines:** Traditional tools focus heavily on technical indicators (IP reputation, SPF/DKIM). By adding a dedicated **Linguistic Pattern** pillar, this tool leverages computational linguistics to detect the *human* element of phishing (urgency, false authority, vagueness) that bypasses technical filters.
* **Weighted Scoring:** The pillars are weighted differently in the final risk score. Linguistic and Header anomalies carry more weight than structural issues, reflecting their higher correlation with sophisticated spear-phishing and Business Email Compromise (BEC).

## 4. Security Hardening (Defense in Depth)
**Decision:** Implementation of strict Content Security Policy (CSP), Subresource Integrity (SRI) for all CDNs, and DOMPurify for DOM manipulation.
**Rationale:**
* **XSS Prevention:** Since the tool processes untrusted user input (potentially malicious emails), strict CSP and safe DOM APIs (`textContent` over `innerHTML`) prevent Cross-Site Scripting.
* **Supply Chain Security:** SRI ensures that if a CDN (like jsDelivr) is compromised, the browser will reject the altered library, preventing remote code execution.

## 5. Feedback Loop via Google Forms
**Decision:** The Human-in-the-Loop (HITL) feedback mechanism uses a simple Google Forms integration rather than a custom backend.
**Rationale:**
* **Data Curation:** This approach allows for immediate, low-friction data collection. The responses are automatically aggregated into a spreadsheet, making it easy to manually curate a "Gold Standard" dataset for future publication on Hugging Face.
* **Privacy Preservation:** The form is designed to collect only metadata (verdict, category, optional comment) and explicitly excludes the raw email content, maintaining the zero-data-collection promise.

## 6. Future Architectural Considerations
* **Web Workers:** For future iterations, moving the heavy regex parsing and linguistic analysis to a Web Worker will ensure the UI remains completely unblocked during the analysis of large `.eml` files.
* **TensorFlow.js Integration:** To evolve from rule-based detection to probabilistic ML, a lightweight, browser-based NLP model could be loaded to analyze sentiment and intent without compromising the client-side privacy model.
