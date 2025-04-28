import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
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
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [staticUsername, setStaticUsername] = useState("");

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
                setStaticUsername(response.data.username);
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
            await axios.put(
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

    const handleChangePassword = async () => {
        setError(null);
        setLoading(true);
        setFieldErrors({}); // Limpiar errores previos al intentar guardar
        try {
            await axios.put(
                `${apiEndpoint}/profile/changePassword/${profileData.username}`,
                { staticUsername, currentPassword, newPassword, repeatPassword },
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
            if (errorMessage.includes('Contraseña actual errónea')) {
                setFieldErrors({ currentPassword: t('errors.password-incorrect') });
            } else if (errorMessage.includes('Formato inválido')) {
                setFieldErrors({ newPassword: t('errors.weakPassword') });
            } else if (errorMessage.includes('Las contraseñas deben ser iguales')) {
                setFieldErrors({ repeatPassword: t('errors.password-dont-match') });
            }
        } finally {
            setLoading(false);
        }
      };

    if (loading) {
        return (
            <div>
                <NavBar />
                <Container component="main" data-testid="loading-container">
                    <Typography data-testid="loading-text">{t('loading')}...</Typography>
                </Container>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <NavBar />
                <Container component="main" data-testid="error-container">
                    <Typography color="error" data-testid="error-text">{error}</Typography>
                </Container>
            </div>
        );
    }

    return (
        <div data-testid="edit-profile-container">
            <NavBar />
            <Container component="main">
                <Typography variant="h4" gutterBottom data-testid="edit-profile-title">
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
                    data-testid="username-input"
                    inputProps={{ 'data-testid': 'username-field' }}
                    InputLabelProps={{ 'data-testid': 'username-label' }}
                />
                <TextField
                    label={t('email')}
                    value={email}
                    onChange={handleEmailChange}
                    fullWidth
                    margin="normal"
                    error={!!fieldErrors.email}
                    helperText={fieldErrors.email}
                    data-testid="email-input"
                    inputProps={{ 'data-testid': 'email-field' }}
                    InputLabelProps={{ 'data-testid': 'email-label' }}
                />
                {/* Otros campos de edición */}
                <Button
                    className='edit-buttons'
                    variant="contained"
                    onClick={handleSave}
                    data-testid="save-button"
                >
                    {t('save')}
                </Button>
                <Button
                    id='cancel-button'
                    onClick={handleCancel}
                    style={{ marginLeft: '1rem' }}
                    data-testid="cancel-button"
                >
                    {t('cancel')}
                </Button>
                <br/><br/>
                <Typography variant="h4" gutterBottom data-testid="edit-profile-title">
                        {t('edit-password')}
                </Typography>
                <TextField
                    label={t("actual-password")}
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={currentPassword}
                    error={!!fieldErrors.currentPassword}
                    helperText={fieldErrors.currentPassword}
                    inputProps={{ 'data-testid': 'current-field' }}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    sx={{ mb: 3 }}
                    />
                <TextField
                    label={t("new-password")}
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={newPassword}
                    error={!!fieldErrors.newPassword}
                    helperText={fieldErrors.newPassword}
                    inputProps={{ 'data-testid': 'new-field' }}
                    onChange={(e) => setNewPassword(e.target.value)}
                    sx={{ mb: 3 }}
                    />
                <TextField
                    label={t("repeat-password")}
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={repeatPassword}
                    error={!!fieldErrors.repeatPassword}
                    helperText={fieldErrors.repeatPassword}
                    inputProps={{ 'data-testid': 'repeat-field' }}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    sx={{ mb: 3 }}
                    />
                <Button
                    variant="contained"
                    color="primary"
                    className='edit-buttons'
                    data-testid="change-button"
                    onClick={handleChangePassword}
                    size="large"
                    >
                    {t("edit-password")}
                </Button>
            </Container>
        </div>
    );
};

export default EditProfile;