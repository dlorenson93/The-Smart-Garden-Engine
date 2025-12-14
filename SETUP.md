# Setup Instructions

## Troubleshooting Seasonal Recommendations

If the seasonal recommendations page is not working, it's likely due to one of two issues:

### Issue 1: Missing ZIP Code in Profile

The seasonal recommendations feature requires your profile to have a ZIP code set so it can determine your USDA hardiness zone and frost dates.

**Solution:**
1. Click **Profile** in the navigation menu (or the yellow warning card on the dashboard)
2. Enter your ZIP code (e.g., `10001` for New York City)
3. Save your profile - the system will automatically populate your USDA zone and frost dates
4. Return to the Seasonal Recommendations page

### Issue 2: No Crops in Database

The database needs to be populated with crop data for the recommendations to display.

**Solution:**
Run the seed script to populate the database with 14 common crops:

```bash
cd /workspaces/The-Smart-Garden-Engine/backend
npm run seed
```

This will add the following crops to your database:
- lettuce, peas, spinach, kale, broccoli
- tomatoes, peppers, beans, cucumbers, squash
- corn, carrots, beets, cabbage

### Verify It's Working

After completing both steps above:
1. Navigate to **Seasonal Recommendations** in the app
2. You should see:
   - Your USDA zone displayed at the top
   - The current month
   - Your frost dates (if applicable to your zone)
   - A list of recommended crops for this month based on your zone

### Backend Logs

You can check the backend terminal to see debug logs:
```
Seasonal recommendations for zone 7a, month 12:
  - Recommended crop names: lettuce, spinach, kale, peas
  - Found 4 crops in database
```

If you see "Found 0 crops", run the seed script above.
If you see an error about "ZIP code not set", update your profile.
