Perform a comprehensive, read-only security review of this repository from scratch on every run. Always create one new GitHub issue documenting the current review for human review, even if no actionable findings are identified. Do NOT fix any vulnerabilities or ask whether to fix them.

Scope:
- Independently examine the current repository contents. Do not search for, read, or rely on existing security issues, previous vulnerability reports, prior review findings, or existing repository security alerts to guide the review.
- Review application code, dependencies, configuration, authentication and authorization, input validation, injection risks, secrets handling, cryptography, file handling, logging, CI/CD workflows, and deployment/container configuration.
- Follow repository instructions and use available security scanners where appropriate.
- Run fresh analysis where appropriate rather than retrieving historical scanner results. Public vulnerability databases and advisories may be used to assess dependencies present in the current repository, but not to find prior reports about this repository.
- Review every area in scope systematically; do not stop after the first finding or limit the review to scanner-detected or previously known vulnerability patterns. Trace relevant data flows and trust boundaries and inspect security-sensitive logic manually.
- Do not alter repository files, execute untrusted code, or test against live services.
- Investigate findings in context. Do not treat scanner output as confirmed without verifying its applicability. Clearly separate confirmed vulnerabilities from potential risks requiring further investigation.

For each finding, include:
1. A descriptive title, severity (Critical, High, Medium, or Low), and confidence level.
2. Affected files and line ranges, with links pinned to the reviewed commit.
3. Root cause, supporting evidence, attack prerequisites, and realistic impact.
4. Safe, non-destructive reproduction steps where feasible.
5. Relevant CWE or security advisory identifiers, when applicable.
6. Recommended remediation in prose only—do not implement it.

Reporting:
- Do not list, search, or read existing issues for duplicates, related findings, or tracking status. Do not classify findings as new or already tracked.
- Always create a new consolidated issue titled “Security review findings — <date> — <short commit SHA>”. Document all findings from this run directly in that issue without referencing, reusing, updating, or deduplicating against earlier reports.
- Include an executive summary, a severity summary table, detailed findings, and a separate section for unverified concerns.
- Record the reviewed branch and commit SHA, tools used, review coverage, and anything inaccessible, skipped, or inconclusive.
- Never include secret values, credentials, personal data, or weaponized exploits. Redact sensitive evidence.
- Before publishing, assess whether the issue would expose sensitive vulnerability details publicly. Omit sensitive details and reproduction steps that would enable exploitation from a public issue; publish a sanitized summary and note that the omitted evidence requires private review. Still create a new issue for this run.
- If no actionable findings are identified, document the review scope and limitations without inventing findings.
- Do not claim that the review found every vulnerability or that the repository is vulnerability-free.

Constraints:
- Do not modify code, dependencies, configuration, workflows, or existing issues.
- Do not create commits, branches, pull requests, or automated fixes.
- Do not ask for permission to fix findings, offer to implement fixes, or present remediation action choices. Recommended remediation belongs only in the issue as prose for human review.
- The only permitted persistent change is creating the consolidated review issue.
- If issue creation is unavailable, return complete issue-ready Markdown and explain the limitation.

When finished, return the new issue URL and a brief summary of findings by severity. Do not ask any follow-up questions about fixing findings.
