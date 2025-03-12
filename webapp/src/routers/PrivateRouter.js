import { useEffect, useState } from "react";
import { Navigate } from "react-router";

/* 
Este router sirve para asegurarse de que solo los usuarios autenticados puedan acceder a ciertas rutas.
Esta copiado y pegado de otro repo asi que puede no funcionar, pero la idea es la misma.
Lo ideal sería no implementarlo hasta mas adelante para no obstaculizar el desarrollo.
*/

export const PrivateRoute = ({ children }) =>
{
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => 
    {
        const verifyToken = async () => 
        {
            const token = localStorage.getItem('token');
            
            if (!token) 
            {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }
            
            try {
                // Hay que añadir una función para verificar que el token sea correcto
                // De momento, siempre se devuelve que el token es valido

                //const valid = await isValidToken(token);
                
                // Al implementar la función, cambiar true por valid
                setIsAuthenticated(true);

            } catch (error) {
                setIsAuthenticated(false);
            }

            setIsLoading(false);
        };

        verifyToken();
    }, []);

    if (isLoading)
        return <></>;

    if (isAuthenticated)
        return children;

    localStorage.removeItem("token");

    return <Navigate to='/login' replace />;
}