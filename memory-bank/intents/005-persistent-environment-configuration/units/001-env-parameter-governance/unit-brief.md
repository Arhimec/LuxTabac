# Unit Brief: 001-env-parameter-governance

## Overview
- **Intent**: `005-persistent-environment-configuration`
- **Unit**: `001-env-parameter-governance`
- **Status**: Ready for Construction

## Goals
1. Prevent parameter drift or reset on serverless redeployments by loading Revtag, WhatsApp, and Wero details from GitHub repository parameters (`process.env`).
2. Support phone number sanitization for WhatsApp (e.g. `+352 691...` -> `https://wa.me/352691...`).
3. Maintain backward compatibility with SQLite `app_settings` when environment variables are not provided.
4. Document all supported configuration parameters in a standardized `.env.example` file.
5. Provide visual feedback in the Admin back-office showing which parameters are currently anchored via GitHub / Environment variables.
