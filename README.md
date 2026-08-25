# 🛡️ Linguistic Phishing Analyser

> **Detecting social engineering through computational linguistics.**  
> A privacy-first, 100% client-side tool that analyzes the linguistic and technical patterns of phishing emails. No data leaves your browser.

[![Client-Side](https://img.shields.io/badge/Architecture-100%20Client--Side-blue)](https://github.com/flaviapissarra/linguistic-phishing-analyser)
[![Privacy](https://img.shields.io/badge/Privacy-Zero%20Data%20Collection-green)](https://github.com/flaviapissarra/linguistic-phishing-analyser)
[![Security](https://img.shields.io/badge/Security-CSP%20%2B%20SRI%20%2B%20DOMPurify-orange)](https://github.com/flaviapissarra/linguistic-phishing-analyser)
[![License](https://img.shields.io/badge/License-MIT-yellow)](https://github.com/flaviapissarra/linguistic-phishing-analyser/blob/main/LICENSE)

---

## 📌 The Problem
Traditional phishing detectors rely heavily on technical indicators (IP reputation, domain age, SPF/DKIM). However, modern spear-phishing and Business Email Compromise (BEC) attacks often bypass these filters by using **sophisticated linguistic manipulation**—urgency, false authority, and psychological triggers—to trick the human recipient.

##  The Solution
The **Linguistic Phishing Analyser** proposes bridging the gap between cybersecurity and computational linguistics. It evaluates suspicious emails across **four distinct pillars**, identifying not just technical anomalies, but the rhetorical patterns of social engineering. 

Built with a **privacy-first architecture**, the entire analysis runs locally in the user's browser. No emails are uploaded to external servers, making it safe for SOC analysts and individuals to test sensitive corporate communications.

## 🔍 How It Works: The 4 Pillars of Analysis

1. **Header Forensics**: Parses `.eml` files to detect discrepancies in `From` vs `Reply-To`, SPF/DKIM/DMARC failures, and suspicious `X-Mailer` signatures.
2. **Linguistic Patterns (Core)**: Identifies social engineering triggers, such as artificial urgency, intentional vagueness, false authority appeals, and grammatical anomalies typical of non-native phishing campaigns.
3. **Technical Indicators**: Scans the email body for typosquatting, IP-based URLs, suspicious TLDs, and shortened links.
4. **Structural Consistency**: Evaluates the alignment between the subject line, the body content, and the signature/Call-to-Action (CTA).

## 🛠️ Tech Stack & Security Features

- **Core**: HTML5, CSS3, Vanilla JavaScript (Zero dependencies for core logic).
- **Security Hardening**: 
  - Strict **Content Security Policy (CSP)** to prevent XSS.
  - **Subresource Integrity (SRI)** for all external libraries.
  - **DOMPurify** integration for safe DOM manipulation.
  - **Regex DoS (ReDoS) Protection**: All regular expressions are optimized and tested against catastrophic backtracking.
- **Data Privacy**: 100% Local execution. No backend, no database, no API keys required.

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/flaviapissarra/linguistic-phishing-analyser.git
