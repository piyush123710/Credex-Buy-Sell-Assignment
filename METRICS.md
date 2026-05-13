# Metrics & Instrumentation

## North Star Metric
**Total Potential Savings Identified ($)**
- **Why**: This metric perfectly aligns the value for the user (saving money) with the value for Credex (identifying demand for credits). If this number is going up, we are reaching the right users and surfacing real value.

## Input Metrics
1.  **Audit Completion Rate**: % of users who start the form and reach the results page. This tracks UX friction.
2.  **Average Tools Per Audit**: Are we capturing the full stack or just one tool? More tools = higher probability of finding significant savings.
3.  **Viral Share Rate**: % of results pages that trigger a "Share to Clipboard" or social share. This measures the viral loop.

## Instrumentation Plan
1.  **PostHog (First step)**: Instrument the form steps to identify where users drop off (e.g., "Do they get stuck on the Seats/Spend field?").
2.  **Lead Capture Events**: Track "Email Submitted" vs "Consultation Booked" as separate conversion goals.
3.  **Tool-Specific Popularity**: Track which AI tools are most common. This informs Credex's credit acquisition strategy.

## Pivot Decision Number
**< 2% Lead Capture Rate**
- If fewer than 2% of people who see a $500+ savings audit are willing to give their email for a full report, then the "value proposition" of the audit isn't clear enough. We would pivot to a "results first, email later" model or change the copy to be more aggressive.
