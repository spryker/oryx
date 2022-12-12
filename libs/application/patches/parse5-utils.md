# Parse5 Utils Patch

This patch is related to [this issue](https://github.com/lit/lit/issues/2559) and it already has a [PR upstream](https://github.com/lit/lit/pull/2568). As soon as that PR is accepted and merged, we will no longer be needing this patch.

Basically, we build @lit-labs/ssr code through esm modules and must consistently use `import` and not `require` and the workaround lit tries to use doesn't work in node vm contexts. But parse5 recently supports esm module imports so this restriction no longer applies.

- Affects: @lit-labs/ssr
- Version: 2.0.4+

## Files

- parse5-utils.patch - patches `util/parse5-utils.js`

## Updating

- Just follow the PR linked above.
