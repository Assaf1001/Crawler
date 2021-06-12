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