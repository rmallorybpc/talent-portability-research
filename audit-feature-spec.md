# Audit feature implementation spec

For GitHub Copilot to implement the interactive "Verify the claims yourself" section at the bottom of the audit page.

## Overview

The audit page concludes with a "Verify the claims yourself" section. The section presents five load-bearing claims from the synthesis. Each claim has:

1. The claim text.
2. A link to the source where the claim can be verified.
3. A checkbox the reader ticks once they have verified the claim.
4. A button that opens a pre-filled GitHub Issue for the reader to flag a problem.

Reader checkbox state persists in the browser via localStorage. Issues submitted by anyone are visible on the page in real time via the GitHub Issues API.

## Behavior summary

Three pieces of behavior:

1. **Persistent checkboxes.** When a reader ticks a checkbox, the state saves to localStorage. On return visit, the boxes are still ticked. A progress counter ("3 of 5 checks complete") updates in real time.

2. **GitHub Issue submission.** When a reader clicks "Report an issue," the page opens GitHub's new issue page in a new tab, pre-filled with a structured template specific to the claim being reported.

3. **Live issue display.** When the audit page loads, it queries the GitHub Issues API for open issues with the `audit-feedback` label and displays them in the "Reader-flagged issues" section. If a claim has been flagged, the list shows the issue title, body excerpt, and link to the full issue.

## Audit items data structure

The five audit items below provide the data the interactive section needs.

```javascript
const auditItems = [
  {
    id: "bidwell-premium",
    claimText: "External hires were paid around 18 percent more than internal promotions and received lower performance evaluations during their first two years.",
    sourceUrl: "https://faculty.wharton.upenn.edu/wp-content/uploads/2012/03/Paying_More_ASQ_edits_FINAL.pdf",
    sourceLabel: "Bidwell 2011 PDF (Wharton)",
    whatToCheck: "Search the PDF for the approximately 18 percent premium and the two-year evaluation finding.",
    issueTitle: "Audit pushback: Bidwell external hire premium claim"
  },
  {
    id: "boivie-experience",
    claimText: "Boards with more CEO-hiring experience produce slightly worse subsequent CEO performance, not better. The authors describe this as suggestive of superstitious learning.",
    sourceUrl: "https://sms.onlinelibrary.wiley.com/doi/full/10.1002/smj.3725",
    sourceLabel: "Boivie et al. 2025 (Wiley, open access)",
    whatToCheck: "Read the abstract and search the PDF for 'superstitious learning' to confirm the authors use that specific phrase.",
    issueTitle: "Audit pushback: Boivie experience-does-not-help finding"
  },
  {
    id: "gurun-forty-percent",
    claimText: "About 40 percent of client assets follow financial advisors when they move between firms.",
    sourceUrl: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3132127",
    sourceLabel: "Gurun, Stoffman, and Yonker 2021 SSRN working paper",
    whatToCheck: "Read the abstract. Confirm the 40 percent figure refers to client assets following advisors specifically.",
    issueTitle: "Audit pushback: Gurun 40 percent assets-follow claim"
  },
  {
    id: "groysberg-firm-capabilities",
    claimText: "Star Wall Street analysts declined in performance after switching firms. Exceptions included stars who moved with their teams and stars who moved to firms with higher capabilities and resources.",
    sourceUrl: "https://hbr.org/2004/05/the-risky-business-of-hiring-stars",
    sourceLabel: "Groysberg, Nanda, and Nohria 2004 HBR companion article",
    whatToCheck: "Confirm the articles describe the analyst decline finding, the team-move exception, and the firm-capabilities-and-resources framing. Note: the named firms come from the book Chasing Stars and may or may not appear in the HBR articles.",
    issueTitle: "Audit pushback: Groysberg firm capabilities framing"
  },
  {
    id: "citation-details",
    claimText: "Every citation in the synthesis (journal name, volume, issue, page numbers, author names, links) is accurate.",
    sourceUrl: "citations.html",
    sourceLabel: "Citations annex",
    whatToCheck: "Click through any source link in the annex. Confirm the journal page shows the same volume, issue, page numbers, and authors as cited in the annex.",
    issueTitle: "Audit pushback: Citation detail concern"
  }
];
```

## HTML structure for each audit item

```html
<div class="audit-item" data-audit-id="bidwell-premium">
  <h3>Check 1. Bidwell external hire premium</h3>
  <p class="claim"><strong>Claim:</strong> [claimText]</p>
  <p class="source">
    <strong>Source to verify against:</strong>
    <a href="[sourceUrl]" target="_blank" rel="noopener">[sourceLabel]</a>
  </p>
  <p class="what-to-check"><strong>What to check:</strong> [whatToCheck]</p>
  <label class="audit-checkbox">
    <input type="checkbox" data-audit-id="bidwell-premium">
    I verified this claim against the source.
  </label>
  <a class="report-issue-button" href="[built dynamically]" target="_blank" rel="noopener">
    Report an issue with this claim
  </a>
</div>
```

## Progress counter

```html
<div class="audit-progress">
  <p>Progress: <span id="audit-progress-count">0</span> of 5 checks complete.</p>
  <div class="audit-progress-bar">
    <div class="audit-progress-fill" id="audit-progress-fill"></div>
  </div>
</div>
```

## JavaScript behavior

### Checkbox persistence

