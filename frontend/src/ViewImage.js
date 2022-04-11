import {toast} from "react-toastify";
import {useState} from "react";
import "./viewImage.css";
import LoadingButton from "@mui/lab/LoadingButton";
import {Button} from "@mui/material";
import {ArrowDownward, ArrowUpward} from "@mui/icons-material";

export default function ViewImage({meme, memeNFT}) {
    const [voteUpCount, setVoteUpCount] = useState(meme.voteUp);
    const [voteDownCount, setVoteDownCount] = useState(meme.voteDown);
    const [hide, setHide] = useState(true);
    const [voteUpInProgress, setVoteUpInProgress] = useState(false);
    const [voteDownInProgress, setVoteDownInProgress] = useState(false);

    const upVote = async () => {
        setVoteUpInProgress(true)
        const upVote = memeNFT.voteUp(meme.id)
            .then(tx => tx.wait())
            .then(_ => {
                setVoteUpCount(parseInt(voteUpCount) + 1)
                setVoteUpInProgress(false)
            })
            .catch(error => {
                console.error(error)
                setVoteUpInProgress(false)
                throw error;
            })
        toast.promise(upVote, {
            pending: 'Up vote transaction in progress',
            success: 'Up vote transaction succeed 👌',
            error: 'Up vote transaction failed 🤯'
        });
    }

    const downVote = async () => {
        setVoteDownInProgress(true)
        const downVotePromise = memeNFT.voteDown(meme.id)
            .then(tx => tx.wait())
            .then(_ => {
                setVoteDownCount(parseInt(voteDownCount) + 1)
                setVoteDownInProgress(false)
            })
            .catch(error => {
                console.error(error)
                setVoteDownInProgress(false)
                throw error;
            })
        toast.promise(downVotePromise, {
            pending: 'Down vote transaction in progress',
            success: 'Down vote transaction succeed 👌',
            error: 'Down vote transaction failed 🤯'
        });
    }

    return <div className={"padding-meme"}>
        <div className={"padding-image"}>
            <div className={"nft-id"}>
                <a href={`https://polygonscan.com/token/0xb42b53fc8c565212830e9b69c4f7c9c5a4dff813?a=${parseInt(meme.id)}`}
                   target="_blank">Meme NFT {parseInt(meme.id)}</a>
            </div>
            <img alt={""} src={`https://arweave.net/${meme.link}`}
                 onLoad={() => setHide(false)}
                 style={{maxWidth: '1000px', maxHeight: '800px'}}
            />
        </div>
        <div hidden={hide}>
            <span className={"padding-right"}>
            {voteUpInProgress ?
                <LoadingButton loading loadingIndicator="Voting Up..." variant="outlined">Executing Vote Transaction</LoadingButton> :
                <Button
                    onClick={upVote}
                    variant="outlined"
                    component="label"
                    endIcon={<ArrowUpward/>}>{voteUpCount}</Button>}
                </span>
            {voteDownInProgress ? <LoadingButton loading loadingIndicator="Voting Down..." variant="outlined">Executing Vote Transaction</LoadingButton> : <Button
                onClick={downVote}
                variant="outlined"
                component="label"
                endIcon={<ArrowDownward/>}>{voteDownCount}</Button>}
        </div>
    </div>
}