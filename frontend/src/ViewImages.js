import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import {useEffect, useState} from "react";
import ViewImage from "./ViewImage";
import {ethers} from "ethers";
import contractAddress from "./contracts/contract-address.json";
import MemeNFTArtifact from "./contracts/MemeNFT.json";
import {Pagination, PaginationItem} from "@mui/material";
import {Link, useParams} from "react-router-dom";

export default function ViewImages() {
    const itemsPerPage = 2;
    const client = new ApolloClient({
        uri: 'https://api.thegraph.com/subgraphs/name/wrybakiewicz/memenft',
        cache: new InMemoryCache()
    });

    const [memeNFT, setMemeNFT] = useState();
    const [memes, setMemes] = useState();
    const [totalItems, setTotalItems] = useState();
    const [network, setNetwork] = useState();

    const params = useParams();

    const getPageNumber = () => {
        if(params["*"]) {
            return parseInt(params["*"]);
        } else {
            return 1;
        }
    }

    const initializeEthers = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const memeNFTContract = new ethers.Contract(
            contractAddress.MemeNFT,
            MemeNFTArtifact.abi,
            provider.getSigner(0)
        );
        setMemeNFT(memeNFTContract)
        return memeNFTContract
    }

    const updateTotalItems = async (memeNFT) => {
        const totalItems = await memeNFT.totalSupply();
        setTotalItems(totalItems.toNumber());
    }

    const initializeWallet = async () => {
        window.ethereum.request({method: 'eth_requestAccounts'});
        const chainId = await window.ethereum.request({method: 'eth_chainId'});
        setNetwork(chainId)
        window.ethereum.on("chainChanged", ([_]) => {
            initializeEth();
            initializeMemes();
        });
    }

    const query = (page) => {
        client
            .query({
                query: gql`{
                            memeEntities(first: ${itemsPerPage}, skip: ${(page - 1) * itemsPerPage}, orderBy: voteCount, orderDirection: desc) {
                              id
                              voteCount
                              link
                             }
                            }`
            })
            .then(result => setMemes(result.data.memeEntities));
    }

    const initializeEth = () => {
        initializeWallet().then(_ => initializeEthers()).then(memeNFT => updateTotalItems(memeNFT))
    }

    const initializeMemes = () => {
        query(getPageNumber());
    }

    useEffect(() => {
        if(!memeNFT && window.ethereum) {
            initializeEth()
        }
        if (!memes) {
            initializeMemes();
        }
    })

    if (window.ethereum === undefined) {
        return <h2>Install ethereum wallet</h2>;
    } else if(network !== "0x89") {
        return <h2>Change network to Boba</h2>
    } else if (memes && memeNFT && totalItems) {
        return <div>
            {memes.map(meme => <ViewImage meme={meme} key={meme.id} memeNFT={memeNFT}/>)}
            <Pagination onChange={(e, page) => query(page)} page={getPageNumber()} count={Math.round(totalItems / itemsPerPage)} shape="rounded" renderItem={(item) =>(
                <PaginationItem component={Link} to={item.page === 1 ? '' : `/${item.page}`} {...item}/>)}/>
        </div>
    } else {
        return <div>Loading memes ...</div>
    }
}
