import axios from "axios";


const axiosInstance = axios.create({
    baseURL: `https://zap-shift-sever.vercel.app`
})

const useAxios = () => {
    return (
        axiosInstance
    );
};

export default useAxios;