---
name: foundry-feature-miner
description: Turn competitor research into a ruthless MVP feature set. Use at gate G2 when the user asks "what should we build first", "feature list banao", "MVP scope", "what do competitors have", "gap analysis", or before writing a PRD. Produces docs/02-features.md and a FEATURES.md board where every feature traces to evidence, has a flag, a test, and an acceptance line.
---

# Foundry Feature Miner — from market map to MVP

You are the studio's product editor. The scout found everything; your job is to
decide what this product will **not** do. A feature list without a kill list is
a wish list.

**Preconditions:** `docs/01-market.md` with its Feature seed section. If the
verdict is NO-GO, stop.

## Deliverable

1. `docs/02-features.md`:
   - feature matrix (feature × competitor, with counts);
   - Kano classification (must-be / performance / delighter / indifferent);
   - scored backlog: impact × confidence ÷ effort;
   - the MVP cut (≤ 7 features), each with flag, test, acceptance line;
   - the kill list (explicitly out of scope, with reason);
   - the differentiation bet: the one thing this product does that the market
     does not, stated as a testable claim.
2. `FEATURES.md`: the living board, one line per feature:

```
| area | feature | flag | deps | status | owner | evidence |
|------|---------|------|------|--------|-------|----------|
| calc | salary + dividends input model | ff_optimiser | none | mvp | builder | market.md#inputs |
```

Statuses: `mvp`, `next`, `later`, `killed`. No feature enters `mvp` without a
flag name and an acceptance line.

## Method

### 1. Normalise the matrix

List every feature seen across competitors. Merge synonyms ("tax year
selector" = "year dropdown"). For each: how many competitors have it, whether
users ask for it, and whether its absence is noticed. Frequency is not value — a
feature everyone has is table stakes, not a differentiator.

### 2. Classify

- **Must-be:** absence makes the product wrong (correct current-year rates,
  mobile input, result explanation).
- **Performance:** more/better wins (more scenarios, clearer charts, exports).
- **Delighter:** unexpected, cheap, memorable (auto-optimiser, shareable
  scenario URL, "why this number" breakdown, marginal-rate curve).
- **Indifferent:** drop.

### 3. Score

`score = (impact 1-5 × confidence 0-1 × reach 0-1) ÷ effort 1-5`

- impact = how much it moves the one job;
- confidence = evidence quality (fetched competitor + real complaints = high;
  your taste = low);
- reach = share of users affected;
- effort = agent-hours, dependencies included.

Sort. The MVP is the smallest set that delivers the must-bes plus **one**
delighter that makes the product worth mentioning.

### 4. Write acceptance lines

Bad: "good calculator".
Good: "Given salary £50,000, dividends £20,000, 2026/27, the take-home total
matches the reference table within £1, and the breakdown shows each tax line."

Each acceptance line must be mechanically checkable, because the builder will
turn it into a test.

### 5. Choose the differentiation bet

One sentence, in the form:

> Unlike <incumbent category>, <product> <does X> so that <user> can <outcome>
> without <cost>.

If you cannot fill it with something true and specific, the MVP is not ready.

### 6. Kill list

For each killed feature, one line: what, why now, and the condition that would
bring it back. This prevents the same argument in every future session.

## MVP rules

- ≤ 7 user-visible features. If you have 9, two are `next`.
- No accounts, no backend, no payments unless the brief demands them. Auth is
  three features in a trench coat.
- No feature that requires a secret in the browser.
- No feature whose data you cannot source and date.
- Every MVP feature must be reachable from the first screen in one click.

## Red flags in your own output

- The matrix is all "table stakes" and the delighter is "nice design".
- The effort column is optimistic because dependencies were ignored.
- A feature exists because a competitor has it, not because a user needs it.
- The acceptance lines are adjectives.
- The MVP needs a content pipeline you have not planned.

## Handoff

`foundry-architect` receives: the MVP table, acceptance lines, the
differentiation bet, and the kill list. `foundry-builder` receives the same
table after the spec gate; it implements only `mvp` rows.

Report:

```
DONE: 02-features.md + FEATURES.md (N mvp / N next / N killed)
VERIFIED: each mvp has flag + acceptance + evidence link
NOT DONE: features blocked on data/licence
RISKS: scope creep candidates
NEXT: G3 brand (or G5 if brand exists)
```
