import {WebBundlr} from "@bundlr-network/client";
import {useEffect, useState} from "react";
import {toast} from 'react-toastify';
import {ethers} from "ethers";
import contractAddress from "./contracts/contract-address.json";
import MemeNFTArtifact from "./contracts/MemeNFT.json";

export default function UploadImage() {
    const [balance, setBalance] = useState();
    const [image, setImage] = useState();
    const [imageData, setImageData] = useState();
    const [cost, setCost] = useState();
    const [uploaded, setUploaded] = useState(false);
    const [memeNFT, setMemeNFT] = useState();
    const [bundlr, setBundlr] = useState();

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

    const initializeWallet = () => {
        console.log("Initializing wallet")
        return window.ethereum.request({method: 'eth_requestAccounts'});
    }

    const initialiseBundlr = async (provider) => {
        const bundlr = new WebBundlr("https://node1.bundlr.network", "matic", provider);
        await bundlr.ready();
        setBundlr(bundlr);
        return bundlr;
    }

    const updateBalance = async (bundlr) => {
        const balance = await bundlr.getLoadedBalance();
        setBalance(balance.toNumber());
    }

    const fund = async () => {
        const tx = bundlr.createTransaction(imageData)
        const size = tx.size
        const cost = await bundlr.getPrice(size)
        const fundStatus = await bundlr.fund(cost)
        console.log(fundStatus)
        updateBalance(bundlr)
    }

    const updateCost = async (imageData) => {
        const tx = bundlr.createTransaction(imageData)
        const size = tx.size
        const cost = await bundlr.getPrice(size)
        setCost(cost.toNumber())
    }

    const upload = async () => {
        const tx = bundlr.createTransaction(imageData)
        await tx.sign();
        const result = await tx.upload()
        const mintPromise = memeNFT.mint(result.data.id)
            .then(tx => tx.wait())
        toast.promise(mintPromise, {
            pending: 'Mint transaction in progress',
            success: 'Mint transaction succeed 👌',
            error: 'Mint transaction failed 🤯'
        });
        mintPromise.then(_ => setUploaded(true))
    }

    const onImageChange = async event => {
        if (event.target.files && event.target.files[0]) {
            const img = event.target.files[0];
            setImage(URL.createObjectURL(img));
            const buffer = await img.arrayBuffer();
            const byteArray = new Int8Array(buffer);
            setImageData(byteArray);
            await updateCost(byteArray);
        }
    };

    useEffect(() => {
        if (!memeNFT) {
            initializeWallet().then(_ => {
                const provider = initializeEthers();
                initialiseBundlr(provider).then(bundlr => updateBalance(bundlr));
            })
        }
    })


    if (window.ethereum === undefined) {
        return <h2>Install ethereum wallet</h2>;
    } else if (balance !== undefined && bundlr && !uploaded && memeNFT) {
        return <div>
            <div>Upload image:
                <input type="file" id="image" name="img" accept="image/*" onChange={onImageChange}/>
            </div>
            {cost > balance && image ? <div>Fund upload:
                <button onClick={fund}>fund</button>
            </div> : <div></div>}
            {balance > cost && image ? <div>
                Upload
                <button onClick={upload}>upload</button>
            </div> : <div></div>}
            {image ?
                <div>
                    Upladed image:
                    <img alt={""} src={image}/>
                </div> : <div></div>}
        </div>
    } else if (uploaded) {
        return <div>Image uploaded</div>
    } else {
        return <div>Initializing ...</div>
    }
}