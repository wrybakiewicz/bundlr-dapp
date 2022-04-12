## Meme NFTs
is a project which aims to reward meme creators and their audiance. 
It's achived by tokenizing memes as NFTs on Arweave via Bundlr & Boba network. Dapp create aggregated view for meme NFTs queried from smart contract.

### Features in MVP
Minting meme NFTs
- upload meme image
- fund Bundlr account (if balance < cost of upload)
- upload image to Bundlr
- mint NFT with link set to Arweave id

Viewing meme NFTs
- view memes ordered by on chain votes
- vote up or down
- link to NFT on Boba

### Components
- smart contract on Boba mainnet with ERC-721 implementation and on chain voting [0xBcAEC9C5009851a95e21D03DfA9b718d5F08E169](https://blockexplorer.boba.network/tokens/0xBcAEC9C5009851a95e21D03DfA9b718d5F08E169)
- subgraph that aggregates smart contract data for frontend
- frontend written in React


### Planned features for the future
- introducing ERC-20 which rewards meme creators, voters and gain from dapp fees (NFT royalties)
- organize weekly meme contests
- add buttons to share meme NFTs on social media

### Live app: [memenft.live](https://www.memenft.live/)