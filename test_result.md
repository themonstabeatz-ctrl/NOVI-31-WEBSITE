# SPA Booking Test - Email Verification

## Test Objective
Test ALL SPA card bookings to verify:
1. Correct prices are displayed (with discounts)
2. Emails are sent to: grujovicsavatije@gmail.com
3. Discount is applied correctly (NOT double discount)

## Cards to Test
1. **Silky Body Ritual** (SPA1) - 15% discount
2. **Gentle Touch Ritual** (SPA2) - 10% discount  
3. **Deep Renewal Ritual** (SPA3) - 5% discount
4. **Silky Herbal Compress Ritual** (SPA_HC_1) - 5% discount
5. **Thai Herbal Compress Ritual** (SPA_HC_2) - 10% discount
6. **Aroma Stone Harmony Ritual** (SPA_HC_3) - 15% discount
7. **SPA Zone** (SPAZONE) - 5% discount
8. **Romantični paket za parove** (ROMANTIC_COUPLE) - 10% discount
9. **Romantični piling paket za parove** (ROMANTIC_PEELING) - 15% discount

## Test Email
grujovicsavatije@gmail.com

## API Base
https://price-consistency.preview.emergentagent.com

## Frontend URL
http://localhost:3000/spa

## Test Steps
For each card:
1. Navigate to /spa
2. Scroll to the card
3. Select any required options (if applicable)
4. Click "Zakažite"
5. Fill contact form with test data
6. Submit booking
7. Verify email received with correct pricing

## Test Data
- First Name: Test
- Last Name: SPA
- Phone: 0601234567
- Email: grujovicsavatije@gmail.com
- Date: 2025-12-30
- Time: 11:00
