# Contributing to CrowOps

Thank you for your interest in contributing to CrowOps! We welcome contributions from everyone.

---

## How to Contribute

1. **Fork** the repository.
2. **Create a branch** from `main` using the naming convention below.
3. **Make your changes** following the project's coding standards.
4. **Test** your changes to ensure the project builds successfully.
5. **Submit a Pull Request** with a clear description of your changes.

---

## Branch Naming Convention

Use the following prefixes:

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feature/` | New functionality | `feature/server-management` |
| `bugfix/` | Bug fixes | `bugfix/ssh-connection-timeout` |
| `refactor/` | Code refactoring | `refactor/user-service-cleanup` |
| `docs/` | Documentation updates | `docs/api-reference` |
| `hotfix/` | Critical production fixes | `hotfix/security-patch` |

---

## Commit Message Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>
```

**Types:**

| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes |
| `refactor` | Code refactoring (no feature or fix) |
| `test` | Adding or updating tests |
| `chore` | Build, CI, or tooling changes |

**Examples:**

```
feat(user): add user registration endpoint
fix(ssh): resolve connection timeout on large payloads
docs(readme): update getting started section
refactor(server): extract validation to dedicated service
```

---

## Code Standards

- Follow **Clean Architecture** and **SOLID** principles.
- Place code in the correct module under `modules/` or `shared/`.
- Never expose JPA entities directly through the REST API — use DTOs.
- Write meaningful variable and method names.
- Keep methods focused and small.

---

## Pull Request Checklist

Before submitting your PR, please verify:

- [ ] The project compiles without errors (`./mvnw compile`).
- [ ] Commit messages follow the Conventional Commits format.
- [ ] Changes are scoped to a single concern.
- [ ] Documentation is updated if the change affects architecture, API, or database.
- [ ] No unnecessary files or IDE configurations are included.

---

## Reporting Issues

- **Bugs**: Use the [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md) template.
- **Features**: Use the [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md) template.

---

Thank you for helping improve CrowOps! 🐦‍⬛
