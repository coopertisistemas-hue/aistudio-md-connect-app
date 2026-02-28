# docs/reports/README.md
> Folder: `docs/reports/`

This folder contains non-executed historical reports, security evidence, and exported artifacts.

---

## Contents

| File | Description |
|------|-------------|
| `CORS_IMPLEMENTATION_SUMMARY.txt` | Summary of the CORS allowlist implementation (Jan 2026) |
| `CORS_SECURITY_QA_REPORT.md` | → moved to `docs/qa/` — QA evidence document |
| `CREDENTIAL_ROTATION_CHECKLIST.md` | Credential rotation procedure following security review |
| `SECURITY_REMEDIATION_NOTICE.md` | Security incident response notice (Jan 2026) |
| `monetization_reordered_final_1765937822013.png` | Exported monetization roadmap image artifact |

---

## Rules

- **Do NOT** place executable scripts here.
- **Do NOT** place files referenced by `package.json` scripts or `src/` imports here.
- Reports are read-only historical artifacts.
- QA evidence files should go in `docs/qa/` instead.

---

## Folder Map

```
docs/
├── qa/           ← QA evidence for each commit (CONNECT gate proof)
├── sprints/      ← Sprint planning and validation reports
├── ops/          ← Local dev guides and operational how-tos
└── reports/      ← One-off exports, security notices, historical summaries
```
