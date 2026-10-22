import type { CaseStudy } from './index'

// Nothing in here names the domain, a LAN address or the tailnet. That is the
// same discipline the cluster repo itself keeps -- see the first decision below,
// which is the reason that repo can be public at all. Keep it when editing.
export const k3sCluster: CaseStudy = {
  slug: 'k3s-cluster',
  eyebrow: 'Homelab · GitOps',
  thesis:
    'Three k3s nodes running about twenty-five services, where nothing is ever applied by hand. Every change is a pull request, and Flux reconciles the repository into the cluster until the two agree.',

  facts: [
    { label: 'Nodes', value: '3' },
    { label: 'Services', value: '~25' },
    { label: 'Manual applies', value: '0' },
    { label: 'Plaintext secrets', value: '0' },
  ],

  sections: [
    {
      kind: 'topology',
      heading: 'The shape of it',
      intro:
        'The interesting direction is downward: a commit lands, and the cluster converges on it without anyone opening a terminal. Everything else on this diagram is something Flux configures rather than something a person touches.',
      diagram: {
        label:
          'A push to GitHub and a webhook over Tailscale Funnel both reach Flux, which reads the domain and network prefixes from an encrypted cluster-vars secret and applies manifests to a three-node k3s cluster. The cluster mounts ZFS datasets from TrueNAS over NFS and publishes DNS records and certificates through Cloudflare.',
        cols: 3,
        rows: 4,
        nodes: [
          {
            id: 'gh',
            col: 0,
            row: 0,
            label: 'GitHub',
            sub: ['manifests · pull requests'],
          },
          {
            id: 'funnel',
            col: 2,
            row: 0,
            label: 'Tailscale Funnel',
            sub: ['webhook in, no open port'],
          },
          {
            id: 'flux',
            col: 1,
            row: 1,
            label: 'Flux',
            sub: ['source · kustomize', 'reconcile in DAG order'],
            accent: true,
          },
          {
            id: 'vars',
            col: 0,
            row: 1,
            label: 'cluster-vars',
            sub: ['SOPS + age secret', 'domain, LAN, tailnet'],
          },
          {
            id: 'k3s',
            col: 1,
            row: 2,
            label: 'k3s',
            sub: ['3 nodes on Proxmox', '~25 services'],
            accent: true,
          },
          {
            id: 'nas',
            col: 2,
            row: 2,
            label: 'TrueNAS',
            sub: ['ZFS datasets over NFS'],
          },
          {
            id: 'cf',
            col: 1,
            row: 3,
            label: 'Cloudflare',
            sub: ['external-dns · DNS-01'],
          },
        ],
        edges: [
          // Both leave sideways and turn down into Flux's top edge, which reads
          // as the merge it is. Left to itself the router would send them down
          // their own columns first, straight through cluster-vars.
          { from: 'gh', to: 'flux', label: 'clone', elbow: 'hv' },
          { from: 'funnel', to: 'flux', label: 'notify', elbow: 'hv' },
          { from: 'vars', to: 'flux', label: 'substitute' },
          { from: 'flux', to: 'k3s', label: 'apply' },
          { from: 'k3s', to: 'nas', label: 'PVCs', kind: 'dashed' },
          { from: 'k3s', to: 'cf', label: 'records · certs', kind: 'dashed' },
        ],
      },
      caption:
        'The webhook and the clone are separate arrows on purpose. The webhook only says **something changed**; `source-controller` still pulls the commit itself. Losing the webhook costs latency, not correctness — reconciliation falls back to its interval.',
    },

    {
      kind: 'prose',
      heading: 'How a commit becomes running software',
      paragraphs: [
        'A push to `main` fires a GitHub webhook at the Flux notification controller. That endpoint is published over a Tailscale Funnel rather than through a port on the router, so the cluster accepts a webhook without being reachable from the internet in any other sense.',
        'From there `source-controller` pulls the commit and the Kustomizations reconcile in dependency order rather than all at once: `cert-manager` before the issuer that needs it, `envoy-gateway` and `external-dns` before the config that references them, and every application layer last. The ordering is declared, not timed — a Kustomization with an unmet dependency waits rather than failing and retrying.',
        'Nothing in that chain is triggered by a person, and there is no step where someone runs `kubectl apply`. That is the property the whole arrangement exists to buy: the running cluster and the repository cannot drift apart without something visibly failing, because the repository is the only thing that writes.',
      ],
    },

    {
      kind: 'table',
      heading: 'What this repo owns, and what it does not',
      intro:
        'A homelab gets confusing at exactly the boundaries. These are written down because the failure they prevent — two tools reconciling the same object, each undoing the other — is slow to diagnose and looks like flakiness.',
      columns: ['Thing', 'Owner', 'Why'],
      rows: [
        [
          'Every workload, its config and its storage claim',
          '**this repo**',
          'Helm for infrastructure, plain Kustomize for most applications.',
        ],
        [
          'Cluster secrets',
          '**this repo**, SOPS-encrypted',
          'Encrypted with `age` and committed. Flux decrypts at reconcile time, so the plaintext exists only inside the cluster.',
        ],
        [
          'The domain, LAN prefixes and tailnet name',
          'a SOPS secret, substituted at reconcile',
          'They are the reason this repo can be public. See the first decision below.',
        ],
        [
          'DNS records for cluster services',
          '`external-dns`',
          'Derived from the routes themselves, so a service and its record cannot disagree. It runs `policy: sync` and deletes what it does not recognise — which is why `cloudflare-infra` deliberately does not manage this zone.',
        ],
        [
          'TLS certificates',
          '`cert-manager`, DNS-01',
          'A wildcard, renewed on its own schedule. The `_acme-challenge` records are created and destroyed per renewal; there is nothing durable to manage.',
        ],
        [
          'The NFS exports the volumes land in',
          '**truenas-infra**',
          'This repo owns the StorageClass and the claim; the export on the other side of it is somebody else’s diff.',
        ],
        [
          'Node OS upgrades',
          '`system-upgrade-controller`',
          'A declared target version and a drain plan, rather than three SSH sessions.',
        ],
        [
          'Dependency bumps',
          '`renovate`, in-cluster',
          'A CronJob rather than the hosted GitHub App, so the bot needs no access to anything it is not already running next to.',
        ],
        [
          'Pool topology, disks, the hypervisors themselves',
          '**nobody**',
          'Physical. A resource exists for some of it; pointing one at a live pool holding every backup in the house is not a trade worth making for the ability to say it is in git.',
        ],
      ],
    },

    {
      kind: 'decisions',
      heading: 'Judgement calls',
      intro: 'Places where I picked one of two defensible options, and what each one costs.',
      items: [
        {
          title: 'The repository is public, and the addresses are not in it',
          body: 'A homelab repo is a map of a house. Rather than keep it private, the domain, both LAN prefixes and the tailnet name are `${VARIABLES}` in the manifests — the literal file contents, not a documentation convention — resolved by Flux from an encrypted secret at reconcile time. The repo describes the shape of the cluster without publishing where any of it lives. The cost is real and asymmetric: a braced variable that is **not** one of the five known ones is replaced with an empty string, silently, so a literal `${FOO}` in an exporter config has to be escaped `$$`. CI cannot catch a hard-coded address either — only a human reading the diff can.',
        },
        {
          title: 'The webhook comes in over a Funnel, not a forwarded port',
          body: 'The alternative was polling on an interval, which is slower and fine, or a port on the router, which is neither. A Funnel gives one endpoint reachable from GitHub and nothing else, and it degrades to the polling behaviour if it breaks.',
        },
        {
          title: 'StorageClasses are hand-written manifests, not chart output',
          body: 'A StorageClass’s `provisioner` and `parameters` are immutable. If they came from a chart, a version bump that changed either one would produce a patch the API server refuses, at reconcile time, in a way that is confusing to trace back to a dependency update. Writing the three of them out by hand costs a few lines and removes the failure mode.',
        },
        {
          title: 'Applications get raw Kustomize unless there is a reason for Helm',
          body: 'Infrastructure is nearly all Helm, because those charts genuinely encode operational knowledge. Most applications are a Deployment, a Service, a route and a volume claim — wrapping four manifests in a chart to gain templating I do not use makes the thing harder to read for no return.',
        },
        {
          title: 'Ingress is Gateway API, not the older Ingress resource',
          body: 'Envoy Gateway behind a `kube-vip` LoadBalancer address. Gateway API separates the listener and certificate from the per-service routes, which is what lets one wildcard terminate for everything and lets an application repo add a route without touching shared config. It is also the newer API, so there is a real cost: fewer examples, and some charts still ship only an Ingress template.',
        },
      ],
    },

    {
      kind: 'callout',
      title: 'The bug that took sixteen months to surface',
      body: 'Encrypted files carry a MAC over their plaintext. Flux does not verify it the way the `sops` CLI does — so an encrypted secret that had been created by **copying another encrypted file and editing it** was accepted by the cluster and rejected by the tool. Everything worked. The file simply could not be opened again, and nothing said so for sixteen months. The root cause was ergonomic: encrypting required a hand-typed 59-character recipient, so copying an existing file was the path of least resistance. There is now a `.sops.yaml` at the repo root supplying the recipient — encryption takes no flags — and a CI check that fails when two files share a MAC. The lesson I actually took: a safety property nothing verifies is not a property, and the fix is usually to remove the reason people worked around it.',
    },
  ],
}
