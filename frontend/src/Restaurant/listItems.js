import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import List from '@mui/icons-material/ReceiptLong';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";

export const mainListItems = (
  <React.Fragment>
    <ListItemButton href='/Foods'>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Manage Menu" />
    </ListItemButton>
    <ListItemButton href='/Orders'>
      <ListItemIcon>
        <List />
      </ListItemIcon>
      <ListItemText primary="Orders" />
    </ListItemButton>
    
  </React.Fragment>
);

export const secondaryListItems = (
  
  <React.Fragment>
    <ListSubheader component="div" inset>
       <br/><br/><br/><br/><br/><br/><br/><br/><br/>
    </ListSubheader>
    <ListItemButton href='/Login' >
      <ListItemIcon>
        <LogoutIcon />
      </ListItemIcon>
      <ListItemText primary="Logout" />
    </ListItemButton>
    
  </React.Fragment>
);
