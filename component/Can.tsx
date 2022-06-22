import { ReactNode } from "react";
import { UserCan } from "../hooks/useCan";

interface CanProps {
    children: ReactNode;
    permissions?: string[];
    roles?: string[]; 
}


export function Can({ children, permissions, roles }: CanProps) { 

    const useCanSeeComponent = UserCan({
        permissions,
        roles
    })

    if (!useCanSeeComponent) {
        return null;
    }

    return (
        <>
            {children}
        </>
    )

}

//Component criado para validar se o usuario tem permissão no client-side