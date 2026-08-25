# Privacy Policy

*Last updated: 25 Aug 2026*

Your privacy is the core architectural principle of the **Linguistic Phishing Analyser**. This document explains exactly how your data is handled (spoiler: it isn't).

## 1. Data Collection: Zero
This tool does not collect, store, or transmit any of the emails you analyze. 
* There is no backend server.
* There is no database.
* There are no tracking cookies or analytics scripts.

## 2. Local Processing (Client-Side Only)
When you upload a `.eml` file or paste text into the analyzer, the processing happens **entirely within your own web browser** using JavaScript. The content of the email never leaves your device. Once you close or refresh the page, the data is permanently cleared from the application's memory.

## 3. Local Storage
The only data stored on your device is a simple preference flag (`disclaimerAccepted`) in your browser's `localStorage`. This is used solely to remember that you have accepted the Terms of Use, so the disclaimer modal doesn't appear every time you visit. You can clear this at any time by clearing your browser's cache.

## 4. Feedback Mechanism (Optional)
If you choose to submit feedback on the tool's accuracy via the built-in form:
* We only collect your **verdict** (e.g., "Probably yes"), the **email category**, and your **optional text comment**.
* We **do not** collect or transmit the raw email content, headers, or any Personally Identifiable Information (PII) of the email's sender or recipient.
* This data is sent securely to a third-party form handler (e.g., Google Forms) solely for the purpose of curating a gold-standard dataset to improve the tool's linguistic detection models.

## 5. Third-Party Resources (CDNs)
To ensure security and performance, this tool loads open-source libraries (like DOMPurify) via trusted Content Delivery Networks (CDNs) such as jsDelivr. 
* These CDNs may log standard web traffic data (like your IP address and browser user-agent) to deliver the files. 
* However, **no email data or analysis results are ever sent to these CDNs**.

## 6. Your Rights
Since we don't collect your data, there is nothing for us to delete or export. You have complete control over your data because it never leaves your possession.

## 7. Contact
If you have any questions or concerns about this Privacy Policy, please contact the developer:
* **Email:** flaviapissarra+linguisticphishinganalyser@gmail.com
* **LinkedIn:** [linkedin.com/in/flaviapissarra](https://linkedin.com/in/flaviapissarra)
