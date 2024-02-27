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
import { useNavigate } from "react-router-dom";
import {useEffect, useState } from "react";

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
  

  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  async function navRestaurant(r_no)
  {
   navigate('/Restaurant',{
    state:{
      res_no: r_no,
    }
   });
  }
 
  useEffect(() => {
    (async () => await Load())();
    }, []);
      
  
  const [f_id, setId] = useState();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState();
  const [image, setImage] = useState();
  const [r_id, setRid] = useState();
  const [fileChange, setFileChange] = useState(0);

  const [foods, setFood] = useState([]);

  //location.state.username
  
  async function  Load()
    {
       const result = await axios.get(
           "http://localhost:8085/api/resfoods/"+ sessionStorage.getItem('uname'));
           if(result.data.data[0].f_id!=null)
           {
            setFood(result.data.data);
           }
           
           setRid(result.data.data[0].r_no);
           console.log(result.data);

       //setImage(result.data.data[0].image);
    }

    async function save(event)
    {
        event.preventDefault();
    try
        {
         await axios.post("http://localhost:8085/api/foods",
        { 
          name: name,
          price: price,
          description: description,
          //image:image,
          r_id:r_id
        });

        const formdata = new FormData()
        formdata.append("image", image)

        await axios.post('http://localhost:8085/upload',formdata)
        .then(res=>{
            if(res.data.Status==="Success"){
                console.log("Succeed");
            }
            else{
                console.log("Failed")
            }
        })
        .catch(err=>console.log(err));
        
          // alert("Food inserted Successfully");
          Load();
         
        
        }
    catch(err)
        {
          alert("Food insertion Failed"+err);
        }
   }
   
   async function editFood(foods)
   {
    setId(foods.f_id);
    setName(foods.name);
    setDescription(foods.description);
    setPrice(foods.price); 
    setImage(foods.image);
    setFileChange(0);
   }

   async function DeleteFood(id)
   {
    if (window.confirm('Are you sure you want to delete this food?')) {
      await axios.delete("http://localhost:8085/api/foods/" + id); 
      //alert("Food deleted Successfully");
      Load();
    }      
           
   }

   async function update(event)
   {
    event.preventDefault();

   try
       {
        
        await axios.put("http://localhost:8085/api/foods/"+ foods.find(u => u.f_id === f_id).f_id || f_id,
       {
        name: name,
        price: price,
        description: description,
       // image:image
       
       });
      
       if(fileChange)
       {
        const formdata = new FormData()
        formdata.append("image", image)
        formdata.append("f_id", f_id)

        axios.post('http://localhost:8085/upload2',formdata, { headers: {'Content-Type': 'multipart/form-data'}})
        .then(res=>{
            if(res.data.Status==="Success"){
                console.log("Succeed")
            }
            else{
                console.log("Failed")
            }
        })
        .catch(err=>console.log(err));
       }
       
        //alert("Food updated successfully");
        Load();
       }
   catch(err)
       {
         alert("Food update Failed "+err);
       }
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
              Menu Details
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
                
              <Grid item xs={12}  minWidth={990}>
                
                <div>
                        <div  >
                            <form>
                                <div class="form-group">
                                <input  type="text" class="form-control" id="student_id" hidden
                                value={f_id}
                                onChange={(event) =>
                                    {
                                    setId(event.target.value);      
                                    }}
                                
                                />
                                    <label>Food Name</label>
                                    <input  type="text" class="form-control" id="name" autoComplete="off" 
                                    value={name}
                                    onChange={(event) =>
                                    {
                                        setName(event.target.value);      
                                    }}
                                    />
                                </div>
                                <div class="form-group">
                                    <label>Description</label>
                                    <input  type="text" class="form-control" id="description" autoComplete="off" 
                                    value={description}
                                    onChange={(event) =>
                                        {
                                        setDescription(event.target.value);      
                                        }}
                                    />
                                </div>

                                <div class="form-group">
                                    <label>Price</label>
                                    <input type="text" class="form-control" id="price" autoComplete="off" 
                                    value={price}
                                    onChange={(event) =>
                                    {
                                        setPrice(event.target.value);      
                                    }}
                                    />
                                </div>
                                <div class="form-group">
                                    <label>Image</label><br/>
                                    <input filename={image} 
                                        onChange={e => {setImage(e.target.files[0]);setFileChange(1)}} 
                                        type="file" 
                                        accept="image/*" />
                                </div>
                                
                                    <div>
                                <button  class="btn btn-success mt-4"  onClick={save}>Add Food Item</button>&emsp;
                                <button   class="btn btn-warning mt-4"  onClick={update}>Update</button>
                                
                                </div>   
                                </form>
                                <br/>
                            </div>
                            <hr/>
                    <table class="table table-light" align="center">
                    <thead>
                        <tr>
                        <th scope="col">     </th>
                        <th scope="col"> Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Price</th>
                        
                        <th scope="col" >Option</th>
                        </tr>
                    </thead>
                        {foods.map(function fn(food)
                        {
                                return(
                                <tbody>
                                    <tr>
                                    <td><img src={'http://localhost:8085/images/'+food.image} height={50} width={70}/></td>
                                    <td>{food.name}</td>
                                    <td>{food.description}</td>
                                    <td>{food.price}</td>        
                                    <td>
                                        <button type="button" class="btn btn-warning"  onClick={() => editFood(food)} >Edit</button>  &emsp;
                                        <button type="button" class="btn btn-danger" onClick={() => DeleteFood(food.f_id)}>Delete</button>
                                    </td>
                                    </tr>
                                </tbody>
                                );
                                })}
                                </table>
                        </div>
              
              </Grid>     
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}