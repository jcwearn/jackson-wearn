// ---------------------------------------------------------------------------
// One diagram of how the separate repos actually fit together.
//
// Node ids are project slugs on purpose. SystemMap turns a node into a link
// when a case study exists for its id, so the map lights up on its own as
// writeups land -- there is no list of links here to keep in step with them.
// The one id that is not a slug is `pages`, which stands for a group.
// ---------------------------------------------------------------------------

import type { Diagram } from './diagram'

export const systemIntro = [
  'Most of these started as separate weekend repos and turned out to be one system. The edge half is a Cloudflare account managed as code, which owns the zones, the Pages projects and the tokens each application repo deploys with. The homelab half is three machines in a cupboard behind a router doing its own 802.1X.',
  'They meet in the CI: one set of shared workflows builds, releases and publicly mirrors nearly every repo on this page, including the two that manage the halves themselves.',
]

export const systemDiagram: Diagram = {
  label:
    'Shared CI workflows deploy the Cloudflare account configuration, which hosts four static Pages sites, an email Worker and the hivemind game. Separately, a UDM Pro router fronts a three-node k3s cluster, which mounts storage from TrueNAS and proxies a Home Assistant install.',
  cols: 3,
  rows: 5,
  nodes: [
    {
      id: 'workflows',
      col: 0,
      row: 0,
      colSpan: 3,
      label: 'workflows',
      sub: ['shared CI: build, release,', 'and the public mirrors'],
    },
    {
      id: 'cloudflare-infra',
      col: 1,
      row: 1,
      label: 'cloudflare-infra',
      sub: ['zones · DNS · Pages · tokens'],
      accent: true,
    },
    {
      id: 'pages',
      col: 0,
      row: 2,
      label: 'Pages sites',
      sub: ['4 static front ends'],
    },
    {
      id: 'cf-worker-email',
      col: 1,
      row: 2,
      label: 'cf-worker-email',
      sub: ['contact form → mail'],
    },
    {
      id: 'hivemind',
      col: 2,
      row: 2,
      label: 'hivemind',
      sub: ['Go, on Containers'],
    },
    {
      id: 'udm-pro',
      col: 1,
      row: 3,
      label: 'udm-pro',
      sub: ['802.1X on AT&T fiber'],
    },
    {
      id: 'homeassistant-config',
      col: 0,
      row: 4,
      label: 'homeassistant-config',
      sub: ['a house in YAML'],
    },
    {
      id: 'k3s-cluster',
      col: 1,
      row: 4,
      label: 'k3s-cluster',
      sub: ['3 nodes · ~25 services'],
      accent: true,
    },
    {
      id: 'truenas-infra',
      col: 2,
      row: 4,
      label: 'truenas-infra',
      sub: ['ZFS · NFS · snapshots'],
    },
  ],
  edges: [
    { from: 'workflows', to: 'cloudflare-infra', label: 'plan · apply' },
    { from: 'workflows', to: 'pages', label: 'build · deploy' },
    // Two arrows into Pages, and the distinction is the point: CI uploads the
    // build, Terraform owns the project and its custom domain. Both of these
    // leave sideways: dropping down their own column would run them straight
    // through cf-worker-email.
    { from: 'cloudflare-infra', to: 'pages', label: 'hosts', elbow: 'hv' },
    { from: 'cloudflare-infra', to: 'cf-worker-email', label: 'routes' },
    { from: 'cloudflare-infra', to: 'hivemind', label: 'routes', elbow: 'hv' },
    { from: 'udm-pro', to: 'k3s-cluster', label: 'LAN' },
    { from: 'k3s-cluster', to: 'truenas-infra', label: 'NFS', kind: 'dashed' },
    { from: 'k3s-cluster', to: 'homeassistant-config', label: 'proxies', kind: 'dashed' },
  ],
}
