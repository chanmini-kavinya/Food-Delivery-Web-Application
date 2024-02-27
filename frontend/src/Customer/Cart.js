import * as React from 'react';
import axios from 'axios';
import { styled, createTheme, ThemeProvider} from '@mui/material/styles';
import { colors } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import { mainListItems, secondaryListItems } from './listItems';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useNavigate,useLocation } from "react-router-dom";
import {useEffect, useState } from "react";
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#388e3c',
    },
    secondary: colors.amber,
  },
});


export default function Cart() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  
  const [image, setImage] = useState("");
  const [foods, setFood] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

 
  useEffect(() => {
    (async () => await Load())();
    }, []);
     
    async function  Load()
    {
       const result = await axios.get(
           "http://localhost:8085/api/cart/");
           setFood(result.data.data);
           console.log(result.data);

    }
    
   
    async function minus(f_id)
    {
    try
        {
         await axios.post("http://localhost:8085/api/cart_m",
        {
        
          f_id: f_id
        
        });         
         
          Load();
        
        }
    catch(err)
        {
          alert("Cart Failed"+err);
        }
   }
 
   async function plus(f_id,price)
   {
   try
       {
        await axios.post("http://localhost:8085/api/cart_p",
       {
       
         f_id: f_id,
         quantity: 1,
         price:price,
         amount: price
       
       });
        
        
         Load();
       
       }
   catch(err)
       {
         alert("Cart Failed"+err);
       }
  }

  async function empty()
  {
  try
      {
        if(foods.reduce((n, {amount}) => n + amount, 0)>0)
        {
       await axios.delete("http://localhost:8085/api/cart");
       
        Load();
        }
      
      }
  catch(err)
      {
        alert("Cart Failed"+err);
      }
 }

 async function confirm()
  {
  try
      {
        if(foods.reduce((n, {amount}) => n + amount, 0)>0)
        {
          axios.post("http://localhost:8085/api/orders",
          {
          
            uname: sessionStorage.getItem('uname'),
            total_amount: foods.reduce((n, {amount}) => n + amount, 0)
          
          });
            alert("Your order is placed");
          
            await axios.delete("http://localhost:8085/api/cart");
            Load();
        }
        else{
          alert("Cart is empty");
        }
      
      }
  catch(err)
      {
        alert("Cart Failed"+err);
      }
 }
    
    const theme = useTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              My Cart
            </Typography>
     
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
              height:50
            }}
          >
             <img src='http://localhost:8085/images/DineEaseLogo.png'  height="70" width="350" />
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Grid item xs={12} minWidth={990} >
                <Paper
                  sx={{
                    p:2,
                    display: 'flex',
                    flexDirection: 'column',
                    
                  }}
                >
                  <div>
                    <Box sx={{ width: '100%' }}>
                  {foods.map(function fn(food)
                  {
                        return(
                           <Card sx={{ display: 'flex', flexDirection:'row', margin:5 , width:850}}>
                            <CardMedia
                                component="img"
                                sx={{ width: 180, height:180}}
                                image={'http://localhost:8085/images/'+food.image}
                                alt=""
                              />&emsp;
                              <Box sx={{ display: 'flex', flexDirection: 'column'}}>
                                <CardContent sx={{ flex: '1 0 auto' }}>
                                  <Typography component="div" variant="h5">
                                    {food.name}
                                  </Typography>
                                  <Typography variant="subtitle1" color="text.secondary" component="div">
                                    Rs. {food.price}
                                  </Typography>
                                </CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                              
                                    <Button variant="contained" color="error" onClick={() =>minus(food.f_id)}>
                                    <b>-</b>
                                    </Button>
                                   &emsp;
                                   <b>{food.quantity}</b>
                                   &emsp;
                                   <Button variant="contained" color="success" onClick={() =>plus(food.f_id,food.price)}>
                                      <b>+</b>
                                    </Button>
                                 
                                </Box>
                              </Box>
                              
                              <Typography component="div" variant="h5" margin={7} marginLeft={45} >
                                    Rs. {food.amount}
                                  </Typography>
                            </Card>
                        
                        );
                        })}
                </Box>
                <Typography component="div" variant="h5" margin={7} marginLeft={93} >
                                    Rs.{foods.reduce((n, {amount}) => n + amount, 0)}
                                  </Typography>
                <Stack marginLeft={5} spacing={71} direction="row">
                <Button variant="outlined" color="inherit" onClick={empty}>Empty Cart</Button>
                  <Button variant="contained" color='success' onClick={confirm} >Confirm Order</Button>
                  
                </Stack>
                </div>
                </Paper>
              </Grid>    
          </Container>
          
        </Box>
      </Box>
      
    </ThemeProvider>
  );
}