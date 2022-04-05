import {WebBundlr} from "@bundlr-network/client";
import {useEffect, useState} from "react";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UploadImage({provider, memeNFT}) {
    const [bundlr, setBundlr] = useState();
    const [balance, setBalance] = useState();
    const [image, setImage] = useState();
    const [imageData, setImageData] = useState();
    const [cost, setCost] = useState();
    const [uploaded, setUploaded] = useState(false);

    const initialiseBundlr = async () => {
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
        const mintPromise = memeNFT.mint(result.data.id)
            .then(tx => tx.wait())
        toast.promise(mintPromise, {
            pending: 'Mint transaction in progress',
            success: 'Mint transaction succeed 👌',
            error: 'Mint transaction failed 🤯'
        });
        mintPromise.then(_ => setUploaded(true))
    }

    const test = async () => {
        memeNFT.mint("vduXOBwDGbopIBPJuL1tA86Id1NcLBvPR-qUqO5T18g")
        memeNFT.mint("fDMQQyN9TZtG4lSbN5BgNPmNGvXwW3e0_7C-F20UKqc")
        memeNFT.mint("i8ZVnXnh1wYV687LBLVh16Rbtedg1e5fr1ADHuCe9DY")
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
            <div>Add test img:
            <button onClick={test}>Add</button>
            </div>
        </div>
    } else if (uploaded) {
        return <div>Image uploaded</div>
    } else {
        return <div>Initializing ...</div>
    }
}