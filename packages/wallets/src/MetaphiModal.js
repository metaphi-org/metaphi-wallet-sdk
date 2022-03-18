import { createTheme, ThemeProvider } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { MetaphiLoginContent } from './MetaphiLoginContent';

const MetaphiModal = ({ email, show, onConnect }) => {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Dialog open={show} sx={{ overflow: 'unset' }}>
        <DialogContent>
          <MetaphiLoginContent email={email} onConnect={onConnect} />
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export { MetaphiModal };
