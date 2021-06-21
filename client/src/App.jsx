import React, { useState } from "react";
import validator from "validator";
import { FadeLoader } from "react-spinners";
import { crawlerSearch, isCrawlerDone, getTree } from "./server/crawler";
import Node from "./components/Node";

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
        <div className="main">
            <h1>Web Crawler</h1>
            <form onSubmit={onSubmitForm}>
                <div>
                    <label htmlFor="startUrl">Start URL</label>
                    <input type="text" id="startUrl" />
                </div>
                <div>
                    <label htmlFor="maxDepth">Max Depth</label>
                    <input type="number" id="maxDepth" />
                </div>
                <div>
                    <label htmlFor="maxTotalPages">Max Total Pages</label>
                    <input type="number" id="maxTotalPages" />
                </div>
                <button type="submit">Submit</button>
            </form>
            <div className="results">
                <div className="spinner">
                    {isLoading && <FadeLoader color={"#3b6978"} size={300} />}
                </div>
                {tree.length > 0 && <h2>Results:</h2>}
                {tree.map((node, i) => (
                    <Node key={i} node={node} />
                ))}
            </div>
        </div>
    );
};

export default App;
