import axios from "axios"

// ✅ Create instance with backend config
export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:5000/api/v1", // prefix so you don’t repeat
  withCredentials: true, // allow cookies/JWT
});


export const apiConnector = (method, url, bodyData, headers, params) => {
    return axiosInstance({
        
        method:`${method}`,
        url:`${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers: null,
        params: params ? params : null,
    });
}