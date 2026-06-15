# Talent Portability Research

**Does paying for talent work?**

A synthesis research site by The Mallory Group.

Live site: [rmallorybpc.github.io/talent-portability-research](https://rmallorybpc.github.io/talent-portability-research)

## Summary

Yes. When the value-creating asset is portable, it transfers with the person.

No. When the value-creating asset is not portable, paying a premium for outside talent rarely delivers the expected return.

This site connects four TMG sports research projects (NHL Free Agency Research, NFL Analysis, NBA Analysis, and NHL Play for Contract) to seven sources from the business and economics literature. The buyer side of the talent market consistently overpays, the conditions under which paying for outside talent works are narrow and identifiable, and the convergence of sports data and business research is the synthesis the site offers.

## Methodology note

This is a synthesis piece, not new empirical research. All cited findings come from sources documented in the citations annex: six peer-reviewed academic sources, one industry research source, and one peer-reviewed footnote citation. The four TMG sports research projects are cited as existing work and used as a structuring lens, not as causal proof.

No new data was collected for this synthesis. See `audit.html` for the full self-audit, including what the synthesis can and cannot claim.

## Site structure

| Page | Role |
| --- | --- |
| `index.html` | Welcome. Headline question, short Yes/No answer, framing, and navigation. |
| `key-findings.html` | Plain-language summary of the four TMG sports studies and the business research synthesis. |
| `business-research.html` | Source-by-source treatment of each cited source. |
| `implications.html` | Translation to hiring, managing stars, and structuring work. |
| `citations.html` | Full bibliography with working links and review notes. |
| `audit.html` | Honest self-audit. What the piece can and cannot claim. Interactive verification feature where readers can check claims and submit GitHub Issues. |

## Primary sources

Six peer-reviewed academic sources frame the synthesis:

- Groysberg, B. (2010). *Chasing Stars: The Myth of Talent and the Portability of Performance.* Princeton University Press.
- Bidwell, M. (2011). Paying more to get less: The effects of external hiring versus internal mobility. *Administrative Science Quarterly,* 56(3), 369-407.
- Roll, R. (1986). The hubris hypothesis of corporate takeovers. *Journal of Business,* 59(2), 197-216.
- Boivie, S., Gee, I. H., Gentry, R. J., and Graffin, S. D. (2025). Do boards learn to hire? The effect of board experience with CEO replacement on CEO performance. *Strategic Management Journal,* 46(10), 2467-2491.
- Berry-Stolzle, T. R. and Eckles, D. L. (2019). It is about building a book of business: Incentives of insurance salespersons from future renewals. *Geneva Papers on Risk and Insurance,* 44(4), 702-731.
- Gurun, U. G., Stoffman, N., and Yonker, S. E. (2021). Unlocking clients: The importance of relationships in the financial advisory industry. *Journal of Financial Economics,* 141(3).

One industry research source provides practitioner-side data:

- Cerulli Associates (2021, 2025). Research on financial advisor transitions.

One peer-reviewed footnote citation:

- Bertrand, M. and Mullainathan, S. (2001). Are CEOs rewarded for luck? The ones without principals are. *Quarterly Journal of Economics,* 116(3), 901-932.

See `citations.html` for the full annex with links, review process notes, and verification status for each source.

## Audit standard and reader verification

The Mallory Group audits its own work as a standard. This site extends that standard to the reader.

The audit page documents what the synthesis can and cannot claim, and includes a "Verify the claims yourself" section where readers can:

- Tick a checkbox on each of five load-bearing claims after verifying it against the source. Progress saves in browser localStorage.
- Submit a GitHub Issue if they find an error or concern. Issues are tagged with either `audit-feedback` (for the five claim-specific checks) or `feedback` (for general issues).
- See open issues displayed on the audit page in real time via the GitHub Issues API.

The corrections record on the audit page documents what the pre-publication audit caught and what was changed.

## Repository architecture

Page content lives in markdown drafts under `/drafts/`. Rendered HTML pages live at the repo root. Visual styling and interactive behavior are in `/assets/`. To update content, edit the markdown source and regenerate the corresponding HTML page.

The interactive audit feature is in `/assets/js/audit.js`. The specification for that feature is documented in `audit-feature-spec.md` at the repo root.

## TMG behavioral economics research series

This site is the synthesis installment in The Mallory Group's behavioral economics research series. The underlying sports research projects are:

- [NHL Free Agency Research](https://rmallorybpc.github.io/nhl-free-agency-research/welcome.html)
- [NBA Analysis](https://rmallorybpc.github.io/nba-research-project/)
- [NFL Analysis](https://rmallorybpc.github.io/nflanalysis/dashboard/src/)
- [NHL Play for Contract](https://rmallorybpc.github.io/nhl-play-for-contract/)

## License

Research content is provided for informational purposes. See repository for full terms.

## Contact

The Mallory Group. Research inquiries and feedback via GitHub Issues.
