import React, { useEffect, useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Typography,
  Button,
  Container,
  Box,
  AppBar,
  Toolbar,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const EPG_API_URL = process.env.REACT_APP_EPG_BACKEND_URL || '/api/epg/programs'; // configure in .env

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#E87A41', // Kavia orange
    },
    background: {
      default: '#1A1A1A',
      paper: '#23272f',
    },
    text: {
      primary: '#ffffff',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    subtitle1: {
      fontSize: '1.1rem',
      lineHeight: 1.5,
      color: 'rgba(255, 255, 255, 0.7)',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          padding: '10px 20px',
          fontSize: '1rem',
          textTransform: 'none',
          fontWeight: 500,
        },
        containedPrimary: {
          backgroundColor: '#E87A41',
          '&:hover': {
            backgroundColor: '#FF8B4D',
          },
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A1A1A',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }
      }
    }
  }
});

// PUBLIC_INTERFACE
function fetchPrograms(channel, date) {
  /**
   * Fetch EPG programs from the backend API for a given channel and date.
   * Returns a promise which resolves to the program list.
   * @param {string} channel - The channel name or id (optional).
   * @param {string} date - The date (YYYY-MM-DD format) (optional).
   * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
   */
  const params = [];
  if (channel) params.push(`channel=${encodeURIComponent(channel)}`);
  if (date) params.push(`date=${encodeURIComponent(date)}`);

  const url = EPG_API_URL + (params.length ? `?${params.join('&')}` : '');

  return fetch(url)
    .then(async (resp) => {
      if (resp.ok) {
        const data = await resp.json();
        return { success: true, data };
      } else {
        const err = await resp.text();
        return { success: false, error: err || `HTTP ${resp.status}` };
      }
    })
    .catch((err) => ({ success: false, error: String(err) }));
}

// PUBLIC_INTERFACE
function durationStr(start, end) {
  /** 
   * Format duration from start/end as human readable string (h:mm).
   */
  const diffMs = new Date(end) - new Date(start);
  if (isNaN(diffMs) || diffMs < 0) return '-';
  const minutes = Math.round(diffMs / 60000);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
}

