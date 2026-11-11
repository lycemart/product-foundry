# Workflow orchestration

`pipeline.js` is the script body for the DSH `workflow` tool. It runs gates
1-9 as subagents with a JSON schema per gate, writes artifacts into the product
repo, and refuses to deploy unless `deploy: true`.

```js
// workflow tool args
{ "slug": "my-product", "idea": "one paragraph", "repo": "/root/sites/my-product", "deploy": false }
```

The script returns a gate summary only. Inspect the artifacts between gates;
a workflow that returns "done" with empty files is a failure.

Deploy stays off by default. `deploy: true` is the owner's go, not a convenience.
