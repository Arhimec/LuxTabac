# Story: 001-merchant-env-parameters

## Metadata
- **Unit**: 001-env-parameter-governance
- **Intent**: 005-persistent-environment-configuration
- **Priority**: Must Have
- **Status**: Planned

## Description
Load and prioritize store merchant parameters (`REVOLUT_REVTAG`, `WHATSAPP_NUMBER`/`WHATSAPP_LINK`, `WERO_RECIPIENT`) from GitHub repository variables and environment variables (`process.env`) so that configuration remains consistent and durable across deployments, serverless cold starts, and container recycles.

## Acceptance Criteria
1. **Environment Parameter Resolution**:
   - `REVOLUT_REVTAG` / `REVTAG`: Resolves from `process.env.REVOLUT_REVTAG || process.env.REVTAG || sqlite.revtag || 'vladimtul'`.
   - `WHATSAPP_NUMBER` / `WHATSAPP_LINK`:
     - If `WHATSAPP_NUMBER` is set (e.g. `+352 691 123 456`), automatically converts to `https://wa.me/352691123456`.
     - Else checks `process.env.WHATSAPP_LINK || sqlite.whatsapp_link || 'https://wa.me/'`.
   - `WERO_RECIPIENT` / `WERO_NUMBER`: Resolves from `process.env.WERO_RECIPIENT || process.env.WERO_NUMBER || sqlite.wero_recipient || '+352 691 000 000'`.
2. **Metadata Transparency**:
   - `/api/settings` response includes an `envConfigured` map indicating which keys are anchored via environment variables (`{ revtag: boolean, whatsapp: boolean, wero: boolean }`).
3. **Admin UI Badging**:
   - The admin settings panel (`#admin-panel-settings`) displays a discrete badge (e.g. `🔒 GitHub Env`) next to fields that are populated via environment variables.
4. **Repository Documentation**:
   - Create a `.env.example` in the project root documenting all supported variables for GitHub repository configuration.
5. **Zero-Regression & Fallback**:
   - If no environment variables are defined, the system operates identically to prior behavior using SQLite `app_settings` and hardcoded defaults.
