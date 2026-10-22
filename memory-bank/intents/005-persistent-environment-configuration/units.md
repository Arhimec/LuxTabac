# Units: Intent 005 - Persistent Environment Configuration

## Unit Inventory

### Unit 001: 001-env-parameter-governance
- **Path**: `units/001-env-parameter-governance/`
- **Purpose**: Provide consistent parameter resolution for Revolut Revtag, WhatsApp contact number/link, and Wero recipient handle via GitHub repository environment variables and process.env, with graceful SQLite fallback.
- **Stories**:
  - `001-merchant-env-parameters.md`: Load and prioritize `REVOLUT_REVTAG`, `WHATSAPP_NUMBER`/`WHATSAPP_LINK`, and `WERO_RECIPIENT` from environment variables, expose configuration status in `/api/settings`, document `.env.example`, and reflect configuration in Admin UI.
