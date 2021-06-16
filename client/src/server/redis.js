import Axios from "axios";

const crawlerServerAddress = process.env.REACT_APP_CRAWLER_SERVER_ADDRESS;

export const getTree = async () => {
    try {
        const res = await Axios.get(`${crawlerServerAddress}/get-tree`);

        return res.data;
    } catch (err) {
        throw new Error(err.response.data);
    }
};
