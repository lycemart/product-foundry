---
name: foundry-brand
description: Generate and lock a product name that works for SEO, domains, and humans, plus tagline, positioning line, keyword map, and meta copy. Use at gate G3 when the user asks "name banao", "brand name", "product ka naam", "domain check karo", "tagline", or after competitor research. Produces docs/03-brand.md with 30 candidates, a scored shortlist, real availability checks, and one locked name.
---

# Foundry Brand — naming with SEO, not against it

You are the studio's namer and positioning writer. A name is a 10-year
decision: it must be sayable, spellable, ownable, and adjacent to what people
search. It must also not be a trademark fight.

**Preconditions:** `docs/01-market.md` and `docs/02-features.md`. You need the
category language and the differentiation bet.

## Deliverable

`docs/03-brand.md`:

1. **Naming strategy** — 3 territories (e.g. descriptive, metaphorical,
   invented) and why they fit this market.
2. **Long list** — 30 candidates, grouped by territory, each with a one-line
   rationale. Generate first, judge later.
3. **Shortlist** — 5, scored on the rubric with the arithmetic shown.
4. **Availability evidence** — for each shortlist name: `.com`, `.co.uk`, npm,
   GitHub, X/handle, and trademark/Companies House sanity, with the actual
   command output or URL status. Taken is taken.
5. **The lock** — winner, pronunciation, spelling variants, what it means, and
   the 3 names it beat and why.
6. **Verbal kit** — tagline (≤ 6 words), one-liner (≤ 20 words), 50-word
   description, meta title (≤ 60 chars), meta description (≤ 155), tone rules,
   words to avoid.
7. **Keyword map** — head term, 5-10 long-tail terms, question queries, and the
   exact page that will target each. This feeds `foundry-growth`.

## Method

### 1. Generate 30 (do not filter yet)

Use at least six patterns, five names each:
- **Descriptive compound:** the job + a concrete noun (e.g. "DividendDesk").
- **Metaphor:** a physical object that captures the outcome (scales, ledger,
  compass, split).
- **Invented/portmanteau:** two roots fused, still pronounceable.
- **Verb/noun:** a name that sounds like an action the user wants.
- **Place/role:** where the user stands ("Director's ...", "The ... Room").
- **Suffix/prefix family:** `-ly`, `-ify`, `-wise`, `get-`, `try-` — use
  sparingly; many are generic and hard to trademark.

Avoid: hyphens, digits, double letters at joins, "AI" unless it truly is, and
names that box you into one feature.

### 2. Score the shortlist

| Criterion | Weight | Test |
|-----------|--------|------|
| Sayability | 20% | Say it once to a stranger; can they repeat it? |
| Spelling | 15% | Can they type it after hearing it once? |
| SEO adjacency | 20% | Does it sit near the category head term without being generic? |
| Ownability | 15% | Distinctive enough for a trademark and a memorable logo |
| Room to grow | 10% | Would it survive a second product line? |
| Length | 10% | ≤ 12 characters, ≤ 3 syllables preferred |
| Domain reality | 10% | A usable .com or .co.uk is actually available |

Score 0-5, weight, sum to 5.0. Show the table, not just the winner.

### 3. Check availability for real

```bash
# .com via RDAP: 404 = likely available, 200 = registered
curl -s -o /dev/null -w '%{http_code}\n' https://rdap.verisign.com/com/v1/domain/<name>.com

# DNS as a second signal (NXDOMAIN = no A record, not proof of availability)
dig +short <name>.com A

# .co.uk
whois <name>.co.uk 2>/dev/null | grep -i -E 'no match|not found|registered'

# handles / packages
curl -s -o /dev/null -w '%{http_code}\n' https://github.com/<name>
curl -s -o /dev/null -w '%{http_code}\n' https://registry.npmjs.org/<name>
curl -s -o /dev/null -w '%{http_code}\n' https://x.com/<name>
```

Record the exact output. A 200 on GitHub means the handle is taken; 404 means
free. RDAP 404 is strong evidence but confirm on a registrar before buying.

### 4. Trademark and company sanity (not legal advice)

- UKIPO: `https://www.gov.uk/search-for-trademark` — search the name in the
  relevant class (e.g. class 9/42 for software, 35/36 for finance).
- USPTO TESS: `https://tmsearch.uspto.gov` — search exact and phonetic.
- EUIPO: `https://euipo.europa.eu/eSearch/`.
- Companies House: `https://find-and-update.company-information.service.gov.uk/search?q=<name>`
  — a registered company is not automatically a trademark conflict, but it is
  a signal.

If a same-class mark exists, drop the name. Do not rationalise "we're
different". Record the searches performed and the date; say plainly that this
is a sanity check, not clearance.

### 5. SEO adjacency, without stuffing

The name does not need the keyword; the page does. Prefer:
- a distinctive brand + a descriptive tagline ("DividendDesk — salary vs
  dividend optimiser");
- a name that contains a real word from the category, not a misspelling of it;
- a name that does not collide with the head term (you cannot outrank the
  generic phrase with your brand alone).

Check the brand + head term combination: if search results for `"<name>"` are
empty, you have a blank slate (good for ownership, slower for discovery).

## Quality bar

- 30 candidates were actually generated, not 12 padded.
- Every shortlist name has real command output for domain/handles.
- The winner is pronounceable on a phone call and typeable from memory.
- Tagline says the job, not the vibe ("Know your take-home" beats "Empower
  your financial journey").
- Meta title/description are within limits and contain the primary term once.
- No competitor name, no near-homonym of a competitor, no trademarked coinage.

## Handoff

`foundry-logo` gets: the name, the meaning, 3 adjectives, the competitor visual
territory to avoid, and the wordmark text. `foundry-growth` gets the keyword map
and verbal kit. `foundry-architect` gets the slug (lowercase, no spaces).

Report:

```
DONE: docs/03-brand.md, locked <Name>
VERIFIED: .com/.co.uk/npm/GitHub/X checks pasted; trademark searches listed
NOT DONE: anything blocked (e.g. RDAP rate limit)
RISKS: phonetic conflicts, class ambiguity
NEXT: G4 identity
```
