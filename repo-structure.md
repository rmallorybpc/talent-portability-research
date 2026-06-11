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
├── index.html                  → renamed from welcome.html or used as landing page
├── welcome.html                → the synthesis page (main thesis)
├── business-research.html      → seven sources mapped onto sports findings
├── audit.html                  → honest review of claims and limitations
├── implications.html           → what this means for HR and comp design
├── citations.html              → full bibliography (converted from citation-annex.md)
├── METHODS.md                  → at root, linked from welcome and audit pages
├── assets/
│   ├── css/
│   │   └── style.css           → match TMG style from NHL or NBA repo
│   ├── js/
│   │   └── nav.js              → if existing repos use a nav include
│   └── images/                 → empty for now; add figures during drafting
└── .github/
    └── workflows/
        └── pages.yml           → only if existing repos use a GitHub Actions deploy
```

Note: The NHL repo uses `welcome.html` as the landing page and `index.html` for the data explorer. The NBA repo uses standard conventions. This site has no data tool, so the simplest convention is:
- `index.html` is the welcome / synthesis page
- All other content pages are named by topic

Alternatively, mirror the NHL convention exactly by using `welcome.html` as the landing page. Pick whichever matches the existing pattern Copilot finds when it scans the reference repos.

## Page roles

| File | Role |
|---|---|
| `index.html` or `welcome.html` | Synthesis: the headline question, the short answer, the sports findings, the business research, the spectrum, soft close to implications |
| `business-research.html` | Source-by-source treatment. For each of the seven sources (six peer-reviewed and one industry research), state what it found, how it was reviewed, and how it maps to the TMG sports findings |
| `audit.html` | Honest self-audit. What this piece can claim, what it cannot, where the analogy weakens, which sources carry the most weight |
| `implications.html` | Translation to HR, compensation design, and executive decision making. Soft close to conversation, no specific service named |
| `citations.html` | Full bibliography from `citation-annex.md`, with working links and review notes for each source |

## Navigation

Top nav on every page should include:
- TMG (home link to the index/welcome page)
- Welcome
- Business research
- Audit
- Implications
- Citations
- (Optional) link to GitHub source

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
- `welcome.html` → `business-research.html`, `audit.html`, `implications.html`, `citations.html`
- Same for all other pages back to welcome

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

Suggested prompt for Copilot:

> Scaffold a GitHub Pages research site repo following the structure and visual style of these two existing repos: https://github.com/rmallorybpc/nhl-free-agency-research and https://github.com/rmallorybpc/nba-research-project. The new repo is named `talent-portability-research`. It has five pages: index/welcome, business-research, audit, implications, and citations. Use the file structure documented in `repo-structure.md` (this file). All page content will be provided as markdown files; convert each to an HTML page that matches the visual template of the reference repos. Set up GitHub Pages deployment using the same workflow as the reference repos.
