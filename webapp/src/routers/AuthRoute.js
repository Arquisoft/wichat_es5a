import { Navigate } from "react-router-dom";

/* 
Este router sirve para asegurarse de que los usuarios autenticados no puedan acceder ni al login ni al addUser
Esta copiado y pegado de otro repo asi que puede no funcionar, pero la idea es la misma.
Lo ideal sería no implementarlo hasta mas adelante para no obstaculizar el desarrollo.
*/

export const AuthRoute = ({ children }) =>
{
    const token = localStorage.getItem('token');

    return (token === undefined || token === null) ? children : <Navigate to='/home' replace />;
}