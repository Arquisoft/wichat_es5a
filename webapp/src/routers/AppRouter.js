import { Navigate, createBrowserRouter } from "react-router-dom";

import Login from "../components/Login/Login";
import AddUser from "../components/AddUser/AddUser";
import Home from "../components/Home/Home";
import Error from "../components/Error/Error";
import Points from "../components/Points/Points";
import Profile from "../components/Profile/Profile";
import Credits from "../components/Credits/Credits";
import Juego from "../components/Game/Game";


/*
Cada vez que se añada una ventana, se debe añadir una dirección a tal ventana.
En etapas más tardías del desarrollo, se implementarán los otros routers para tener rutas privadas.
Ej:
path: "/home",
element: 
    <PrivateRoute>
        <Home />
    </PrivateRoute> 
*/
const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" replace />
    },
    {
        path: "/login",
        element: <Login /> 
    },
    {
        path: "/addUser",
        element: <AddUser />
    },
    {
        path: "/home",
        element: <Home />  
    },
    {
        path: "/game",
        element: <Juego />  
    },
    {
        path: "/points",
        element: <Points />  
    },
    {
        path: "/profile",
        element: <Profile />  
    },
    {
        path: "/credits",
        element: <Credits />  
    },
    {
        path: "*",
        element: <Error />
    }
]);

export default router;