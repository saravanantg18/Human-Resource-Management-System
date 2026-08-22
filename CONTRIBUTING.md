# 🤝 Contributing Guidelines for Team Members

Welcome to the **Dayflow HRMS** project repository! This guide outlines the workflow and standards for our 4-member development team to collaborate smoothly on GitHub.

---

## 👥 Team Roles & Responsibilities

| Contributor | Primary Domain | Core Responsibilities |
| :--- | :--- | :--- |
| **Member 1 (Lead)** | Core Auth & Architecture | System state (`AuthContext`, `HRContext`), Login Portals, Security logic |
| **Member 2** | Dashboard & Attendance | Main Dashboard cards, Stopwatch timer, Attendance terminal & daily/weekly logs |
| **Member 3** | Profile & Leave System | Profile management, Document repository, Leave application & approval workflow |
| **Member 4** | Payroll & Analytics | Printable Payslips, Payroll adjustments table, Recharts visual analytics |

---

## 🌿 Git Branching Convention

To prevent merge conflicts and maintain code quality, follow these branch naming conventions:

- **Features**: `feature/<member-name>-<short-description>`
  - *Example*: `feature/member1-admin-login-portal`
- **Bug fixes**: `bugfix/<member-name>-<issue-description>`
  - *Example*: `bugfix/member3-leave-date-calculator`
- **Documentation**: `docs/<member-name>-<topic>`
  - *Example*: `docs/member4-readme-update`

---

## 📝 Commit Message Format

Use standardized commit messages prefixing your changes:

- `feat:` A new feature or component
- `fix:` A bug fix
- `docs:` Documentation changes only
- `style:` Formatting, UI styling tweaks, Tailwind adjustments
- `refactor:` Code refactoring without changing functionality
- `test:` Adding or updating tests

*Example*:
```bash
git commit -m "feat: add inline employee payroll adjustment control in PayrollView"
```

---

## 🔄 Pull Request (PR) Workflow

1. **Pull Latest Changes**:
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/member2-attendance-stopwatch
   ```

3. **Develop & Commit**:
   ```bash
   git add .
   git commit -m "feat: implement live workday timer counter"
   ```

4. **Push Branch to GitHub**:
   ```bash
   git push origin feature/member2-attendance-stopwatch
   ```

5. **Open a Pull Request**:
   - Go to GitHub repository $\rightarrow$ Pull Requests $\rightarrow$ New Pull Request.
   - Select your branch to merge into `main`.
   - Fill out the PR template checklist.
   - Tag at least **1 other team member** as a reviewer.

---

## 🧪 Pre-Merge Checklist

Before marking a PR ready for review:
- [ ] Run `npm run build` locally to verify 0 build errors.
- [ ] Ensure all new components use Tailwind CSS classes and Lucide icons.
- [ ] Test state persistence in `localStorage`.
- [ ] Check responsive layout on both desktop and mobile viewports.