```javascript
const STORAGE_KEY = "tmg-audit-state";

function loadAuditState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveAuditState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // Silent fail if localStorage is unavailable. Reader can still tick boxes during the session.
  }
}

function initCheckboxes() {
  const state = loadAuditState();
  document.querySelectorAll("input[type='checkbox'][data-audit-id]").forEach(checkbox => {
    const id = checkbox.dataset.auditId;
    checkbox.checked = !!state[id];
    checkbox.addEventListener("change", () => {
      const state = loadAuditState();
      state[id] = checkbox.checked;
      saveAuditState(state);
      updateProgress();
    });
  });
  updateProgress();
}

function updateProgress() {
  const total = document.querySelectorAll("input[type='checkbox'][data-audit-id]").length;
  const checked = document.querySelectorAll("input[type='checkbox'][data-audit-id]:checked").length;
  document.getElementById("audit-progress-count").textContent = checked;
  const fill = document.getElementById("audit-progress-fill");
  if (fill) fill.style.width = `${(checked / total) * 100}%`;
}
```

### GitHub Issue URL builder

```javascript
const REPO_OWNER = "rmallorybpc";
const REPO_NAME = "talent-portability-research";
const ISSUE_LABEL = "audit-feedback";

function buildIssueUrl(item) {
  const bodyTemplate = `**Audit item:** ${item.id}

**Claim in the synthesis:**
${item.claimText}

**Source the claim cites:**
${item.sourceUrl}

**What I found when I checked:**
(replace this line with what the source actually says)

**Suggested correction or concern:**
(replace this line with what should change in the synthesis)

---
Submitted via the audit page verification feature.`;

  const params = new URLSearchParams({
    title: item.issueTitle,
    body: bodyTemplate,
    labels: ISSUE_LABEL
  });

  return `https://github.com/${REPO_OWNER}/${REPO_NAME}/issues/new?${params.toString()}`;
}

function initIssueButtons() {
  document.querySelectorAll(".audit-item").forEach(itemEl => {
    const id = itemEl.dataset.auditId;
    const item = auditItems.find(i => i.id === id);
    const button = itemEl.querySelector(".report-issue-button");
    if (item && button) {
      button.href = buildIssueUrl(item);
    }
  });
}
```

### Live issue display

```javascript
async function loadReaderFlaggedIssues() {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?labels=${ISSUE_LABEL}&state=open&per_page=20`;
  const container = document.getElementById("reader-flagged-issues");
  if (!container) return;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch issues");
    const issues = await response.json();

    if (issues.length === 0) {
      container.innerHTML = "<p>No reader-flagged issues at this time.</p>";
      return;
    }

    container.innerHTML = issues.map(issue => `
      <div class="reader-issue">
        <h4><a href="${issue.html_url}" target="_blank" rel="noopener">${escapeHtml(issue.title)}</a></h4>
        <p class="issue-meta">Opened by ${escapeHtml(issue.user.login)} on ${new Date(issue.created_at).toLocaleDateString()}</p>
        <p>${escapeHtml(truncate(issue.body, 200))}</p>
      </div>
    `).join("");
  } catch (e) {
    container.innerHTML = "<p>Could not load reader-flagged issues right now. View open issues directly at the <a href='https://github.com/" + REPO_OWNER + "/" + REPO_NAME + "/issues?q=is%3Aissue+label%3Aaudit-feedback' target='_blank' rel='noopener'>repo issues page</a>.</p>";
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function truncate(str, length) {
  if (!str) return "";
  return str.length > length ? str.substring(0, length) + "..." : str;
}
```

### Initialization

```javascript
document.addEventListener("DOMContentLoaded", () => {
  initCheckboxes();
  initIssueButtons();
  loadReaderFlaggedIssues();
});
```

## GitHub repo setup

For the issue feature to work, the repo needs:

1. A label called `audit-feedback`. Create it under repo Settings, then Labels. Suggested color: any neutral color like gray or yellow. Description: "Reader-submitted audit verification feedback."

2. The repo must be public. The Issues API endpoint without authentication only works for public repos.

3. If the repo URL differs from `https://github.com/rmallorybpc/talent-portability-research`, update the REPO_OWNER and REPO_NAME constants in the JavaScript.

## Style notes

The audit feature should visually match the rest of the TMG site. Specific guidance:

- The "Verify the claims yourself" section should have visual separation from the audit summary above it (a horizontal rule, a different background tint, or a heading style change).
- Checkboxes should be styled consistently with any other form elements on TMG sites.
- The progress bar should be subtle, not loud. Single-color fill against a light background works.
- The "Report an issue" buttons should look like secondary actions, not primary ones. The primary action is reading and verifying, not flagging.
- Reader-flagged issues, when present, should be visually grouped but not styled as alerts. They are information, not warnings.

## What is in Phase 1 vs later

In scope for the initial build:

- Five audit items with checkboxes and persistent state.
- GitHub Issue submission buttons with pre-filled templates.
- Live display of open `audit-feedback` issues via the GitHub API.

Not in scope for the initial build, but easy to add later:

- A "share my progress" feature (export the visitor's verification state).
- Email notification when a new issue is filed.
- Auditor badges or recognition for readers who file useful issues.
- Resolved issues displayed alongside open ones, with the resolution explained.

## Accessibility notes

- Each checkbox should have an associated label (the `<label>` wrapper in the HTML structure handles this).
- The progress counter updates should announce via aria-live if a screen reader is in use.
- All links should have descriptive text rather than "click here."
- Keyboard navigation should work throughout the audit section.
