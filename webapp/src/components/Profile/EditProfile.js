import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import { Container, Typography, Button, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const EditProfile = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const { t } = useTranslation();
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${apiEndpoint}/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Envía el token en la cabecera Authorization
                    },
                });
                setProfileData(response.data);
                setUsername(response.data.username);
                setEmail(response.data.email);
            } catch (err) {
                setError(err.response?.data?.error || 'Error fetching profile');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchProfile();
        } else {
            setError('No se encontró el token.');
            setLoading(false);
        }
    }, [token]);

    const handleCancel = () => {
        navigate('/profile'); // Vuelve a la página de perfil
    };

    const handleSave = async () => {
        setError(null);
        setLoading(true);
        try {
            const response = await axios.put(
                `${apiEndpoint}/profile/edit/${profileData.username}`,
                { 
                    username, 
                    email 
                }
            );
            localStorage.removeItem('token');
            navigate('/login');
        } catch (err) {
            setError('Error al actualizar el perfil:' + err); // Nueva clave de traducción
            console.error('Error al actualizar el perfil:', err);
            console.error('Error completo:', err.response);
        } finally {
            setLoading(false);
        }
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    if (loading) {
        return (
            <div>
                <NavBar />
                <Container component="main">
                    <Typography>{t('loading')}...</Typography>
                </Container>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <NavBar />
                <Container component="main">
                    <Typography color="error">{error}</Typography>
                </Container>
            </div>
        );
    }

    return (
        <div>
            <NavBar />
            <Container component="main">
                <Typography variant="h4" gutterBottom>
                    {t('edit-user-profile')}
                </Typography>
                {profileData && (
                    <>
                        <TextField
                            label={t('username')}
                            defaultValue={profileData.username}
                            onChange={handleUsernameChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label={t('email')}
                            defaultValue={profileData.email}
                            onChange={handleEmailChange}
                            fullWidth
                            margin="normal"
                        />
                        {/* Otros campos de edición */}
                        <Button variant="contained" color="primary" onClick={handleSave}>
                            {t('save')}
                        </Button>
                        <Button onClick={handleCancel} style={{ marginLeft: '1rem' }}>
                            {t('cancel')}
                        </Button>
                    </>
                )}
            </Container>
        </div>
    );
};

export default EditProfile;