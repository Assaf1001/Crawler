import React, { useEffect, useState } from "react";
import validator from "validator";
import ResultPage from "./ResultPage";
import { crawlerSearch } from "./server/crawler";
import { getPages, initRedisDB } from "./server/redis";

const App = () => {
    const [results, setResults] = useState([]);

    // useEffect(() => {
    //     initRedisDB()
    //         .then((res) => console.log(res))
    //         .catch((err) => console.log(err));
    // }, []);

    // useEffect(() => {
    //     setInterval(() => {
    //         getPages()
    //             .then((res) => {
    //                 if (res.length !== results.length) setResults(res);
    //             })
    //             .catch((err) => console.log(err));
    //     }, 1000);
    // }, [results.length]);

    const onSubmitForm = (event) => {
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
            crawlerSearch(searchObj)
                .then((res) => console.log(res))
                .catch((err) => console.log(err));
        } else {
            alert("Please enter valid values");
        }
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
                {results.length > 0 &&
                    results.map((page, i) => (
                        <ResultPage key={i} page={page} />
                    ))}
            </div>
        </div>
    );
};

export default App;
