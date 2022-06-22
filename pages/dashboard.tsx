import { useContext } from "react"
import { Can } from "../component/Can";
import { AuthContext } from "../contexts/AuthContext";
import { UserCan } from "../hooks/useCan";
import { setupApiClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {

    const { user, signOut ,isAuthenticated } = useContext(AuthContext);


    return (
        <>
            <h1>
                Dashboard: {user?.email}
            </h1>

            <button onClick={signOut} >Sign out</button>
            <Can permissions={['metrics.list']}>
                <div>Métricas</div>
            </Can>
        </>
    )
}

export const getServerSideProps = withSSRAuth( async (ctx) => {

    const apiClient = setupApiClient(ctx);
    const response = await apiClient.get("/me");

    console.log({
        response
    })

    return {
        props: {

        }
    }

})