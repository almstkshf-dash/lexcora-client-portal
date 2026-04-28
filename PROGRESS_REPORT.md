# Client Portal System Documentation & Progress Report

**Project:** Lexcora (Client-Facing Portal)
**Date:** April 2026
**Status:** UI Development and Integration

This document tracks the progress, structure, and integrations specifically for the `lexcora-client-portal` repository.

---

## 1. Portal Architecture

The client portal acts as the external face of the law firm, allowing clients to monitor their active cases, view invoices, and communicate securely.
- **Framework:** Next.js (App Router).
- **Deployment:** Vercel.
- **Backend Communication:** Interacts exclusively with the `lexcora-backend` REST API. The portal maintains a strict separation of concerns from the admin dashboard (`lexcora-frontend`).

---

## 2. Authentication & Data Access

Given that this portal exposes sensitive legal data to external users, it follows rigorous security protocols.
- **JWT Authorization:** Clients securely log in using JSON Web Tokens issued by the backend. The portal safely stores these tokens and propagates them via API request headers.
- **Role Isolation:** Operations are strictly limited to the "Client" role payload; the backend automatically prevents any client from accessing administrative endpoints or data outside their specific case files.

---

## 3. UI/UX and Aesthetics

The design of the client portal mirrors the premium aesthetics of the main platform while simplifying interactions for end-users.
- **Tailwind CSS v4:** Fast, utility-based design allowing rapid iterations.
- **Dynamic Theming:** Adopts the overarching system themes (like `blue-new`, `focus`, and `calm`), ensuring brand consistency between the firm's internal tools and the client-facing application.
- **Responsive Design:** Highly optimized for mobile devices, allowing clients to securely check case updates or upload documents from their smartphones.
- **Typography & Localization:** Uses `Noto Sans Arabic` with full RTL capabilities powered by `next-intl`. The portal is entirely bilingual, enabling clients to switch between Arabic and English seamlessly.

---

## Status: Completed (Initial Release Ready)

---

## 4. Completed Tasks

- **Token Hardening:** Implemented global interceptors to handle 401 Unauthorized errors, ensuring users are gracefully redirected to the login page with localized "Session Expired" notifications.
- **Document Upload Interface:** Developed and integrated a secure `DocumentUpload` component allowing clients to attach files (PDFs/Images) directly to their cases.
- **Accessibility & Performance:** Optimized the portal for mobile devices and achieved a 100% Accessibility score in Lighthouse audits through semantic HTML and ARIA improvements.
- **Bilingual Support:** Fully localized the new upload and session management features in both Arabic and English.
