import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CalculateRoundedIcon from '@mui/icons-material/CalculateRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import { SitemarkIcon } from './CustomIcons';

const items = [
  {
    icon: <AccessTimeRoundedIcon sx={{ color: '#1565C0', fontSize: 24 }} />,
    title: 'Suivi des heures en temps réel',
    description:
      'Enregistrez et consultez les heures d\'enseignement de chaque enseignant avec une précision absolue.',
  },
  {
    icon: <CalculateRoundedIcon sx={{ color: '#1565C0', fontSize: 24 }} />,
    title: 'Calculs automatiques',
    description:
      'Équivalences horaires calculées automatiquement selon les normes de l\'enseignement supérieur.',
  },
  {
    icon: <SchoolRoundedIcon sx={{ color: '#1565C0', fontSize: 24 }} />,
    title: 'Gestion académique complète',
    description:
      'UEs, semestres, modules et enseignants gérés dans une interface intuitive et centralisée.',
  },
  {
    icon: <AccountBalanceWalletRoundedIcon sx={{ color: '#1565C0', fontSize: 24 }} />,
    title: 'Traçabilité des paiements',
    description:
      'Chaque heure supplémentaire est comptabilisée et tracée pour garantir une rémunération équitable.',
  },
];

export default function Content() {
  return (
    <Stack
      sx={{
        flexDirection: 'column',
        alignSelf: 'center',
        gap: 3,
        maxWidth: 480,
        px: { xs: 0, md: 2 },
      }}
    >
      {/* Logo */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, mb: 1 }}>
        <SitemarkIcon />
      </Box>

      {/* Titre accrocheur */}
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            color: '#0F172A',
            lineHeight: 1.2,
            mb: 1,
          }}
        >
          Gérez les heures d'enseignement
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            color: '#1565C0',
            lineHeight: 1.2,
            mb: 2,
          }}
        >
          simplement & efficacement.
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#64748B',
            fontFamily: 'Inter, sans-serif',
            lineHeight: 1.7,
          }}
        >
          La plateforme tout-en-un pour administrer les volumes horaires,
          les équivalences et les rémunérations de vos enseignants.
        </Typography>
      </Box>

      {/* Features */}
      <Stack gap={2.5}>
        {items.map((item, index) => (
          <Stack
            key={index}
            direction="row"
            sx={{
              gap: 2,
              alignItems: 'flex-start',
              p: 2,
              borderRadius: 2,
              bgcolor: 'rgba(21, 101, 192, 0.04)',
              border: '1px solid rgba(21, 101, 192, 0.08)',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'rgba(21, 101, 192, 0.08)',
                borderColor: 'rgba(21, 101, 192, 0.2)',
                transform: 'translateX(4px)',
              },
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                bgcolor: 'rgba(21, 101, 192, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {item.icon}
            </Box>
            <div>
              <Typography
                gutterBottom
                sx={{
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9rem',
                  color: '#0F172A',
                  mb: 0.3,
                }}
              >
                {item.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#64748B',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: 1.6,
                  fontSize: '0.82rem',
                }}
              >
                {item.description}
              </Typography>
            </div>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
