# Tech Stack

## Overview
LuxTabac is a client-side frontend web application designed for fast, zero-dependency catalog browsing and instant Revolut QR payments. Built with semantic HTML5, modern vanilla JavaScript, and Tailwind CSS.

## Languages
- **HTML5 & Vanilla JavaScript (ES2022+)**: Pure browser-native runtime execution without transpilation overhead or complex build steps.
- **CSS3 / Tailwind CSS**: Utility-first responsive design tailored for dark mode aesthetics and high-density mobile displays.

## Framework
- **Vanilla SPA / Native DOM**: Zero external framework dependencies. State is handled through lightweight, structured in-memory modules and DOM manipulation.
- **Local QR Engine**: Standalone, offline-capable ISO/IEC 18004 QR generation (`qrcode.min.js`) with Error Correction Level Q (25% redundancy) for instant smartphone scanning.

## Authentication
- **Client-Side Legal Age Verification (18+)**: Session-based age gate compliance adhering to Luxembourg tobacco legislation (*Loi modifiée du 11 août 2006 relative à la lutte antitabac*).

## Backend & API Layer
- **Node.js Serverless Functions**: Lightweight API endpoints hosted on Vercel (`/api/orders`) handling order persistence, retrieval, and status updates.

## Database & Storage
- **Local SQLite / Embedded Database**: SQLite database (`better-sqlite3` or file-based SQLite driver with Vercel `/tmp` runtime compatibility or local data directory) providing relational ACID persistence, structured table schemas, and indexed order queries.

## Infrastructure & Deployment
- **Deployment Target**: Vercel (configured via `vercel.json` routing frontend static assets and serverless `/api` endpoints).
- **Edge / Serverless Execution**: Fast responses, zero managed database hosting costs.

## Package Manager
- **npm**: Manages Node.js server dependencies (`better-sqlite3` or SQLite driver, serverless router, etc.).

## Decision Relationships
- Shifting from raw browser `localStorage` to a local SQLite database accessed via Vercel serverless API routes gives true structured relational queries, avoids browser storage quota limits, and enables centralized multi-device order retrieval while remaining lightweight on Vercel.
