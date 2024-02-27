import axios from 'axios';
import React,{useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles} from '@mui/styles';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import './login.css'

const useStyles = makeStyles({
  select: {
      '&:before': {
          borderColor: '#388e3c',
      },
      '&:after': {
          borderColor: '#388e3c',
      },
      '&:not(.Mui-disabled):hover::before': {
          borderColor: '#388e3c',
      },
  },
  icon: {
      fill: '#388e3c',
  },
  root: {
      color: '#388e3c',
  },
})

function Login()
{
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usertype, setUsertype] = useState("");
  const navigate = useNavigate();

  async function login(event)
  {
      event.preventDefault();
  try
      {
       axios.post("http://localhost:8085/api/login",
      {
        
        username: username,
        password: password,
        usertype: usertype
      
      }).then((response)=>{
        if(response.data.status){
          
          sessionStorage.setItem('uname',username);
          
          if(usertype=='C')
          {
            navigate('/Dashboard');
            
          }
          else if(usertype=='R')
          {
            navigate('/Foods');
          }
        }
        else{
          alert(response.data.message);
        }
      }); 

      
      }
  catch(err)
      {
        alert(err);
      }
 }
 
 const classes = useStyles()
  return (
    <div class="log">
        <div class="container">
    <input type="checkbox" id="check"/>
    <div class="login form">
      <img  src='http://localhost:8085/images/DineEaseLogo.png' class="center"  />
      <header>Login</header>
      <form action="#" onSubmit={login}>
        <input type="text" placeholder="Enter your mobile no" required onChange={(event) =>
                  {
                    setUsername(event.target.value);      
                  }}/>
        <input type="password" placeholder="Enter your password" required onChange={(event) =>
                  {
                    setPassword(event.target.value);      
                  }}/>
        <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">User Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            className={classes.select}
            inputProps={{
              classes: {
                  icon: classes.icon,
                  root: classes.root,
              },
          }}
            value={usertype}
            label="Usertype"
            required
            onChange={(event) => {
              setUsertype(event.target.value);
            }}
            
          >
            <MenuItem value={'C'}>Customer</MenuItem>
            <MenuItem value={'R'}>Restaurant</MenuItem>
          </Select>
        </FormControl>
      </Box>

        
        <input type="submit" class="button" value="Login" />
      </form>
      <div class="signup">
        <span class="signup">Don't have an account?
        <a href="/Registration" > Sign Up</a>
        </span>
      </div>
    </div>
    
  </div>
       </div>
            );
        }
 
export default Login;