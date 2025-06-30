

const axiosWithAuth = (token: string) => {
    return axios.create({
        baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export default axiosWithAuth;