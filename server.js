const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Save calculator lead + results to Supabase
app.post('/api/calculator', async (req, res) => {
  try {
    const {
      first_name, email, club_name,
      courts, cleaning_method, hours_per_day, hourly_rate, frequency,
      annual_cleaning_cost, cece_annual_cost, annual_savings,
      hours_freed, payback_months, roi_tier
    } = req.body;

    const { data, error } = await supabase
      .from('calculator_leads')
      .upsert({
        email,
        first_name,
        club_name,
        courts,
        cleaning_method,
        hours_per_day,
        hourly_rate,
        frequency,
        annual_cleaning_cost,
        cece_annual_cost,
        annual_savings,
        hours_freed,
        payback_months,
        roi_tier,
        created_at: new Date().toISOString()
      }, { onConflict: 'email' });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Calculator running on port ' + PORT);
});
