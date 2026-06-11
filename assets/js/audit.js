(function () {
  'use strict';

  const STORAGE_KEY = 'tmg-audit-state';
  const REPO_OWNER = 'rmallorybpc';
  const REPO_NAME = 'talent-portability-research';
  const ISSUE_LABEL = 'audit-feedback';

  const auditItems = [
    {
      id: 'bidwell-premium',
      claimText: 'External hires were paid around 18 percent more than internal promotions and received lower performance evaluations during their first two years.',
      sourceUrl: 'https://faculty.wharton.upenn.edu/wp-content/uploads/2012/03/Paying_More_ASQ_edits_FINAL.pdf',
      sourceLabel: 'Bidwell 2011 PDF (Wharton)',
      whatToCheck: 'Search the PDF for the approximately 18 percent premium and the two-year evaluation finding.',
      issueTitle: 'Audit pushback: Bidwell external hire premium claim'
    },
    {
      id: 'boivie-experience',
      claimText: 'Boards with more CEO-hiring experience produce slightly worse subsequent CEO performance, not better. The authors describe this as suggestive of superstitious learning.',
      sourceUrl: 'https://sms.onlinelibrary.wiley.com/doi/full/10.1002/smj.3725',
      sourceLabel: 'Boivie et al. 2025 (Wiley, open access)',
      whatToCheck: "Read the abstract and search the PDF for 'superstitious learning' to confirm the authors use that specific phrase.",
      issueTitle: 'Audit pushback: Boivie experience-does-not-help finding'
    },
    {
      id: 'gurun-forty-percent',
      claimText: 'About 40 percent of client assets follow financial advisors when they move between firms.',
      sourceUrl: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3132127',
      sourceLabel: 'Gurun, Stoffman, and Yonker 2021 SSRN working paper',
      whatToCheck: 'Read the abstract. Confirm the 40 percent figure refers to client assets following advisors specifically.',
      issueTitle: 'Audit pushback: Gurun 40 percent assets-follow claim'
    },
    {
      id: 'groysberg-firm-capabilities',
      claimText: 'Star Wall Street analysts declined in performance after switching firms. Exceptions included stars who moved with their teams and stars who moved to firms with higher capabilities and resources.',
      sourceUrl: 'https://hbr.org/2004/05/the-risky-business-of-hiring-stars',
      sourceLabel: 'Groysberg, Nanda, and Nohria 2004 HBR companion article',
      whatToCheck: 'Confirm analyst decline, team-move exception, and capabilities-and-resources framing. Named firms may appear in Chasing Stars rather than HBR.',
      issueTitle: 'Audit pushback: Groysberg firm capabilities framing'
    },
    {
      id: 'citation-details',
      claimText: 'Every citation in the synthesis (journal name, volume, issue, page numbers, author names, links) is accurate.',
      sourceUrl: 'https://rmallorybpc.github.io/talent-portability-research/citations.html',
      sourceLabel: 'Citations annex',
      whatToCheck: 'Open source links in the annex and confirm metadata matches the citation entries.',
      issueTitle: 'Audit pushback: Citation detail concern'
    }
  ];

  function loadAuditState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (err) {
      return {};
    }
  }

  function saveAuditState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      // localStorage can fail in strict browser privacy modes.
    }
  }

  function updateProgress() {
    const total = document.querySelectorAll("input[type='checkbox'][data-audit-id]").length;
    const checked = document.querySelectorAll("input[type='checkbox'][data-audit-id]:checked").length;
    const count = document.getElementById('audit-progress-count');
    const fill = document.getElementById('audit-progress-fill');

    if (count) {
      count.textContent = String(checked);
    }

    if (fill) {
      const pct = total > 0 ? (checked / total) * 100 : 0;
      fill.style.width = pct + '%';
    }
  }

  function initCheckboxes() {
    const state = loadAuditState();
    const boxes = document.querySelectorAll("input[type='checkbox'][data-audit-id]");

    boxes.forEach(function (checkbox) {
      const id = checkbox.dataset.auditId;
      checkbox.checked = Boolean(state[id]);

      checkbox.addEventListener('change', function () {
        const next = loadAuditState();
        next[id] = checkbox.checked;
        saveAuditState(next);
        updateProgress();
      });
    });

    updateProgress();
  }

  function buildIssueUrl(item) {
    const bodyTemplate = '**Audit item:** ' + item.id + '\n\n' +
      '**Claim in the synthesis:**\n' + item.claimText + '\n\n' +
      '**Source the claim cites:**\n' + item.sourceUrl + '\n\n' +
      '**What I found when I checked:**\n' + '(replace this line with what the source actually says)\n\n' +
      '**Suggested correction or concern:**\n' + '(replace this line with what should change in the synthesis)\n\n' +
      '---\nSubmitted via the audit page verification feature.';

    const params = new URLSearchParams({
      title: item.issueTitle,
      body: bodyTemplate,
      labels: ISSUE_LABEL
    });

    return 'https://github.com/' + REPO_OWNER + '/' + REPO_NAME + '/issues/new?' + params.toString();
  }

  function initIssueButtons() {
    document.querySelectorAll('.audit-item').forEach(function (itemEl) {
      const id = itemEl.dataset.auditId;
      const item = auditItems.find(function (candidate) {
        return candidate.id === id;
      });
      const button = itemEl.querySelector('.report-issue-button');

      if (item && button) {
        button.href = buildIssueUrl(item);
      }
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  function truncate(str, length) {
    if (!str) {
      return '';
    }
    return str.length > length ? str.substring(0, length) + '...' : str;
  }

  async function loadReaderFlaggedIssues() {
    const url = 'https://api.github.com/repos/' + REPO_OWNER + '/' + REPO_NAME + '/issues?labels=' + ISSUE_LABEL + '&state=open&per_page=20';
    const container = document.getElementById('reader-flagged-issues');

    if (!container) {
      return;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch issues');
      }

      const allItems = await response.json();
      const issues = allItems.filter(function (issue) {
        return !issue.pull_request;
      });

      if (issues.length === 0) {
        container.innerHTML = '<p>No reader-flagged issues at this time.</p>';
        return;
      }

      container.innerHTML = issues.map(function (issue) {
        return '<div class="reader-issue">' +
          '<h4><a href="' + issue.html_url + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(issue.title) + '</a></h4>' +
          '<p class="issue-meta">Opened by ' + escapeHtml(issue.user.login) + ' on ' + new Date(issue.created_at).toLocaleDateString() + '</p>' +
          '<p>' + escapeHtml(truncate(issue.body, 200)) + '</p>' +
          '</div>';
      }).join('');
    } catch (err) {
      container.innerHTML = '<p>Could not load reader-flagged issues right now. View open issues at the <a href="https://github.com/' + REPO_OWNER + '/' + REPO_NAME + '/issues?q=is%3Aissue+label%3Aaudit-feedback" target="_blank" rel="noopener noreferrer">repo issues page</a>.</p>';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initCheckboxes();
    initIssueButtons();
    loadReaderFlaggedIssues();
  });
}());
