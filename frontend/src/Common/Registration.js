import * as React from 'react';
import axios from 'axios';
import {useState} from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import './style.css'
  
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function handleImageChange(e) {
        console.log(e.target.files);
        setImage(e.target.files[0]);
        setTempImage(URL.createObjectURL(e.target.files[0]));
        console.log(image);
    }

  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [address, setAddress] = useState("");
  const [pwd, setPwd] = useState("");
  const [cPwd, setCPwd] = useState("");

  const [resName, setResName] = useState("");
  const [resContactNo, setResContactNo] = useState("");
  const [resAddress, setResAddress] = useState("");
  const [resEmail, setResEmail] = useState("");
  const [image, setImage] = useState();
  const [tempImage, setTempImage] = useState();

  const navigate = useNavigate();

  async function saveCustomer(event)
  {
      event.preventDefault();
  try
      {
        if (pwd !== cPwd) {
          alert("Password and confirm password is not matching");
      } 
      else{
        await axios.post("http://localhost:8085/api/customers",
        {
            fName: fName,
            lName: lName,
            contactNo: contactNo,
            address: address
        });
        await axios.post("http://localhost:8085/api/users",
      {      
          username: contactNo,
          pwd: pwd,
          usertype: 'C'
      });
      alert("Customer Registered Successfully");
      navigate('/Login');
      
      }
             
      }
  catch(err)
      {
        alert("Registation Failed"+err);
      }
 }
    
     async function saveRestaurant(event)
    {
        event.preventDefault();
    try
        {
          if (pwd !== cPwd) {
            alert("Password and confirm password is not matching");
        } 
        else{
            await axios.post("http://localhost:8085/api/restaurants",
            {
                resName: resName,
                resContactNo: resContactNo,
                resAddress: resAddress,
                resEmail: resEmail,
                //resFile: image,
            });
            await axios.post("http://localhost:8085/api/users",
          {      
              username: resContactNo,
              pwd: pwd,
              usertype: 'R'
          });
          
          const formdata = new FormData()
          formdata.append("image", image)

          axios.post('http://localhost:8085/uploadRes',formdata)
          .then(res=>{
              if(res.data.Status==="Success"){
                  console.log("Succeed")
              }
              else{
                  console.log("Failed")
              }
          })
          .catch(err=>console.log(err));

          alert("Restaurant Registered Successfully");
          navigate('/Login');
          
        }
                 
        }
    catch(err)
        {
          alert("Registation Failed "+err);
        }
   }
  

  return (
    <div class="reg">
      <Box sx={{ width: '100%'}}>
      <CustomTabPanel value={value} index={0} >
      <div class="container" >
      <Box sx={{ borderBottom: 1, borderColor: 'divider'}} >
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" >
          <Tab label="Customer" {...a11yProps(0)} />
          <Tab label="Restaurant" {...a11yProps(1)} />
        </Tabs>
      </Box> &emsp;
                <div class="title" >Sign Up to Order Food</div>
                <div class="content">
                <form action="#" onSubmit={saveCustomer}>
                    <div class="user-details">
                    <div class="input-box">
                        <span class="details">First Name</span>
                        <input type="text" placeholder="Enter your first name" required onChange={(event) =>
                  {
                    setFName(event.target.value);      
                  }}/>
                    </div>
                    <div class="input-box">
                        <span class="details">Last Name</span>
                        <input type="text" placeholder="Enter your last name" required onChange={(event) =>
                  {setLName(event.target.value);      
                  }}/>
                    </div>
                    <div class="input-box">
                        <span class="details">Mobile Number</span>
                        <input type="text" placeholder="Enter your number" required onChange={(event) =>
                  {
                    setContactNo(event.target.value);      
                  }}/>
                    </div>
                    <div class="input-box">
                        <span class="details">Address</span>
                        <input type="text" placeholder="Enter your address" required onChange={(event) =>
                  {
                    setAddress(event.target.value);      
                  }}/>
                    </div>
                    <div class="input-box">
                        <span class="details">Password</span>
                        <input type="password" placeholder="Enter your password" required onChange={(event) =>
                  {
                    setPwd(event.target.value);      
                  }}/>
                    </div>
                    <div class="input-box">
                        <span class="details">Confirm Password</span>
                        <input type="password" placeholder="Confirm your password" required onChange={(event) =>
                  {
                    setCPwd(event.target.value);      
                  }}/>
                    </div>
                    </div>
                    
                    <div class="button">
                    <input type="submit" value="Sign Up" />
                    </div>
                    <div class="link">
                    <span class="link" >Already have an account?
                      <a href="/Login" > Login</a>
                      </span>
                    </div>
                </form>
                </div>
                </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <div class="container">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }} >
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Customer" {...a11yProps(0)} />
          <Tab label="Restaurant" {...a11yProps(1)} />
        </Tabs>
      </Box> &emsp;
                <div class="title">Sign Up as a Restaurant</div>
                <div class="content">
                <form action="#" onSubmit={saveRestaurant}>
                    <div class="user-details">
                    <div class="input-box">
                        <span class="details">Restaurant Name</span>
                        <input type="text" placeholder="Enter restaurant name" required onChange={(event) =>
                  {
                    setResName(event.target.value);      
                  }}/>
                    </div>
                    <div class="input-box">
                        <span class="details">Address</span>
                        <input type="text" placeholder="Enter your address" required onChange={(event) =>
                  {
                    setResAddress(event.target.value);      
                  }}/>
                    </div>
                    <div class="input-box">
                        <span class="details">Contact Number</span>
                        <input type="text" placeholder="Enter your number" required onChange={(event) =>
                  {
                    setResContactNo(event.target.value);      
                  }}/>
                    </div>
                    <div class="input-box">
                        <span class="details">Email</span>
                        <input type="text" placeholder="Enter your email" required onChange={(event) =>
                  {
                    setResEmail(event.target.value);      
                  }}/>
                    </div>
                    <div class="input-box">
                        <span class="details">Password</span>
                        <input type="password" placeholder="Enter your password" required onChange={(event) =>
                  {
                    setPwd(event.target.value);      
                  }}/>
                    </div>
                    <div class="input-box">
                        <span class="details">Confirm Password</span>
                        <input type="password" placeholder="Confirm your password" required onChange={(event) =>
                  {
                    setCPwd(event.target.value);      
                  }}/>
                    </div>
                    </div>
                    <div class="input-box">
                    <span class="details">Add Image</span> 
                    <input filename={image} 
                                        onChange={handleImageChange} 
                                        type="file" 
                                        accept="image/*" />&emsp;&emsp;&emsp; &emsp; 
                    <img src={tempImage} height={120} width={200}/>
                    </div>
                    
                    <div class="button">
                    <input type="submit" value="Sign Up" />
                    </div>
                    <div class="link">
                      <span class="link" >Already have an account?
                      <a href="/Login" > Login</a>
                      </span>
                    </div>
                </form>
                </div>
                </div>
      </CustomTabPanel>
    
    </Box>
    </div>
    
  );
}