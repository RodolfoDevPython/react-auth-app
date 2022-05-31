import axios, { AxiosError } from "axios";
import { request } from "http";
import { parseCookies, setCookie } from "nookies";

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestsQueue: any[] = [];

export const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
        Authorization: `Bearer ${cookies['nextauth.token']}`
    }
});

api.interceptors.response.use(response => {
    return response;
}, (error: AxiosError) => {
    console.log(error.response?.status);

    if (error.response?.status === 401) {
        if (error.response.data?.code === 'token.expired') {
            //renovar o token
            cookies = parseCookies();

            const { 'nextauth.refreshToken': refreshToken } = cookies;
            const originalConfig = error.config //All info request

            if (!isRefreshing) {
                isRefreshing = true;

                api.post("/refresh", {
                    refreshToken
                }).then( (resp: any) => {
                    const { token } = resp.data;
    
                    setCookie(undefined, 'nextauth.token', token, {
                        maxAge: 60 * 60 * 24 * 30, // 30 days
                        path: '/'
                    });
        
                    setCookie(undefined, 'nextauth.refreshToken', resp.data.refreshToken, {
                        maxAge: 60 * 60 * 24 * 30, // 30 days
                        path: '/'
                    });
    
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    failedRequestsQueue.forEach(request => request.onSuccess(token));
                    failedRequestsQueue = [];
                })
                .catch( (err) => {
                    failedRequestsQueue.forEach(request => request.onFailure(err));
                    failedRequestsQueue = [];
                })
                .finally( () => {
                    isRefreshing = false
                });

            }

            //Essa é a forma de usarmos uma Promise dentro do interceptors do axios não conseguimos usar o await
            return new Promise((resolve, reject) => {
                failedRequestsQueue.push({
                    onSuccess: (token: string) => {
                        originalConfig.headers['Authorization'] = `Bearer ${token}`;

                        resolve(api(originalConfig))
                    },
                    onFailure: (err: AxiosError) => {
                        reject(err)
                    }
                })
            });

        } else {
            // deslogar o usuario
        }
    }
});