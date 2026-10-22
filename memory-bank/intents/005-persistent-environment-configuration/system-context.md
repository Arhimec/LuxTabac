# System Context: Intent 005 - Persistent Environment Configuration

## Architecture Overview

```mermaid
flowchart TD
    GH[GitHub Repo Secrets & Variables / Vercel Env] -->|Injects at runtime/deploy| EnvVars[process.env]
    EnvVars -->|1. Priority resolution| SettingsService[api/settings.js & api/_db.js]
    SQLite[SQLite app_settings Table] -->|2. Local persistence fallback| SettingsService
    Defaults[Hardcoded Fallbacks] -->|3. Safe baseline| SettingsService

    SettingsService -->|Public GET /api/settings| PublicStore[LuxTabac Store Frontend]
    PublicStore -->|Revolut Pay| RevolutCTA[Revolut.me Link & QR]
    PublicStore -->|WhatsApp Share| WhatsAppCTA[WhatsApp Courier Chat URL]
    PublicStore -->|Wero Instant Pay| WeroCTA[Wero Pay URI & QR]
    
    SettingsService -->|Admin GET/PUT /api/settings| BackOffice[Admin Settings Panel]
    BackOffice -->|Shows (Env Configured) Badges| AdminUser[Store Administrator]
```

## Parameter Mapping Matrix

| Parameter | Primary Env Variable | Alternate Env Variable | SQLite Key | Default Baseline |
| :--- | :--- | :--- | :--- | :--- |
| **Revolut Revtag** | `REVOLUT_REVTAG` | `REVTAG` | `revtag` | `vladimtul` |
| **WhatsApp Number / Link** | `WHATSAPP_NUMBER` | `WHATSAPP_LINK` | `whatsapp_link` | `https://wa.me/` |
| **Wero Recipient** | `WERO_RECIPIENT` | `WERO_NUMBER` | `wero_recipient` | `+352 691 000 000` |
| **Admin User** | `ADMIN_USER` | - | - | `admin` |
| **Admin Password** | `ADMIN_PASSWORD` | - | - | `luxtabac2026!` |

## Operational Resilience
In serverless environments (such as Vercel or cloud runtimes), SQLite databases in ephemeral directories (`/tmp`) reset upon container restart or deployment. Reading merchant settings from GitHub Variables / Environment Variables ensures 100% consistency, zero drift across cold starts, and secure parameter management directly from GitHub settings.
