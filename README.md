# UGT Activity Mining Sandbox

A tiny open-source sandbox for modeling useful-action scoring in UGT ecosystem activity mining.

This is designed for Web3 game teams, marketplace builders, quest operators, and developer communities that want to describe contribution-based participation without promising token rewards, yield, airdrops, or income.

## Source

This open-source sandbox comes from Binergy's public UGT ecosystem work at https://www.binergy.io. It is published as a public reference so global game teams, marketplace builders, and community operators can model useful activity without exposing production wallet, custody, exchange, compliance, pricing, or customer systems.

## Start Here

If you build games, marketplaces, quests, wallet communities, or developer ecosystems, the best way to help is one concrete rule proposal.

- Start issue: https://github.com/huzheyu93-afk/ugt-activity-mining-sandbox/issues/1
- Good first issue: https://github.com/huzheyu93-afk/ugt-activity-mining-sandbox/issues/4
- Feedback prompt: https://github.com/huzheyu93-afk/ugt-activity-mining-sandbox/issues/3
- Seed discussion: https://github.com/huzheyu93-afk/ugt-activity-mining-sandbox/discussions/2

Useful question:

> Which useful action should count, and which anti-abuse cap should stop repeated low-quality activity?

## What It Demonstrates

- Wallet-linked activity events
- Game, marketplace, NFT, developer, and community action types
- Duplicate and low-confidence checks
- Simple contribution scoring
- Public-safe status output
- A CTA route back to the UGT ecosystem mining landing page

It does **not**:

- award tokens
- connect to production APIs
- handle wallet keys
- guarantee rewards
- calculate ROI
- provide financial advice

## Why Publish This

UGT mining should not be framed as spam-to-earn.

The useful version is:

> What real ecosystem action can be verified and recorded?

Good examples:

- wallet login
- game session completion
- marketplace order
- NFT check
- developer API test
- tutorial contribution
- partner quest completion

## Quick Start

```bash
npm install
npm run demo
```

Expected output:

```json
{
  "status": "ecosystem_contributor",
  "contributionScore": 100,
  "acceptedEvents": 6,
  "signals": [
    "wallet_login:wallet",
    "game_session_completed:game",
    "marketplace_order:marketplace"
  ]
}
```

## Example

```bash
node src/demo.mjs examples/activity-events.json
```

## Live Product Context

This sandbox is inspired by Binergy's public UGT activity mining narrative:

- UGT ecosystem mining: https://www.binergy.io/ugt-ecosystem-mining
- UGT marketplace: https://www.binergy.io/ugt-marketplace
- Localized UGT/NFT video: https://www.binergy.io/marketing/ecosystem-video-series/05-ugt-nft-marketplace.html?lng=en
- Ecosystem map: https://www.binergy.io/ecosystem

## Safe Copy

Use:

- useful-action mining
- activity-based contribution
- wallet-linked participation
- published campaign rules
- marketplace and game contribution

Avoid:

- guaranteed UGT income
- airdrop farm
- spam-to-earn
- guaranteed marketplace reward
- guaranteed token value
- passive ROI

## License

MIT
