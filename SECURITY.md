# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest `main` | ✅ Active Development |
| 0.1.x | ⚠️ Best Effort |

CrowOps is currently under active development. Security patches will be applied to the latest version on the `main` branch.

## Reporting a Vulnerability

> ⚠️ **Please do NOT open a public issue for security vulnerabilities.**

If you discover a security vulnerability, please report it responsibly:

1. **Contact** the project maintainers privately via [GitHub Security Advisories](https://github.com/Hussein-Furaty/CrowOps/security/advisories/new) or email.
2. **Include** in your report:
   - A clear description of the vulnerability.
   - Steps to reproduce the issue.
   - Potential impact and severity assessment.
   - Suggested fix or mitigation (if available).
3. **Allow** a reasonable timeframe for the issue to be addressed before public disclosure.

## Response Timeline

| Action | Timeline |
|--------|----------|
| Initial acknowledgment | Within 48 hours |
| Assessment and triage | Within 7 days |
| Fix and release | As soon as possible |

## Security Best Practices

CrowOps is committed to security by design:

- All passwords are hashed using industry-standard algorithms.
- SSH credentials are stored securely.
- API access is protected by Spring Security.
- Sensitive data is never exposed through REST API responses.
- Dependencies are regularly reviewed for known vulnerabilities.

We appreciate responsible disclosure and thank all security researchers who help keep CrowOps secure.
