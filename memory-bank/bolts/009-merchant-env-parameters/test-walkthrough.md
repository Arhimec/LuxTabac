# Test Walkthrough: Bolt 009 - Merchant Environment Parameters

## Test Execution Summary
- **Test File**: `tests/bolt-009.test.js`
- **Total Tests in Bolt**: 8
- **Total Project Tests**: 59
- **Status**: All 59 tests passing (100% success rate)

## Verified Test Cases
1. **`formatWhatsAppLink` Helper**:
   - Verified that `+352 691 123 456` converts to `https://wa.me/352691123456`.
   - Verified that `https://chat.whatsapp.com/...` URLs are preserved intact.
   - Verified that empty/null values safely return default `https://wa.me/`.
2. **SQLite & Default Fallback**:
   - Verified `getAllSettings()` defaults to database records when `process.env` keys are unset, with `envConfigured` flags set to `false`.
3. **Revolut Parameter Precedence**:
   - Verified `process.env.REVOLUT_REVTAG` overrides database values.
   - Verified stripping of leading `@` symbols.
4. **WhatsApp Parameter Precedence**:
   - Verified `process.env.WHATSAPP_NUMBER` formats to `https://wa.me/...` and overrides database values.
5. **Wero Parameter Precedence**:
   - Verified `process.env.WERO_RECIPIENT` overrides database values.
6. **Serverless API Integration**:
   - Verified `/api/settings` GET and PUT handlers correctly expose `envConfigured` metadata alongside `settings`.
7. **Frontend Admin DOM**:
   - Verified presence of `#env-badge-revtag`, `#env-badge-whatsapp`, and `#env-badge-wero` in `index.html`.
8. **Documentation Completeness**:
   - Verified `.env.example` existence in project root and completeness of documented environment parameters.
