import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import {useEffect, useState} from "react";

export default function ViewImages() {
    const client = new ApolloClient({
        uri: 'https://api.thegraph.com/subgraphs/name/wrybakiewicz/memenft',
        cache: new InMemoryCache()
    });

    const axios = require('axios');

    const [memes, setMemes] = useState();

    const query = () => {
        client
            .query({
                query: gql`{
                            memeEntities(first: 5) {
                              id
                              voteCount
                             }
                            }`
            })
            .then(result => setMemes(result.data.memeEntities));
    }

    useEffect(() => {
        if (!memes) {
            query();
        }
    })

    if (memes) {
        console.log(memes)
        return <div>
            {memes.map(meme => <div key={meme.id}>
                <img alt={""} src={`https://arweave.net/` + "vduXOBwDGbopIBPJuL1tA86Id1NcLBvPR-qUqO5T18g"}/>
                <div>Votes: {meme.voteCount}
                </div>
            </div>)}
        </div>
    } else {
        return <div>Loading memes ...</div>
    }
}
