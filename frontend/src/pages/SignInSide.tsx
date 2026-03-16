import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppTheme from '../shared-theme/AppTheme';
import SignInCard from '../components/SignInCard';
import Content from '../components/Content';

export default function SignInSide(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />


      {/* Badge version en haut à gauche */}

      {/* Conteneur principal */}
      <Stack
        direction="column"
        component="main"
        sx={[
          {
            justifyContent: 'center',
            minHeight: '100svh',
            position: 'relative',
            overflow: 'hidden',
          },
          () => ({
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              zIndex: -2,
              inset: 0,
              backgroundImage:
                'radial-gradient(ellipse at 20% 30%, hsl(210, 60%, 94%) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, hsl(220, 40%, 95%) 0%, transparent 60%), linear-gradient(135deg, hsl(215, 30%, 96%) 0%, hsl(210, 20%, 98%) 100%)',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            },
          }),
        ]}
      >
        {/* Orbes décoratifs */}
        <Box
          sx={{
            position: 'absolute',
            top: '-15%',
            right: '-10%',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(21, 101, 192, 0.12) 0%, transparent 70%)',
            zIndex: -1,
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-15%',
            left: '-10%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
            zIndex: -1,
            pointerEvents: 'none',
          }}
        />

        {/* Layout à deux colonnes */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 6, md: 10 },
            p: { xs: 2, sm: 4, md: 6 },
            mx: 'auto',
            width: '100%',
            maxWidth: 1100,
          }}
        >
          {/* Colonne gauche - Contenu de présentation */}
          <Box
            sx={{
              flex: 1,
              display: { xs: 'none', md: 'block' },
              maxWidth: 520,
            }}
          >
            <Content />
          </Box>

          {/* Colonne droite - Formulaire de connexion */}
          <Box
            sx={{
              flex: { xs: 1, md: 'none' },
              width: { xs: '100%', md: 'auto' },
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <SignInCard />
          </Box>
        </Stack>

        {/* Footer */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '1.5rem',
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'Inter, sans-serif',
              color: '#94A3B8',
              fontSize: '0.75rem',
            }}
          >
            © {new Date().getFullYear()} GestHeures — Système de gestion des heures d&apos;enseignement supérieur
          </Typography>
        </Box>
      </Stack>
    </AppTheme>
  );
}