// PUBLIC_INTERFACE
function formatTime(dtStr) {
  /** Return time part in HH:mm from an ISO string. */
  const d = new Date(dtStr);
  if (isNaN(d)) return '-';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const ProgramDetailsDialog = ({ open, handleClose, program }) => (
  <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
    <DialogTitle>Program Details</DialogTitle>
    <DialogContent>
      <DialogContentText>
        {program ? (
          <Box>
            <Typography variant="h6" sx={{mb: 1}}>{program.title}</Typography>
            <Typography gutterBottom variant="subtitle1" sx={{fontWeight: 500}}>
              {formatTime(program.start_time)} - {formatTime(program.end_time)} ({durationStr(program.start_time, program.end_time)})
            </Typography>
            <Typography variant="body1" sx={{mb: 2}}>
              {program.description || <em>No description available.</em>}
            </Typography>
            {program.genre && <Typography variant="body2" sx={{mb: 1}}>Genre: {program.genre}</Typography>}
            {program.channel && <Typography variant="body2">Channel: {program.channel}</Typography>}
          </Box>
        ) : (
          <span>No data</span>
        )}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">Close</Button>
    </DialogActions>
  </Dialog>
);

const FilterBar = ({
  channels,
  selectedChannel,
  setSelectedChannel,
  selectedDate,
  setSelectedDate,
  onRefresh
}) => {
  // Only show up to 30 days in the future/past for now
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() - 7);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 7);

  return (
    <Paper sx={{
      display: 'flex',
      alignItems: 'center',
      p: 2,
      gap: 2,
      mb: 3,
      background: '#23272f'
    }}>
      <Typography variant="subtitle1" sx={{fontWeight: 500}}>
        Filter by:
      </Typography>
      <TextField
        select
        label="Channel"
        value={selectedChannel}
        onChange={(e) => setSelectedChannel(e.target.value)}
        sx={{width: 180}}
        size="small"
        data-testid="channel-filter"
      >
        <MenuItem value="">All Channels</MenuItem>
        {channels.map((ch) => (
          <MenuItem value={ch} key={ch}>{ch}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Date"
        type="date"
        size="small"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        inputProps={{
          min: minDate.toISOString().slice(0, 10),
          max: maxDate.toISOString().slice(0, 10),
        }}
        sx={{width: 150}}
        data-testid="date-filter"
      />
      <IconButton data-testid="refresh-btn" color="primary" onClick={onRefresh} sx={{ml: 1}}>
        <RefreshIcon />
      </IconButton>
    </Paper>
  )
};

// PUBLIC_INTERFACE
function ProgramScheduleTable({ loading, error, programs, onShowDetails }) {
  /**
   * Show the EPG program schedule in a responsive table.
   * @param {boolean} loading
   * @param {?string} error
   * @param {Array} programs
   * @param {(program: object) => void} onShowDetails
   */
  if (loading) {
    return (
      <Box sx={{textAlign: 'center', my: 5}}>
        <CircularProgress sx={{ color: '#E87A41' }} />
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ my: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  if (!programs || programs.length === 0) {
    return (
      <Box sx={{ my: 3 }}>
        <Alert severity="info">No programs scheduled for selected filters.</Alert>
      </Box>
    );
  }
  return (
    <TableContainer component={Paper} sx={{ background: '#222', borderRadius: 3, mb: 3 }}>
      <Table aria-label="EPG Program Table">
        <TableHead>
          <TableRow>
            <TableCell sx={{color: '#E87A41', fontWeight: 700}}>Title</TableCell>
            <TableCell sx={{color: '#E87A41', fontWeight: 700}}>Time</TableCell>
            <TableCell sx={{color: '#E87A41', fontWeight: 700}}>Duration</TableCell>
            <TableCell sx={{color: '#E87A41', fontWeight: 700}}>Channel</TableCell>
            <TableCell sx={{color: '#E87A41', fontWeight: 700}}>Genre</TableCell>
            <TableCell sx={{color: '#E87A41', fontWeight: 700}}>More Info</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {programs.map((row, idx) => (
            <TableRow key={row.id || idx}>
              <TableCell>{row.title}</TableCell>
              <TableCell>{formatTime(row.start_time)} - {formatTime(row.end_time)}</TableCell>
              <TableCell>{durationStr(row.start_time, row.end_time)}</TableCell>
              <TableCell>{row.channel}</TableCell>
              <TableCell>{row.genre || '-'}</TableCell>
              <TableCell>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => onShowDetails(row)}
                  aria-label="Show Info"
                >
                  <InfoOutlinedIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function App() {
  // State for programs and filters
  const [programs, setPrograms] = useState([]);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    // Default to today
    const dt = new Date();
    return dt.toISOString().slice(0, 10);
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  function loadPrograms(channel, date) {
    setLoading(true);
    setError('');
    fetchPrograms(channel, date).then(({success, data, error}) => {
      if (success) {
        setPrograms(data || []);
        // Extract unique channels from program data
        const chSet = new Set();
        (data || []).forEach(p => {
          if (p.channel) chSet.add(p.channel);
        });
        setChannels(Array.from(chSet));
      } else {
        setError(error || 'Failed to fetch program schedule.');
        setPrograms([]);
      }
      setLoading(false);
    });
  }

  useEffect(() => {
    // On mount or filter, load the data
    loadPrograms(selectedChannel, selectedDate);
    // eslint-disable-next-line
  }, [selectedChannel, selectedDate]);

  function handleShowDetails(program) {
    setSelectedProgram(program);
    setShowDetails(true);
  }
  function handleCloseDialog() {
    setShowDetails(false);
    setSelectedProgram(null);
  }
  function handleRefresh() {
    loadPrograms(selectedChannel, selectedDate);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar position="fixed">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography
              variant="h6"
              sx={{
                mr: 5,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: '#E87A41',
                fontWeight: 700
              }}
            >
              EPG Viewer
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ ml: 2 }}
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{pt: 12}}>
        <Box sx={{
          pb: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3
        }}>
          <Typography
            variant="subtitle1"
            sx={{ color: '#E87A41', fontWeight: 500, letterSpacing: 1, mb: 0.5 }}
          >
            Electronic Program Guide
          </Typography>

          <Typography variant="h1" component="h1" sx={{mb: 2}}>
            TV Program Schedule
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{ maxWidth: '600px', mb: 2, fontSize: '1rem' }}
          >
            Browse your TV program schedule, filter by channel or date, and get all information about programs!
          </Typography>

          <FilterBar
            channels={channels}
            selectedChannel={selectedChannel}
            setSelectedChannel={setSelectedChannel}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onRefresh={handleRefresh}
          />
          <ProgramScheduleTable
            loading={loading}
            error={error}
            programs={programs}
            onShowDetails={handleShowDetails}
          />

          <ProgramDetailsDialog
            open={showDetails}
            handleClose={handleCloseDialog}
            program={selectedProgram}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
