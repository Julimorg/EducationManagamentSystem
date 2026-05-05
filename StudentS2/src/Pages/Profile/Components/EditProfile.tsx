import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  IconButton,
  Typography,
  Alert,
  Collapse,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { ProfileData } from '../Profile'


type Props = {
  open:    boolean
  profile: ProfileData
  onClose: () => void
  onSave:  (updated: Partial<ProfileData>) => void
}

type FormState = {
  userName:   string
  nickName:   string
  dob:        string
  address:    string
  schoolName: string
}

export function EditProfileModal({ open, profile, onClose, onSave }: Props) {
  const [form, setForm]         = useState<FormState>(toForm(profile))
  const [success, setSuccess]   = useState(false)

  // Sync form when profile changes or modal reopens
  useEffect(() => {
    if (open) {
      setForm(toForm(profile))
      setSuccess(false)
    }
  }, [open, profile])

  function toForm(p: ProfileData): FormState {
    return {
      userName:   p.userName,
      nickName:   p.nickName,
      dob:        p.dob,
      address:    p.address,
      schoolName: p.schoolName,
    }
  }

  function handleChange(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }
  }

  function handleSave() {
    onSave(form)
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      onClose()
    }, 1200)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        },
      }}
    >
      {/* Title */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '0.5px solid',
          borderColor: 'grey.200',
          pb: 1.5,
          pt: 2,
          px: 2.5,
        }}
      >
        <Typography fontSize={15} fontWeight={500} color="text.primary">
          Edit profile
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: 'grey.500' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ pt: 2.5, px: 2.5, pb: 1 }}>
        <Collapse in={success}>
          <Alert severity="success" sx={{ mb: 2, fontSize: 12 }}>
            Profile updated successfully.
          </Alert>
        </Collapse>

        <Grid container spacing={2}>
          {/* User name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="User name"
              value={form.userName}
              onChange={handleChange('userName')}
              fullWidth
              size="small"
              inputProps={{ style: { fontSize: 13 } }}
              InputLabelProps={{ style: { fontSize: 12 } }}
            />
          </Grid>

          {/* Nick name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nick name"
              value={form.nickName}
              onChange={handleChange('nickName')}
              placeholder="Optional"
              fullWidth
              size="small"
              inputProps={{ style: { fontSize: 13 } }}
              InputLabelProps={{ style: { fontSize: 12 } }}
            />
          </Grid>

          {/* Email — read only */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email address"
              value={profile.email}
              fullWidth
              size="small"
              disabled
              helperText="Email cannot be changed"
              inputProps={{ style: { fontSize: 13 } }}
              InputLabelProps={{ style: { fontSize: 12 } }}
              FormHelperTextProps={{ style: { fontSize: 10 } }}
            />
          </Grid>

          {/* Date of birth */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date of birth"
              type="date"
              value={form.dob}
              onChange={handleChange('dob')}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true, style: { fontSize: 12 } }}
              inputProps={{ style: { fontSize: 13 } }}
            />
          </Grid>

          {/* Address */}
          <Grid item xs={12}>
            <TextField
              label="Address"
              value={form.address}
              onChange={handleChange('address')}
              fullWidth
              size="small"
              inputProps={{ style: { fontSize: 13 } }}
              InputLabelProps={{ style: { fontSize: 12 } }}
            />
          </Grid>

          {/* School name */}
          <Grid item xs={12}>
            <TextField
              label="School name"
              value={form.schoolName}
              onChange={handleChange('schoolName')}
              fullWidth
              size="small"
              inputProps={{ style: { fontSize: 13 } }}
              InputLabelProps={{ style: { fontSize: 12 } }}
            />
          </Grid>
        </Grid>

        <Typography
          fontSize={10}
          color="text.secondary"
          sx={{ mt: 2, fontStyle: 'italic' }}
        >
          * Class, session, target band and status cannot be edited here.
        </Typography>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          borderTop: '0.5px solid',
          borderColor: 'grey.200',
          px: 2.5,
          py: 1.5,
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          size="small"
          variant="outlined"
          sx={{ fontSize: 12, textTransform: 'none', borderColor: 'grey.300', color: 'grey.700' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          size="small"
          variant="contained"
          sx={{
            fontSize: 12,
            textTransform: 'none',
            bgcolor: 'grey.800',
            '&:hover': { bgcolor: 'grey.900' },
            boxShadow: 'none',
          }}
        >
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  )
}