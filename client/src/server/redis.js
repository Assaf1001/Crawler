import Axios from "axios";

const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;

export const initRedisDB = async () => {
    try {
        const res = await Axios.post(`${serverAddress}/init`);

        return res.data;
    } catch (err) {
        throw new Error(err.response.data);
    }
};

export const getPages = async () => {
    try {
        const res = await Axios.get(`${serverAddress}/getPages`);

        return res.data;
    } catch (err) {
        throw new Error(err.response.data);
    }
};
