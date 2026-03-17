import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import ForgotPassword from './ForgotPassword';
import { SitemarkIcon } from './CustomIcons';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2.5),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
  border: '1px solid #E8EDF2',
  borderRadius: 16,
  [theme.breakpoints.up('sm')]: {
    width: '460px',
  },
  background: '#FFFFFF',
}));

export default function SignInCard() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState('');

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    setLoginError('');

    const data = new FormData(event.currentTarget);
    const credentials = {
      email: data.get('email'),
      password: data.get('password'),
    };

    try {
      // Appel API vers le backend
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const err = await response.json();
        setLoginError(err.message || 'Identifiants incorrects. Veuillez réessayer.');
      } else {
        const result = await response.json();
        // Stocker le token JWT
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        // Redirection vers le dashboard
        window.location.href = '/dashboard';
      }
    } catch {
      setLoginError('Erreur de connexion au serveur. Vérifiez votre réseau.');
    } finally {
      setLoading(false);
    }
  };

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Veuillez entrer une adresse e-mail valide.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Le mot de passe doit contenir au moins 6 caractères.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <Card variant="outlined">
      {/* Logo mobile uniquement */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 1 }}>
        <SitemarkIcon />
      </Box>

      {/* En-tête du card */}
      <Box>
        <Typography
          component="h1"
          variant="h5"
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            color: '#0F172A',
            mb: 0.5,
          }}
        >
          Bienvenue 👋
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'Inter, sans-serif',
            color: '#64748B',
          }}
        >
          Connectez-vous à votre espace de gestion des heures
        </Typography>
      </Box>

      {/* Alerte d'erreur de connexion */}
      {loginError && (
        <Alert
          severity="error"
          onClose={() => setLoginError('')}
          sx={{ borderRadius: 2, fontFamily: 'Inter, sans-serif', fontSize: '0.85rem' }}
        >
          {loginError}
        </Alert>
      )}

      {/* Formulaire */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
      >
        {/* Email */}
        <FormControl>
          <FormLabel
            htmlFor="email"
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: '#374151',
              mb: 0.7,
            }}
          >
             Nom d'utilisateur ou courriel
          </FormLabel>
          <TextField
            error={emailError}
            helperText={emailErrorMessage}
            id="email"
            type="email"
            name="email"
            placeholder="votre@institution.edu"
            autoComplete="email"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={emailError ? 'error' : 'primary'}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailRoundedIcon
                      sx={{ color: emailError ? '#EF4444' : '#94A3B8', fontSize: 20 }}
                    />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9rem',
                '& fieldset': { borderColor: '#E2E8F0' },
                '&:hover fieldset': { borderColor: '#1565C0' },
                '&.Mui-focused fieldset': { borderColor: '#1565C0', borderWidth: 2 },
                '&.Mui-error fieldset': { borderColor: '#EF4444' },
              },
              '& .MuiFormHelperText-root': {
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.78rem',
              },
            }}
          />
        </FormControl>

        {/* Mot de passe */}
        <FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.7 }}>
            <FormLabel
              htmlFor="password"
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '0.85rem',
                color: '#374151',
              }}
            >
              Mot de passe
            </FormLabel>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.8rem',
                color: '#1565C0',
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Mot de passe oublié ?
            </Link>
          </Box>
          <TextField
            error={passwordError}
            helperText={passwordErrorMessage}
            name="password"
            placeholder="••••••••"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            required
            fullWidth
            variant="outlined"
            color={passwordError ? 'error' : 'primary'}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRoundedIcon
                      sx={{ color: passwordError ? '#EF4444' : '#94A3B8', fontSize: 20 }}
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePassword}
                      edge="end"
                      size="small"
                      sx={{ color: '#94A3B8' }}
                      aria-label="Afficher/masquer le mot de passe"
                    >
                      {showPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9rem',
                '& fieldset': { borderColor: '#E2E8F0' },
                '&:hover fieldset': { borderColor: '#1565C0' },
                '&.Mui-focused fieldset': { borderColor: '#1565C0', borderWidth: 2 },
                '&.Mui-error fieldset': { borderColor: '#EF4444' },
              },
              '& .MuiFormHelperText-root': {
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.78rem',
              },
            }}
          />
        </FormControl>

        {/* Se souvenir de moi */}
        <FormControlLabel
          control={
            <Checkbox
              value="remember"
              sx={{
                color: '#CBD5E1',
                '&.Mui-checked': { color: '#1565C0' },
              }}
            />
          }
          label={
            <Typography
              variant="body2"
              sx={{ fontFamily: 'Inter, sans-serif', color: '#64748B', fontSize: '0.85rem' }}
            >
              Se souvenir de moi
            </Typography>
          }
        />

        <ForgotPassword open={open} handleClose={handleClose} />

        {/* Bouton de connexion */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={18} sx={{ color: 'white' }} />
            ) : (
              <LoginRoundedIcon />
            )
          }
          sx={{
            py: 1.5,
            borderRadius: 2,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '0.95rem',
            textTransform: 'none',
            letterSpacing: 0.3,
            bgcolor: '#2352DE',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: '#0D47A1',
              boxShadow: '0 6px 20px rgba(21, 101, 192, 0.5)',
              transform: 'translateY(-1px)',
            },
            '&:active': { transform: 'translateY(0)' },
            '&.Mui-disabled': { bgcolor: '#CBD5E1', boxShadow: 'none' },
          }}
        >
          {loading ? 'Connexion en cours…' : 'Se connecter'}
        </Button>
      </Box>

      {/* Divider */}
      <Divider
        sx={{
          '&::before, &::after': { borderColor: '#E2E8F0' },
          '& .MuiDivider-wrapper': {
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.78rem',
            color: '#94A3B8',
            px: 2,
          },
        }}
      >
        ou continuer avec
      </Divider>

      {/* Boutons sociaux */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert('Connexion avec Microsoft 365')}
          sx={{
            py: 1.2,
            borderRadius: 2,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: '0.88rem',
            textTransform: 'none',
            borderColor: '#E2E8F0',
            color: '#374151',
            gap: 1.5,
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: '#1565C0',
              bgcolor: 'rgba(21, 101, 192, 0.04)',
              transform: 'translateY(-1px)',
            },
          }}
          startIcon={
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="0" y="0" width="8.5" height="8.5" fill="#F25022" />
              <rect x="9.5" y="0" width="8.5" height="8.5" fill="#7FBA00" />
              <rect x="0" y="9.5" width="8.5" height="8.5" fill="#00A4EF" />
              <rect x="9.5" y="9.5" width="8.5" height="8.5" fill="#FFB900" />
            </svg>
          }
        >
          Microsoft 365
        </Button>

        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert('Connexion avec Google')}
          sx={{
            py: 1.2,
            borderRadius: 2,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: '0.88rem',
            textTransform: 'none',
            borderColor: '#E2E8F0',
            color: '#374151',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: '#DB4437',
              bgcolor: 'rgba(219, 68, 55, 0.04)',
              transform: 'translateY(-1px)',
            },
          }}
          startIcon={
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M15.68 8.18182C15.68 7.61455 15.6291 7.06909 15.5345 6.54545H8V9.64364H12.3055C12.1164 10.64 11.5491 11.4836 10.6982 12.0509V14.0655H13.2945C14.8073 12.6691 15.68 10.6182 15.68 8.18182Z" fill="#4285F4" />
              <path d="M8 16C10.16 16 11.9709 15.2873 13.2945 14.0655L10.6982 12.0509C9.98545 12.5309 9.07636 12.8218 8 12.8218C5.92 12.8218 4.15273 11.4182 3.52 9.52727H0.858182V11.5927C2.17455 14.2036 4.87273 16 8 16Z" fill="#34A853" />
              <path d="M3.52 9.52C3.36 9.04 3.26545 8.53091 3.26545 8C3.26545 7.46909 3.36 6.96 3.52 6.48V4.41455H0.858182C0.312727 5.49091 0 6.70545 0 8C0 9.29455 0.312727 10.5091 0.858182 11.5855L3.52 9.52Z" fill="#FBBC05" />
              <path d="M8 3.18545C9.17818 3.18545 10.2255 3.59273 11.0618 4.37818L13.3527 2.08727C11.9636 0.792727 10.16 0 8 0C4.87273 0 2.17455 1.79636 0.858182 4.41455L3.52 6.48C4.15273 4.58909 5.92 3.18545 8 3.18545Z" fill="#EA4335" />
            </svg>
          }
        >
          Google Workspace
        </Button>
      </Box>

      {/* Footer légal */}
      <Typography
        variant="caption"
        sx={{
          textAlign: 'center',
          color: '#94A3B8',
          fontFamily: 'Inter, sans-serif',
          lineHeight: 1.6,
        }}
      >
        En vous connectant, vous acceptez nos{' '}
        <Link href="#" sx={{ color: '#1565C0', fontSize: 'inherit' }}>
          Conditions d&apos;utilisation
        </Link>{' '}
        et notre{' '}
        <Link href="#" sx={{ color: '#1565C0', fontSize: 'inherit' }}>
          Politique de confidentialité
        </Link>
        .
      </Typography>
    </Card>
  );
}
