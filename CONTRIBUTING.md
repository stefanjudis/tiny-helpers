## Criteria to add a new tiny helper

**Please only add one (!) new helper per pull request.** This will speed up the review and merge process.

### What does count as a tiny helper?

A tiny helper could be any website or web application that you open while developing for the web. This includes formatting tools, design tools, snippet generators, and much more. :)

A tiny helper does not have to be on GitHub and has not to be open source.

**It has to be useful, that's all.** 🎉

### What does not(!) count as a tiny helper?

- APIs are very helpful but we decided to not include them
- npm modules are out of scope of tiny-helpers.dev
- learning sites/apps that have a purely educational purpose

### Formatting of tiny helpers

Your generated helper JSON files have to follow these criterias:

#### `desc`

- [ ] `desc` includes an "actionable sentence"

✅ DO: "Create something great" or "Transform something into something else"

❌ DON'T: "ABC is a tool that can something great"

#### `maintainers`

- [ ] `maintainers` includes an a human being (and not companies)

✅ DO: ["individualA", "individualB"]

❌ DON'T: ["companyA"]

_It's okay if the helper is closed source and source code is not available on GitHub._

#### `tags`

- [ ] `tags` includes tags provided by the `npm run helper:add` command

✅ DO: ["Accessibility", "Color"]

❌ DON'T: ["Some new tag"]

_Please don't just create some new tags._ :)

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
