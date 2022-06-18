import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../services/errors/AuthTokenError";

export function withSSRAuth<P>(fn: GetServerSideProps<P>) {


    //Conceito de Higher-Order Functions aplicado nessa implementação
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cookies = parseCookies(ctx);
    
        if (!cookies['nextauth.token']) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false
                }
            }
        }

        try {
            
            return await fn(ctx);
            
        } catch (err) {

            if (err instanceof AuthTokenError) {

                //redirect for home 
                destroyCookie(ctx, 'nextauth.token');
                destroyCookie(ctx, 'nextauth.refreshToken');
    
                return {
                    redirect: {
                        destination: '/',
                        permanent: false
                    }
                }
                
            }

        }

    }

}