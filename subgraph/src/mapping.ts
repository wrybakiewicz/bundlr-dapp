import {BigInt} from "@graphprotocol/graph-ts"
import {MemeEntity} from "../generated/schema"
import {Transfer, VoteDown, VoteUp} from "../generated/MemeNFT/MemeNFT";
import {MemeNFT} from "../generated/MemeNFT/MemeNFT";

export function handleVoteUp(event: VoteUp): void {
    let entity = MemeEntity.load(event.params.tokenId.toHex())!
    entity.voteCount = entity.voteCount.plus(BigInt.fromI32(1))
    entity.voteUp = entity.voteUp.plus(BigInt.fromI32(1))
    entity.save()
}

export function handleVoteDown(event: VoteDown): void {
    let entity = MemeEntity.load(event.params.tokenId.toHex())!
    entity.voteCount = entity.voteCount.minus(BigInt.fromI32(1))
    entity.voteDown = entity.voteDown.plus(BigInt.fromI32(1))
    entity.save()
}

export function handleMint(event: Transfer): void {
    let entity = MemeEntity.load(event.params.tokenId.toHex())
    if (!entity) {
        const memeNFT = MemeNFT.bind(event.address)
        const tokenId = event.params.tokenId
        entity = new MemeEntity(tokenId.toHex())
        entity.voteCount = BigInt.fromI32(0)
        entity.voteUp = BigInt.fromI32(0);
        entity.voteDown = BigInt.fromI32(0);
        entity.link = memeNFT.tokenURI(tokenId)
        entity.save()
    }
}
