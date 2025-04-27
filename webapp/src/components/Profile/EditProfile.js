import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const [fieldErrors, setFieldErrors] = useState({}); // Nuevo estado para errores de campo

    const clearFieldError = (field) => {
        setFieldErrors((prev) => ({ ...prev, [field]: null }));
    };

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${apiEndpoint}/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProfileData(response.data);
                setUsername(response.data.username);
                setEmail(response.data.email);
            } catch (err) {
                setError(err.response?.data?.error || t('errors.fetchProfile')); // Clave de traducción
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchProfile();
        } else {
            setError(t('errors.noToken')); // Clave de traducción
            setLoading(false);
        }
    }, [token, t]);

    const handleCancel = () => {
        navigate('/profile');
    };

    const handleSave = async () => {
        setError(null);
        setLoading(true);
        setFieldErrors({}); // Limpiar errores previos al intentar guardar
        try {
            const response = await axios.put(
                `${apiEndpoint}/profile/edit/${profileData.username}`,
                { username, email },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            localStorage.removeItem('token');
            navigate('/login');
        } catch (err) {
            const errorMessage = err.response?.data?.error || '';
            if (errorMessage.includes('nombre de usuario ya está en uso')) {
                setFieldErrors({ username: t('errors.usernameTaken') });
            } else if (errorMessage.includes('correo electrónico ya está en uso')) {
                setFieldErrors({ email: t('errors.emailTaken') });
            } else if (errorMessage.includes('Formato de email inválido')) {
                setFieldErrors({ email: t('errors.invalidEmail') });
            } else if (errorMessage.includes('El nombre de usuario debe tener al menos 4 caracteres')) {
                setFieldErrors({ username: t('errors.usernameTooShort') });
            } else {
                setError(t('errors.updateProfile') + ': ' + errorMessage); // Clave de traducción
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        clearFieldError('username');
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        clearFieldError('email');
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
                <TextField
                    label={t('username')}
                    value={username}
                    onChange={handleUsernameChange}
                    fullWidth
                    margin="normal"
                    error={!!fieldErrors.username}
                    helperText={fieldErrors.username}
                />
                <TextField
                    label={t('email')}
                    value={email}
                    onChange={handleEmailChange}
                    fullWidth
                    margin="normal"
                    error={!!fieldErrors.email}
                    helperText={fieldErrors.email}
                />
                {/* Otros campos de edición */}
                <Button variant="contained" color="primary" onClick={handleSave}>
                    {t('save')}
                </Button>
                <Button onClick={handleCancel} style={{ marginLeft: '1rem' }}>
                    {t('cancel')}
                </Button>
            </Container>
        </div>
    );
};

export default EditProfile;