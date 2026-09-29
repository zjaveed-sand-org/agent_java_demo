Perform a comprehensive, read-only security review of this repository. Document findings in one GitHub issue for human review. Do NOT fix any vulnerabilities.

Scope:
- Review application code, dependencies, configuration, authentication and authorization, input validation, injection risks, secrets handling, cryptography, file handling, logging, CI/CD workflows, and deployment/container configuration.
- Follow repository instructions and use available security scanners where appropriate.
- Do not alter repository files, execute untrusted code, or test against live services.
- Investigate findings in context. Do not treat scanner output as confirmed without verifying its applicability. Clearly separate confirmed vulnerabilities from potential risks requiring further investigation.

For each finding, include:
1. A descriptive title, severity (Critical, High, Medium, or Low), and confidence level.
2. Affected files and line ranges, with links pinned to the reviewed commit.
3. Root cause, supporting evidence, attack prerequisites, and realistic impact.
4. Safe, non-destructive reproduction steps where feasible.
5. Relevant CWE or security advisory identifiers, when applicable.
6. Recommended remediation in prose only—do not implement it.
7. Whether the finding is new or already tracked.

Reporting:
- Check existing issues to identify duplicates and related findings.
- Create one consolidated issue titled “Security review findings — <date>”. Reference existing reports instead of duplicating their findings.
- Include an executive summary, a severity summary table, detailed findings, and a separate section for unverified concerns.
- Record the reviewed branch and commit SHA, tools used, review coverage, and anything inaccessible, skipped, or inconclusive.
- Never include secret values, credentials, personal data, or weaponized exploits. Redact sensitive evidence.
- Before publishing, assess whether the issue would expose sensitive vulnerability details publicly. If so, stop and request guidance on private reporting.
- If no actionable findings are identified, document the review scope and limitations without inventing findings.
- Do not claim that the review found every vulnerability or that the repository is vulnerability-free.

Constraints:
- Do not modify code, dependencies, configuration, workflows, or existing issues.
- Do not create commits, branches, pull requests, or automated fixes.
- The only permitted persistent change is creating the consolidated review issue.
- If issue creation is unavailable, return complete issue-ready Markdown and explain the limitation.

When finished, return the issue URL and a brief summary of findings by severity.
