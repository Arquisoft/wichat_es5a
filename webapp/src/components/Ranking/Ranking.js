import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router';
import LargeButton from '../ReactComponents/LargeButton';
import HistoryText from '../ReactComponents/HistoryText';
import NavBar from "../NavBar/NavBar";
import { useTranslation } from "react-i18next";
import CustomH1 from '../ReactComponents/CustomH1';
import Grid from '@mui/material/Grid';

const Ranking = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([])
    const { t } = useTranslation();


    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

    const exitRanking = () => {
        navigate('/home');
    }

    const enterHistory = (username) => {
        navigate('/history/' + username);
    }

    // Se ejecuta al cargar el componente
    useEffect(() => {
        const getRanking = async () => {
            try {
                const response = await axios.get(`${apiEndpoint}/getranking`);
                setUsers(response.data.users);
            } catch (error) {
                console.error('Error al obtener el número de usuarios:', error);
            }
        };

        getRanking();
    }, [apiEndpoint]);

    return (
        <div>
            <NavBar />
            <Container
                component="main"
                sx={{
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <CustomH1 size="h1">
                    {t("Ranking")}
                </CustomH1>
                <LargeButton onClick={exitRanking}>
                    {t("exit")}
                </LargeButton>
                <Container
                sx ={{
                    backgroundColor: "#98d7c2",
                    marginTop: 2,
                }}>
                    <Grid container spacing={2}
                        sx={{
                            marginTop: 2,
                            marginBottom: 2,
                            display: "flex",
                            flexWrap: "wrap",
                            direction: "row"
                        }}
                    >
                        <Grid item xs={2}>
                            <HistoryText color="#00493A" size="h6">
                                <b>{t("Puesto")}</b>
                            </HistoryText>
                        </Grid>
                        <Grid item xs={4}>
                            <HistoryText color="#00493A" size="h6">
                                <b>{t("Nombre de usuario")}</b>
                            </HistoryText>
                        </Grid>
                        <Grid item xs={4}>
                            <HistoryText color="#00493A" size="h6">
                                <b>{t("Puntos")}</b>
                            </HistoryText>
                        </Grid>
                        <Grid item xs={2}>
                        </Grid>
                    </Grid>
                    {users.map((user, index) => (
                        <Grid container spacing={2}
                            sx={{
                                marginTop: 2,
                                marginBottom: 2,
                                display: "flex",
                                flexWrap: "wrap",
                                direction: "row"
                            }}
                            key={user.username || index}
                        >
                            <Grid item xs={2}>
                                <HistoryText color="#00493A" size="h6">
                                    {`${index + 1}`}
                                </HistoryText>
                            </Grid>
                            <Grid item xs={4}>
                                <HistoryText color="#00493A" size="h6">
                                    {`${user.username}`}
                                </HistoryText>
                            </Grid>
                            <Grid item xs={4}>
                                <HistoryText color="#00493A" size="h6">
                                    {`${user.points}`}
                                </HistoryText>
                            </Grid>
                            <Grid item xs={2}
                                sx={{
                                    display: "flex",
                                    alignItems: "center", // Centra verticalmente
                                }}>
                                <LargeButton
                                    width="70%"
                                    marginTop={0}
                                    bottom="30%"
                                    onClick={() => enterHistory(user.username)}
                                >
                                    {t("Historial")}
                                </LargeButton>
                            </Grid>
                        </Grid>
                    ))}
                </Container>
            </Container>
        </div>
    );
};

export default Ranking;