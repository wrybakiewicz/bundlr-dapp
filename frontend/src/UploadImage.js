import {providers} from "ethers"
import {WebBundlr} from "@bundlr-network/client";
import {useEffect, useState} from "react";

export default function UploadImage() {
    const [bundlr, setBundlr] = useState();
    const [balance, setBalance] = useState();
    const [image, setImage] = useState();
    const [imageData, setImageData] = useState();
    const [cost, setCost] = useState();
    const [uploaded, setUploaded] = useState(false);

    const initialiseBundlr = async () => {
        await window.ethereum.enable()
        const provider = new providers.Web3Provider(window.ethereum);
        await provider._ready()
        const bundlr = new WebBundlr("https://node1.bundlr.network", "matic", provider);
        await bundlr.ready();
        // bundlr.currencyConfig.isSlow = true
        setBundlr(bundlr);
        return bundlr;
    }

    const getBalance = async (bundlr) => {
        const balance = await bundlr.getLoadedBalance();
        setBalance(balance.toNumber());
    }

    const fund = async () => {
        console.log("Funding")
        const tx = bundlr.createTransaction(imageData)
        const size = tx.size
        const cost = await bundlr.getPrice(size)
        console.log(cost.toNumber())
        const fundStatus = await bundlr.fund(cost)
        console.log("Funded");
        console.log(fundStatus)
        getBalance(bundlr)
    }

    const updateCost = async (imageData) => {
        console.log("Upadting cost")
        const tx = bundlr.createTransaction(imageData)
        const size = tx.size
        const cost = await bundlr.getPrice(size)
        setCost(cost.toNumber())
        console.log(cost.toNumber())
        console.log(balance);
    }

    const upload = async () => {
        console.log("UPLOADING");
        const tx = bundlr.createTransaction(imageData)
        await tx.sign();
        const result = await tx.upload()
        console.log("UPLOADED");
        console.log(result)
        console.log(result.data.id)
        setUploaded(true);
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
        if (!bundlr) {
            initialiseBundlr().then(bundlr => getBalance(bundlr));
        }
    })


    if (balance !== undefined && bundlr && !uploaded) {
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
                    <img src={image}/>
                </div> : <div></div>}
        </div>
    } else if(uploaded) {
        return <div>Image uploaded</div>
    } else {
        return <div>Initializing ...</div>
    }
}