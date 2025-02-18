import Typography from '@mui/material/Typography';

const Header = () => {
  return (
    <Typography variant="h4" component="h1" gutterBottom sx={{ fontFamily: 'serif', color: 'navy.900' }}>
      Goals for today
    </Typography>
  );
};

export default Header;
