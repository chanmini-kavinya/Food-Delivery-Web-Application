import * as React from 'react';
import axios from 'axios';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
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
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import { mainListItems, secondaryListItems } from './listItems';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import {useEffect, useState } from "react";
import CardActions from '@mui/material/CardActions';
import Checkbox from '@mui/material/Checkbox';
import { DataGrid } from '@mui/x-data-grid';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

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


export default function Dashboard() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  

  const [orders, setOrders] = useState([]);
  const [orderDesc, setOrderDesc] = useState([]);
 
  useEffect(() => {
    (async () => await Load())();
    }, []);
      
    async function  Load()
    {
       const result = await axios.get(
           "http://localhost:8085/api/orders/"+sessionStorage.getItem("uname"));
           setOrders(result.data.data);

           const result2 = await axios.get(
            "http://localhost:8085/api/order_desc/"+sessionStorage.getItem("uname"));
            setOrderDesc(result2.data.data);
    }
    
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
              Orders
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
                  <Grid container rowSpacing={0} columnSpacing={{ xs: 1, sm: 2, md: 0 }}>
                  {orders.map(function fn(order)
                  {
                    var myData = [];
                    var i=1;
                        return(
                            
                            <Box sx={{ minWidth: 275 }} margin={2.7}>
                            <Card variant="outlined">
                            <React.Fragment>
                                <CardContent>
                                <CardActions  > 
                                <Typography variant="h6" component="div">
                                    Ready
                                </Typography>
                                <Checkbox size='medium'  {...label} color="success"  checked={order.ready} onChange={e => {
                                  
                                  if(e.target.checked)
                                  {
                                    axios.put("http://localhost:8085/api/orders/"+order.o_id,
                                    {    
                                      isChecked:1    
                                    });
                                  }
                                  else{
                                    axios.put("http://localhost:8085/api/orders/"+order.o_id,
                                    {    
                                      isChecked:0    
                                    });
                                  }
                                  
                                  Load();
                              }} />
                              </CardActions>
                              <CardActions>
                                <Typography sx={{ mb: 1.5 }} variant="h6" component="div">
                                   Order No: {order.o_id}  
                                </Typography>
                                </CardActions>
                                
                                {orderDesc.map(function fn(o)
                                {
                                    if(o.o_id==order.o_id)
                                    {
                                      var obj = { 
                                        id:  i,
                                        Food: o.name,
                                        Qty: o.quantity,
                                        Unit_Price: o.unit_price,
                                        Amount: o.amount
                                      };
                                      myData.push(obj);
                                      i++;
                                      
                                    }
                                })}
                                {console.log(myData)}
                                <Box sx={{ height: 250, width: '100%' }}>
                                  <DataGrid hideFooter
                                    columns={[{ field: 'Food',width: 130 }, { field: 'Qty',width: 50,  align:'right', headerAlign: 'right' }, { field: 'Unit_Price',  align:'right', headerAlign: 'right' }, { field: 'Amount',  align:'right' , headerAlign: 'right'}]}
                                    rows={myData}
                                  />
                                </Box>
                                
                                <hr/>
                                <Typography sx={{ mb: 1.5 }} variant="subtitle1" color="text.secondary" component="div">
                                    Total Amount: Rs.{order.tot_amount}  
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} variant="subtitle1" color="text.secondary" component="div">
                                    Date & Time: {order.date_time}  
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} variant="subtitle1" color="text.secondary" component="div">
                                    Name: {order.first_name}   {order.last_name}   
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} variant="subtitle1" color="text.secondary" component="div">
                                    Contact: {order.contact_no}  
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} variant="subtitle1" color="text.secondary" component="div">
                                    Address: {order.address}  
                                </Typography>
                                </CardContent>
                                
                            </React.Fragment>
                            </Card>
                            </Box>
                        ); 
                        })}
                  </Grid>
                </Box>

                  
                </div>
                </Paper>
              </Grid>     
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}