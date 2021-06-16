import Axios from "axios";

const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;

export const crawlerSearch = async (searchObj) => {
    try {
        const res = await Axios.post(`${serverAddress}/crawler-start`, {
            searchObj,
        });

        return res.data;
    } catch (err) {
        throw new Error(err.response.data);
    }
};

export const getTree = async () => {
    try {
        console.log("getTree");
        const res = await Axios.get(`${serverAddress}/get-data`);

        console.log(res.data);
        return res.data;
    } catch (err) {
        throw new Error(err.response.data);
    }
};

export const isCrawlerDone = async () => {
    try {
        const res = await Axios.post(`${serverAddress}/is-crawler-done`);

        return res.data;
    } catch (err) {
        throw new Error(err.response.data);
    }
};
