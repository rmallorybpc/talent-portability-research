# Repo structure: Does paying for talent work?

Structure spec for GitHub Copilot to scaffold this site to match the existing TMG research repos.

## Reference repos

Match the visual style and navigation patterns from these existing TMG sites:
- https://github.com/rmallorybpc/nhl-free-agency-research
- https://github.com/rmallorybpc/nba-research-project

Verification note: These repo URLs are inferred from the GitHub Pages URLs and assume the standard convention (`<username>/<repo-name>`). Confirm the actual repo URLs before running Copilot.

## Suggested repo name

`talent-portability-research` (or shorter alternative the user prefers).

## File structure

```
talent-portability-research/
├── README.md
├── index.html                  → welcome page (landing page)
├── welcome.html                → alias for index.html (drafts reference welcome.html)
├── key-findings.html           → plain-language research summary
├── business-research.html      → seven sources mapped onto sports findings
├── implications.html           → what this means for HR and comp design
├── citations.html              → full bibliography (converted from citation-annex.md)
├── audit.html                  → honest review of claims and limitations, plus interactive verification
├── METHODS.md                  → at root, linked from welcome and audit pages
├── assets/
│   ├── css/
│   │   └── style.css           → match TMG style from NHL or NBA repo
│   ├── js/
│   │   ├── nav.js              → if existing repos use a nav include
│   │   └── audit.js            → interactive audit feature behavior
│   └── images/                 → empty for now; add figures during drafting
└── .github/
    └── workflows/
        └── pages.yml           → only if existing repos use a GitHub Actions deploy
```

Note: The site uses `index.html` as the canonical landing page. `welcome.html` exists as an alias because some drafts reference `welcome.html` directly.

## Page roles

| File | Role |
|---|---|
| `index.html` (`welcome.html`) | Welcome page. Headline question, short Yes/No answer, brief framing of what the site is, and navigation to the other pages. Should be short and scannable. |
| `key-findings.html` | Plain-language research summary. The four TMG sports studies in two pairs, the business research grouped by what it shows, the portability spectrum, and the synthesis claim. The reader who wants the substance reads this page. |
| `business-research.html` | Source-by-source treatment. For each of the seven sources (six peer-reviewed and one industry research), state what it found, how it was reviewed, and how it maps to the TMG sports findings. |
| `implications.html` | Translation to HR, compensation design, and executive decision making. Soft close to conversation, no specific service named. |
| `citations.html` | Full bibliography from `citation-annex.md`, with working links and review notes for each source. |
| `audit.html` | Honest self-audit. What this piece can claim, what it cannot, the corrections record, and an interactive verification feature where readers can check claims and submit GitHub issues. |

## Navigation

Top nav on every page should include the following items in this order:

1. Welcome (home link to `index.html`)
2. Key Findings (`key-findings.html`)
3. Business Research (`business-research.html`)
4. Implications (`implications.html`)
5. Citations (`citations.html`)
6. Audit (`audit.html`)
7. GitHub (link to repo: `https://github.com/rmallorybpc/talent-portability-research`)

Match the nav bar style from the existing TMG sites. The footer should include the standard "TMG Tool Suite" links to the other TMG research sites.

## Style notes for Copilot

- Match the TMG visual style from the NHL or NBA repo (typography, colors, headers, layout).
- Use sentence case for headings.
- Keep paragraphs short.
- No em-dashes anywhere in the rendered text.
- Source citations should hyperlink to the URLs in the citation annex.

## Content source

All page content will be drafted in markdown first by the user. Each markdown file converts directly to an HTML page using the existing TMG template. The markdown files live in `/drafts/` during writing and are removed once the HTML is built, or can stay as the source of truth and feed a Jekyll build if the existing repos use one.

## Inter-page linking convention

Use relative links between pages:
- `index.html` (welcome) links to all other pages.
- Every other page has a "Where to go next" section at the bottom linking back to welcome and to the other pages in the navigation order.

External links go to the live source pages (Princeton, JSTOR, Oxford Academic, Springer, ScienceDirect, Cerulli).

## README.md content

The README should include:
- One-line project description.
- Link to the live GitHub Pages site.
- Brief summary of the synthesis.
- Methodology note: this is a synthesis piece, not new empirical research. All cited findings come from the seven sources in the citations annex (six peer-reviewed and one industry research), plus one peer-reviewed footnote citation.
- Link to the citation annex.
- Standard TMG repo footer (license, contact, etc.).

## What to ask Copilot

Suggested prompt for an update pass after this site has been initially scaffolded:

> The site structure has changed. Please update the navigation order and add a new page.
>
> New page: `key-findings.html`, converted from `drafts/key-findings-page-draft.md`. This is the plain-language research summary that previously lived inside the welcome page.
>
> Updated welcome page: `drafts/welcome-page-draft.md` is now shorter. Regenerate `index.html` (and `welcome.html` alias) from the updated draft.
>
> Updated navigation order across all pages: Welcome, Key Findings, Business Research, Implications, Citations, Audit, GitHub (external repo link).
>
> Updated "Where to go next" sections at the bottom of each non-welcome page are in the updated drafts. Use those as the source of truth.
