import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  LinearProgress,
  Alert,
  Collapse,
  InputAdornment,
  Divider,
} from '@mui/material'
import CloseIcon       from '@mui/icons-material/Close'
import VisibilityIcon  from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

type Props = {
  open:    boolean
  onClose: () => void
}

type ShowState = {
  current: boolean
  next:    boolean
  confirm: boolean
}

type StrengthLevel = {
  value:  number   // 0–100
  label:  string
  color:  'error' | 'warning' | 'info' | 'success'
}

function getStrength(pwd: string): StrengthLevel {
  let score = 0
  if (pwd.length >= 8)            score++
  if (/[A-Z]/.test(pwd))         score++
  if (/[0-9]/.test(pwd))         score++
  if (/[^A-Za-z0-9]/.test(pwd))  score++

  const map: Record<number, StrengthLevel> = {
    0: { value: 0,   label: '',       color: 'error'   },
    1: { value: 25,  label: 'Weak',   color: 'error'   },
    2: { value: 50,  label: 'Fair',   color: 'warning' },
    3: { value: 75,  label: 'Good',   color: 'info'    },
    4: { value: 100, label: 'Strong', color: 'success' },
  }
  return map[score]
}

export function ChangePasswordModal({ open, onClose }: Props) {
  const [current, setCurrent]   = useState('')
  const [next, setNext]         = useState('')
  const [confirm, setConfirm]   = useState('')
  const [show, setShow]         = useState<ShowState>({ current: false, next: false, confirm: false })
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)

  const strength = getStrength(next)

  function toggleShow(field: keyof ShowState) {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  function handleClose() {
    setCurrent(''); setNext(''); setConfirm('')
    setError(''); setSuccess(false)
    onClose()
  }

  function handleSave() {
    setError('')

    if (!current) { setError('Please enter your current password.'); return }
    if (next.length < 8) { setError('New password must be at least 8 characters.'); return }
    if (next !== confirm) { setError('Passwords do not match.'); return }

    setSuccess(true)
    setTimeout(() => handleClose(), 1400)
  }

  const eyeAdornment = (field: keyof ShowState) => ({
    endAdornment: (
      <InputAdornment position="end">
        <IconButton size="small" onClick={() => toggleShow(field)} edge="end">
          {show[field]
            ? <VisibilityOffIcon sx={{ fontSize: 16 }} />
            : <VisibilityIcon    sx={{ fontSize: 16 }} />}
        </IconButton>
      </InputAdornment>
    ),
  })

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' },
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
          pb: 1.5, pt: 2, px: 2.5,
        }}
      >
        <Typography fontSize={15} fontWeight={500} color="text.primary">
          Change password
        </Typography>
        <IconButton size="small" onClick={handleClose} sx={{ color: 'grey.500' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ pt: 2.5, px: 2.5, pb: 1 }}>
        <Collapse in={!!error}>
          <Alert severity="error" sx={{ mb: 2, fontSize: 12 }}>{error}</Alert>
        </Collapse>
        <Collapse in={success}>
          <Alert severity="success" sx={{ mb: 2, fontSize: 12 }}>
            Password updated successfully.
          </Alert>
        </Collapse>

        {/* Current password */}
        <TextField
          label="Current password"
          type={show.current ? 'text' : 'password'}
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          InputProps={eyeAdornment('current')}
          inputProps={{ style: { fontSize: 13 } }}
          InputLabelProps={{ style: { fontSize: 12 } }}
        />

        <Divider sx={{ mb: 2, borderColor: 'grey.100' }} />

        {/* New password + strength */}
        <TextField
          label="New password"
          type={show.next ? 'text' : 'password'}
          value={next}
          onChange={(e) => setNext(e.target.value)}
          fullWidth
          size="small"
          sx={{ mb: 0.5 }}
          InputProps={eyeAdornment('next')}
          inputProps={{ style: { fontSize: 13 } }}
          InputLabelProps={{ style: { fontSize: 12 } }}
        />

        {/* Strength bar */}
        {next.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <LinearProgress
              variant="determinate"
              value={strength.value}
              color={strength.color}
              sx={{ height: 3, borderRadius: 99, bgcolor: 'grey.200', mt: 0.5 }}
            />
            <Typography fontSize={10} color={`${strength.color}.main`} sx={{ mt: 0.5 }}>
              {strength.label}
            </Typography>
          </div>
        )}

        {/* Confirm password */}
        <TextField
          label="Confirm new password"
          type={show.confirm ? 'text' : 'password'}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          fullWidth
          size="small"
          sx={{ mb: 1, mt: next.length > 0 ? 0 : 1.5 }}
          InputProps={eyeAdornment('confirm')}
          inputProps={{ style: { fontSize: 13 } }}
          InputLabelProps={{ style: { fontSize: 12 } }}
          error={!!confirm && confirm !== next}
          helperText={!!confirm && confirm !== next ? 'Passwords do not match' : ''}
          FormHelperTextProps={{ style: { fontSize: 10 } }}
        />
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          borderTop: '0.5px solid',
          borderColor: 'grey.200',
          px: 2.5, py: 1.5, gap: 1,
        }}
      >
        <Button
          onClick={handleClose}
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
          Update password
        </Button>
      </DialogActions>
    </Dialog>
  )
}