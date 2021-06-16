import React, { useState } from "react";
import validator from "validator";
import { FadeLoader } from "react-spinners";
import Node from "./components/Node";
import { crawlerSearch, isCrawlerDone, getTree } from "./server/crawler";

// import treeEx from "./treeExample.json";

const App = () => {
    const [tree, setTree] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmitForm = async (event) => {
        event.preventDefault();
        setTree([]);

        const searchObj = {
            startUrl: event.target.elements.startUrl.value,
            maxDepth: event.target.elements.maxDepth.value,
            maxTotalPages: event.target.elements.maxTotalPages.value,
        };

        if (
            validator.isURL(searchObj.startUrl) &&
            searchObj.maxDepth > 0 &&
            searchObj.maxTotalPages > 0
        ) {
            setIsLoading(true);
            const res = await crawlerSearch(searchObj);
            console.log(res);
            getResutls();
        } else {
            alert("Please enter valid values");
        }
    };

    const getResutls = () => {
        const interval = setInterval(async () => {
            const treeData = await getTree();
            if (treeData) {
                setIsLoading(false);
                setTree(Object.values(treeData));
            }
            const isDone = await isCrawlerDone();
            if (isDone) clearInterval(interval);
        }, 5000);
    };

    return (
        <div>
            <form onSubmit={onSubmitForm}>
                <label htmlFor="startUrl">Start URL</label>
                <input type="text" id="startUrl" />
                <label htmlFor="maxDepth">Max Depth</label>
                <input type="number" id="maxDepth" />
                <label htmlFor="maxTotalPages">Max Total Pages</label>
                <input type="number" id="maxTotalPages" />
                <button type="submit">Submit</button>
            </form>
            <div>
                <h2>Results:</h2>
                {isLoading && <FadeLoader />}
                {tree.map((node, i) => (
                    <Node key={i} node={node} />
                ))}
            </div>
        </div>
    );
};

export default App;
