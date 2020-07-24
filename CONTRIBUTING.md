# Criteria to add a new tiny helper

- ❗ **Please only add one (!) new helper per pull request.** This will speed up the review and merge process.

- ❗ **Please have a look at open PRs and issues.** There might be the chance that someone else opened a PR with your tool already. :) 

## What does count as a tiny helper?

> A collection of free single-purpose online tools for web developers...

- A tiny helper is any website or web application that developers could open and use while developing for the web. Tiny helpers solve and help with common problems such as code formatting, design, code generation, and much more. :)
- A tiny helper does not have to be available on GitHub and has not to be open source.
- A tiny helper can be used right away.
- **It has to be useful, that's all.** 🎉

## What does not(!) count as a tiny helper?

- **APIs** (it's too hard to make the decision which API should go in and which should not)
- **JS or CSS libraries / npm modules** (tiny-helpers.dev is about online resources)
- **learning sites/apps** that have a purely educational purpose (tiny helpers continue to have value as a developer)
- **plugins for other online tools**
- **tools behind a login**

## Formatting of tiny helpers

Your generated helper JSON files have to follow these criterias:

- `desc` - includes an "actionable sentence"

   ✅ DO: "Create something great" or "Transform something into something else"

   ❌ DON'T: "ABC is a tool that can something great"

- `maintainers` - includes a human being (and not companies)

  ✅ DO: ["individualA", "individualB"]

   ❌ DON'T: ["companyA"]

   _It's okay if the helper is closed source and source code is not available on GitHub._

- `tags` - includes tags provided by the `npm run helper:add` cli command

   ✅ DO: ["Accessibility", "Color"]

   ❌ DON'T: ["Some new tag"]

   _Please don't just create some new tags, we want to be careful to not introduce tags that will only include one helper._

   _Please don't set more than three tags, we want to keep the tags tidy._

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
