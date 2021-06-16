import React, { useState } from "react";
import validator from "validator";
import ResultPage from "./ResultPage";
import { crawlerSearch, isCrawlerDone, getTree } from "./server/crawler";

const App = () => {
    const [tree, setTree] = useState({});

    const onSubmitForm = async (event) => {
        event.preventDefault();

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
            console.log(treeData);
            setTree(treeData);
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
                {console.log(tree)}

                {/* {results.length > 0 &&
                    results.map((page, i) => (
                        <ResultPage key={i} page={page} />
                    ))} */}
            </div>
        </div>
    );
};

export default App;
