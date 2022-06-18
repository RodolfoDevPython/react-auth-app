import axios, { AxiosError } from "axios";
import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { AuthTokenError } from "./errors/AuthTokenError";

let isRefreshing = false;
let failedRequestsQueue: any[] = [];

export function setupApiClient(ctx = undefined) {

    let cookies = parseCookies(ctx);

    const api = axios.create({
        baseURL: 'http://localhost:3333',
        headers: {
            Authorization: `Bearer ${cookies['nextauth.token']}`
        }
    });
    
    function signOut() {
        
        destroyCookie(undefined, 'nextauth.token');
        destroyCookie(undefined, 'nextauth.refreshToken');
    
        Router?.push("/");
        
    }
    
    api.interceptors.response.use(response => {
        return response;
    }, (error: AxiosError) => {
        console.log(error.response?.status);
    
        if (error.response?.status === 401) {
            if (error.response.data?.code === 'token.expired') {
                //renovar o token
                cookies = parseCookies(ctx);
    
                const { 'nextauth.refreshToken': refreshToken } = cookies;
                const originalConfig = error.config //All info request
    
                if (!isRefreshing) {
                    isRefreshing = true;
    
                    api.post("/refresh", {
                        refreshToken
                    }).then( (resp: any) => {
                        const { token } = resp.data;
        
                        setCookie(ctx, 'nextauth.token', token, {
                            maxAge: 60 * 60 * 24 * 30, // 30 days
                            path: '/'
                        });
            
                        setCookie(ctx, 'nextauth.refreshToken', resp.data.refreshToken, {
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
    
                        if (process.browser) {
                            signOut();
                        }
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
                // deslogar o usuario somente no lado do client porque no lado do server o signout deve ser aplicado diferente
                if (process.browser) {
                    signOut();
                } else {
                    //pelo server vamos disparar um error que conseguimos capturar por uma verificação usando instaceof do js 
                    return Promise.reject(new AuthTokenError())
                }
    
            }
        }
    
        return Promise.reject(error);
        
    });


    return api
}