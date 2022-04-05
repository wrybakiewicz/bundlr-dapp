import UploadImage from "./UploadImage";
import {ethers} from "ethers";
import MemeNFTArtifact from "./contracts/MemeNFT.json";
import contractAddress from "./contracts/contract-address.json";
import {useEffect, useState} from "react";
import ViewImages from "./ViewImages";

export default function App() {
    const [memeNFT, setMemeNFT] = useState();
    const [provider, setProvider] = useState();

    const initializeEthers = () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const memeNFTContract = new ethers.Contract(
            contractAddress.MemeNFT,
            MemeNFTArtifact.abi,
            provider.getSigner(0)
        );
        setMemeNFT(memeNFTContract)
        setProvider(provider)
    }

    useEffect(() => {
        if (!memeNFT) {
            initializeEthers();
        }
    })

    if (provider && memeNFT) {
        return (
            <div>
                <UploadImage provider={provider} memeNFT={memeNFT}/>
                <ViewImages memeNFT={memeNFT} />
            </div>
        );
    } else {
        return <div>Initializing...</div>
    }
}