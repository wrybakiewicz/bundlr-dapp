import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import {useEffect, useState} from "react";
import ViewImage from "./ViewImage";
import {ethers} from "ethers";
import contractAddress from "./contracts/contract-address.json";
import MemeNFTArtifact from "./contracts/MemeNFT.json";

export default function ViewImages() {
    const client = new ApolloClient({
        uri: 'https://api.thegraph.com/subgraphs/name/wrybakiewicz/memenft',
        cache: new InMemoryCache()
    });

    const [memeNFT, setMemeNFT] = useState();
    const [memes, setMemes] = useState();

    const initializeEthers = () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const memeNFTContract = new ethers.Contract(
            contractAddress.MemeNFT,
            MemeNFTArtifact.abi,
            provider.getSigner(0)
        );
        setMemeNFT(memeNFTContract)
        return provider
    }

    const query = () => {
        client
            .query({
                query: gql`{
                            memeEntities(first: 100, orderBy: voteCount, orderDirection: desc) {
                              id
                              voteCount
                              link
                             }
                            }`
            })
            .then(result => setMemes(result.data.memeEntities));
    }

    useEffect(() => {
        if (!memes) {
            query();
        }
        if(!memeNFT) {
            initializeEthers();
        }
    })


    if (memes && memeNFT) {
        return <div>
            {memes.map(meme => <ViewImage meme={meme} key={meme.id} memeNFT={memeNFT}/>)}
        </div>
    } else {
        return <div>Loading memes ...</div>
    }
}
