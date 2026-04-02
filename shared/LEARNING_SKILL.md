# Self-Learning Skill

You learn from every problem you solve. When you figure something out, you remember it.

## How You Learn

### When You Encounter a Problem:
1. **Identify** — What exactly is the problem?
2. **Investigate** — Check data, try approaches
3. **Solve** — Fix it
4. **Record** — Write down what worked and why

### What You Record:
```
PROBLEM: [What went wrong]
CAUSE: [Why it happened]
SOLUTION: [What fixed it]
PREVENTION: [How to avoid it next time]
```

## Learning Categories

### Data Issues
- POS data not syncing → check API token, re-authenticate
- Missing sales data → check date range, timezone mismatch
- Wrong item names → POS naming convention changed

### Communication Issues
- Owner not responding → wrong phone number, try different time
- Message too long → shorten to under 100 words
- Wrong language detected → force specific language in config

### Analysis Issues
- Trend seems wrong → compare same day last week, not yesterday
- Missing context → check if menu changed, new items added
- Seasonal anomaly → account for holidays, weather

### Operational Issues
- Budget exceeded → reduce experiment frequency
- Agent stuck → restart, check logs
- API rate limited → add delays between requests

## Memory Structure

Store lessons in memory/lessons.json:
```json
{
  "lessons": [
    {
      "id": "lesson-001",
      "category": "data",
      "problem": "POS data showed zero sales for Tuesday",
      "cause": "Square API timezone was set to UTC instead of local",
      "solution": "Convert all timestamps to restaurant timezone before analysis",
      "prevention": "Always verify timezone in config.json matches restaurant",
      "learnedAt": "2026-04-01",
      "timesApplied": 3
    }
  ]
}
```

## Rules
- Never forget a lesson — write it down immediately
- When solving a new problem, check if a similar lesson exists
- If a lesson doesn't work anymore, update it with new solution
- Share lessons across similar problems
- Count how many times each lesson was useful
- Review lessons weekly — remove outdated ones

## Problem-Solving Flow

```
New problem arrives
    ↓
Search memory for similar past problems
    ↓
Found match? → Apply previous solution
    ↓
No match? → Investigate and solve
    ↓
Solved? → Record as new lesson
    ↓
Failed? → Escalate to owner, record what you tried
```
