import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function LoadingPage({loadingTxt}) {
  return (
    <Box className="loadPgBox">
      <LinearProgress className='linearProgress' />
      <div className='loadingDataTxt mt-4'>{loadingTxt}</div>
    </Box>
  );
}
