import {Address, BigInt} from "@graphprotocol/graph-ts"
import {MemeEntity} from "../generated/schema"
import {Transfer, VoteDown, VoteUp} from "../generated/MemeNFT/MemeNFT";

export function handleVoteUp(event: VoteUp): void {
    let entity = MemeEntity.load(event.params.tokenId.toHex())

    if (!entity) {
        entity = new MemeEntity(event.params.tokenId.toHex())
        entity.voteCount = BigInt.fromI32(0)
    }

    entity.voteCount = entity.voteCount.plus(BigInt.fromI32(1))
    entity.save()
}

export function handleVoteDown(event: VoteDown): void {
    let entity = MemeEntity.load(event.params.tokenId.toHex())

    if (!entity) {
        entity = new MemeEntity(event.params.tokenId.toHex())
        entity.voteCount = BigInt.fromI32(0)
    }

    entity.voteCount = entity.voteCount.minus(BigInt.fromI32(1))
    entity.save()
}

export function handleMint(event: Transfer): void {
    if (event.params.from === Address.zero()) {
        const entity = new MemeEntity(event.params.tokenId.toHex())
        entity.voteCount = BigInt.fromI32(0)
        entity.save()
    }
}
