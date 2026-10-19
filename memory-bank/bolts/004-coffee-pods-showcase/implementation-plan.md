# Implementation Plan: 004-coffee-pods-showcase

## 1. Goal

Introduce a cross-category promotional showcase section directly beneath the order configuration area in `index.html`. This section showcases high-demand European coffee pod brands available in Luxembourg with significant VAT tax savings (3% Luxembourg food & coffee VAT vs 19-20% in neighboring France/Germany/Belgium), detailing brand, product format, pack quantity, and official price.

## 2. Architecture & Design

- **Component**: `#coffee-pods-showcase` container styled with subtle amber border highlights and deep zinc glassmorphism.
- **Card Elements**:
  1. Senseo Classic / Corsé Megabox (36 soft coffee pads, €5.49)
  2. Lavazza Espresso Maestro / Crema (30 aluminum capsules, €8.90)
  3. Nescafé Dolce Gusto Barista / Lungo (30 capsules, €5.80)
  4. Jacobs Krönung / Dallmayr Prodomo (36 filter pads, €5.20)
- **Bundling & Inquiry Notice**: Explains how customers can bundle coffee pods with their tobacco order via Revolut payment note or messaging their courier.

## 3. Scope & Boundaries

- Pure showcase presentation; no cart addition or complex e-commerce catalog mechanics required to keep tobacco quota compliance clean.
