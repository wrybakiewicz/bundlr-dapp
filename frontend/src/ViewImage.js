import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {useState} from "react";

export default function ViewImage({meme, memeNFT}) {
    const [voteCount, setVoteCount] = useState(meme.voteCount);
    const [hide, setHide] = useState(true);

    const upVote = async () => {
        const upVote = memeNFT.voteUp(meme.id)
            .then(tx => tx.wait())
            .then(_ => setVoteCount(parseInt(voteCount) + 1))
        toast.promise(upVote, {
            pending: 'Up vote transaction in progress',
            success: 'Up vote transaction succeed 👌',
            error: 'Up vote transaction failed 🤯'
        });
    }

    const downVote = async () => {
        const downVotePromise = memeNFT.voteDown(meme.id)
            .then(tx => tx.wait())
            .then(_ => setVoteCount(parseInt(voteCount) - 1))
        toast.promise(downVotePromise, {
            pending: 'Down vote transaction in progress',
            success: 'Down vote transaction succeed 👌',
            error: 'Down vote transaction failed 🤯'
        });
    }

    return <div>
        <img alt={""} src={`https://arweave.net/` + "vduXOBwDGbopIBPJuL1tA86Id1NcLBvPR-qUqO5T18g"}
             onLoad={() => setHide(false)}/>
        <div hidden={hide}>Votes: {voteCount}
            <div>ID: {meme.id}</div>
            <button onClick={upVote}>+</button>
            <button onClick={downVote}>-</button>
        </div>
    </div>
}