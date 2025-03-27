import { Navigate, createBrowserRouter } from "react-router";

import { AuthRoute } from "./AuthRouter";
import { PrivateRoute } from "./PrivateRouter";

import Login from "../components/Login/Login";
import AddUser from "../components/AddUser/AddUser";
import Home from "../components/Home/Home";
import Error from "../components/Error/Error";
import Points from "../components/Points/Points";
import Profile from "../components/Profile/Profile";
import Credits from "../components/Credits/Credits";
import Game from "../components/Game/Game";
import History from "../components/History/History";
import GameMode from "../components/GameMode/GameMode";


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
        element:
            <AuthRoute>
                <Login />
            </AuthRoute>
    },
    {
        path: "/addUser",
        element:
            <AuthRoute>
                <AddUser />
            </AuthRoute>

    },
    {
        path: "/home",
        element:
            <PrivateRoute>
                <Home />
            </PrivateRoute>
    },
    {
        path: "/game",
        element:
            <PrivateRoute>
                <Game />
            </PrivateRoute>
    },
    {
        path: "/points",
        element:
            <PrivateRoute>
                <Points />
            </PrivateRoute>
    },
    {
        path: "/profile",
        element:
            <PrivateRoute>
                <Profile />
            </PrivateRoute>

    },
    {
        path: "/history",
        element:
            <PrivateRoute>
                <History />
            </PrivateRoute>

    },
    {
        path: "/gamemode",
        element:
            <PrivateRoute>
                <GameMode />
            </PrivateRoute>
    },
    {
        path: "/credits",
        element:
            <PrivateRoute>
                <Credits />
            </PrivateRoute>
    },
    {
        path: "*",
        element: <Error />
    }
]);

export default router;