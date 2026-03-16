import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import InputAdornment from '@mui/material/InputAdornment';

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleClose();
          },
          sx: {
            backgroundImage: 'none',
            borderRadius: 3,
            minWidth: { xs: '90%', sm: 420 },
            p: 1,
          },
        },
      }}
    >
      {/* En-tête avec icône */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 3,
          pb: 1,
          px: 3,
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            bgcolor: 'rgba(21, 101, 192, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <EmailRoundedIcon sx={{ color: '#1565C0', fontSize: 28 }} />
        </Box>
        <DialogTitle
          sx={{
            p: 0,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: '1.2rem',
            color: '#0F172A',
          }}
        >
          Réinitialiser le mot de passe
        </DialogTitle>
      </Box>

      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', pt: 1 }}
      >
        <DialogContentText
          sx={{
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif',
            color: '#64748B',
            fontSize: '0.9rem',
          }}
        >
          Entrez l&apos;adresse e-mail de votre compte. Nous vous enverrons
          un lien pour réinitialiser votre mot de passe.
        </DialogContentText>
        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="reset-email"
          name="email"
          placeholder="votre@email.com"
          type="email"
          fullWidth
          startAdornment={
            <InputAdornment position="start">
              <EmailRoundedIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
            </InputAdornment>
          }
          sx={{
            borderRadius: 2,
            fontFamily: 'Inter, sans-serif',
            '& fieldset': { borderColor: '#E2E8F0' },
            '&:hover fieldset': { borderColor: '#1565C0' },
            '&.Mui-focused fieldset': { borderColor: '#1565C0' },
          }}
        />
        <Typography
          variant="caption"
          sx={{ color: '#94A3B8', fontFamily: 'Inter, sans-serif', textAlign: 'center' }}
        >
          Vérifiez vos spams si vous ne recevez pas l&apos;e-mail dans les 5 minutes.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ pb: 3, px: 3, gap: 1 }}>
        <Button
          onClick={handleClose}
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            color: '#64748B',
            borderRadius: 2,
            textTransform: 'none',
            '&:hover': { bgcolor: '#F1F5F9' },
          }}
        >
          Annuler
        </Button>
        <Button
          variant="contained"
          type="submit"
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            bgcolor: '#1565C0',
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            '&:hover': { bgcolor: '#0D47A1' },
          }}
        >
          Envoyer le lien
        </Button>
      </DialogActions>
    </Dialog>
  );
}
