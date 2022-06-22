import { userInfo } from "os";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { validateUsersPermissions } from "../utils/validateUsersPermissions";

type UseCanParams = {
    permissions?: string[];
    roles?: string[];
}

export function UserCan({ permissions, roles }: UseCanParams) {

    const { user, isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated) {

        return false

    }

    const userHasValidPermissions = validateUsersPermissions({
        user,
        permissions,
        roles
    });

    return userHasValidPermissions

} 