import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import {useEffect, useState} from "react";
import ViewImage from "./ViewImage";

export default function ViewImages({memeNFT}) {
    const client = new ApolloClient({
        uri: 'https://api.thegraph.com/subgraphs/name/wrybakiewicz/memenft',
        cache: new InMemoryCache()
    });

    const [memes, setMemes] = useState();

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
    })


    if (memes) {
        return <div>
            {memes.map(meme => <ViewImage meme={meme} key={meme.id} memeNFT={memeNFT}/>)}
        </div>
    } else {
        return <div>Loading memes ...</div>
    }
}
