import axios from "axios";

const publicApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}:${
        import.meta.env.VITE_API_PORT
    }/api`,
    headers: {
        "content-type": "application/json",
        Accept: "application/json",
    },
});

export { publicApi };
