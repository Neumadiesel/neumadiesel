import { useAuth } from "@/contexts/AuthContext";


const useAxiosWithAuth = () => {
    const { token } = useAuth();

    return axios.create({
        baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export default useAxiosWithAuth;