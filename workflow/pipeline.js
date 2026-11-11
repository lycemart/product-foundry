// Product Foundry — full-studio orchestration for the DSH workflow tool.
//
// args = {
//   slug: "dividend-desk",
//   idea: "one paragraph idea with the named user and the one job",
//   repo: "/root/sites/dividend-desk",
//   gates: [1,2,3,4,5,6,7,8,9],   // optional; omit to run all
//   deploy: false                  // must be true AND the owner must have said go
// }
//
// Every phase writes its artifact into the repo. The workflow returns a
// summary only; inspect the files between phases before trusting "done".

const slug = args.slug;
const repo = args.repo || `/root/sites/${slug}`;
const idea = args.idea;
const gates = args.gates || [1, 2, 3, 4, 5, 6, 7, 8, 9];
const want = (n) => gates.includes(n);

const base = `/root/.dsh/skills/product-foundry/references`;

const common = `
Product: ${slug}
Repo: ${repo} (create dirs if missing; do not touch other products)
Idea: ${idea}
Read the doctrine and pipeline first:
- ${base}/doctrine.md
- ${base}/pipeline.md
Use the matching section of ${base}/delegation.md for your role.
Follow the artifact header contract. Put your deliverable at the exact path.
Report only: DONE / VERIFIED / NOT DONE / RISKS / NEXT.
Do not deploy, do not print secrets, do not go outside your gate.
`;

const artifact = {
  type: "object",
  additionalProperties: false,
  required: ["gate", "status", "artifact", "summary", "blockers"],
  properties: {
    gate: { type: "number" },
    status: { type: "string", enum: ["approved", "draft", "blocked"] },
    artifact: { type: "string" },
    summary: { type: "string" },
    blockers: { type: "array", items: { type: "string" } },
  },
};

async function gate(n, title, prompt) {
  if (!want(n)) return { gate: n, status: "skipped", artifact: "", summary: "skipped by args", blockers: [] };
  phase(`G${n} ${title}`);
  const res = await agent(common + "\n" + prompt, {
    label: `G${n} ${title}`,
    schema: artifact,
  });
  if (!res) return { gate: n, status: "blocked", artifact: "", summary: "agent failed", blockers: ["agent returned null"] };
  log(`G${n}: ${res.status} — ${res.summary}`);
  return res;
}

const results = [];

results.push(
  await gate(
    1,
    "Market",
    `Role: foundry-scout. Deliverable: ${repo}/docs/01-market.md.
8-15 real competitors with fetched URLs, feature frequency, demand evidence,
gaps, positioning, GO/CONDITIONAL/NO-GO scorecard with arithmetic.
If NO-GO: stop and say so; do not soften it.`
  )
);

results.push(
  await gate(
    2,
    "Features",
    `Role: foundry-feature-miner. Deliverable: ${repo}/docs/02-features.md and
${repo}/FEATURES.md. MVP <= 7 features, each with flag + acceptance line +
evidence link; kill list; differentiation bet.`
  )
);

results.push(
  await gate(
    3,
    "Brand",
    `Role: foundry-brand. Deliverable: ${repo}/docs/03-brand.md.
30 names, rubric, top 5, real .com/.co.uk/npm/GitHub/X checks (paste status),
trademark sanity, one locked name, tagline, meta copy, keyword map.`
  )
);

results.push(
  await gate(
    4,
    "Identity",
    `Role: foundry-logo. Deliverable: ${repo}/brand/{logo,logo-mark,logo-mono,favicon,og-image}.svg,
tokens.json, proofs, ${repo}/docs/04-identity.md.
Original geometry; verify 16px, mono, dark, AA contrast; view the PNG proofs.`
  )
);

results.push(
  await gate(
    5,
    "Spec",
    `Role: foundry-architect. Deliverable: ${repo}/docs/05-prd.md and
${repo}/docs/06-architecture.md. Scope, non-goals, formulas with source URLs and
dates, acceptance table (>=8 cases), SEO page map, ADRs, build order.`
  )
);

results.push(
  await gate(
    6,
    "Build",
    `Role: foundry-builder. Deliverable: working app in ${repo}, tests,
${repo}/docs/plans/build.md. Implement only MVP rows. Pure calc core, typed,
a11y, perf budget. Run tests/typecheck/lint/build and paste output.`
  )
);

results.push(
  await gate(
    7,
    "Growth",
    `Role: foundry-growth. Deliverable: ${repo}/docs/07-seo-content.md plus
shipped metadata, JSON-LD, sitemap, robots, llms.txt, OG. Answer-first copy,
sourced numbers, disclaimers.`
  )
);

if (want(8) && args.deploy === true) {
  results.push(
    await gate(
      8,
      "Release",
      `Role: foundry-release. Deliverable: live URL + ${repo}/docs/08-release.md.
CI from clean checkout, tag the verified SHA, deploy, smoke test from outside,
write rollback before deploying.`
    )
  );
} else if (want(8)) {
  phase("G8 Release");
  results.push({
    gate: 8,
    status: "blocked",
    artifact: "",
    summary: "deploy not authorised: pass deploy:true after the owner says go",
    blockers: ["owner approval required"],
  });
  log("G8 skipped: deploy not authorised");
}

if (want(9)) {
  results.push(
    await gate(
      9,
      "Verify",
      `Role: foundry-qa. Deliverable: ${repo}/docs/09-qa.md. Independent audit of
the live URL if one exists, otherwise the build. PASS/FAIL matrix with evidence.
Verdict RELEASE only with zero blockers.`
    )
  );
}

return {
  slug,
  repo,
  gates: results,
  approved: results.filter((r) => r.status === "approved").length,
  blocked: results.filter((r) => r.status === "blocked").map((r) => r.gate),
};
