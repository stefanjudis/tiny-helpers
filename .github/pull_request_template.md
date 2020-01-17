# Thank you for opening a pull request to tiny-helpers.dev ❤️

Before you submit your PR please make sure that your PR follows a few conventions. :)

## How to add a new helper

**Please only add one (!) new helper per pull request.** This will speed up the review and merge process.

### What does not count as a tiny helper?

- while APIs are very helpful we decided to not include them
- npm modules are out of scope per defintion of tiny-helpers
- learning sites that have a purely educational purpose

### Formatting of tiny helpers

Your helper JSON files have to follow these criterias:

---

- [ ] `desc` includes an "actionable sentence"

✅ DO: "Create something great" or "Transform something into something else"

❌ DON'T: "ABC is a tool that can something great"

---

- [ ] `maintainers` includes an a human being (and not companies)

✅ DO: individualA,individualB

❌ DON'T: companyA

---

To sum it up – your JSON addition should look as follows:

```json
{
  "name": "A new helper",
  "desc": "Add a new helper to tiny-helpers.dev",
  "url": "https://some.url",
  "tags": ["Misc"],
  "maintainers": ["PersonA"],
  "addedAt": "2020-01-17"
}
```
