// This file is shared across the demos.

import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import InboxIcon from 'material-ui-icons/MoveToInbox';
import DraftsIcon from 'material-ui-icons/Drafts';
import StarIcon from 'material-ui-icons/Star';
import SendIcon from 'material-ui-icons/Send';
import MailIcon from 'material-ui-icons/Mail';
import DashboardIcon from 'material-ui-icons/Dashboard';
import DeleteIcon from 'material-ui-icons/Delete';
import ReportIcon from 'material-ui-icons/Report';
import CreateIcon from 'material-ui-icons/Create';
import VisibilityIcon from 'material-ui-icons/Visibility';
import CloudCircleIcon from 'material-ui-icons/CloudCircle';
import ListIcon from 'material-ui-icons/List';
import ShowChartIcon from 'material-ui-icons/ShowChart';
import PersonIcon from 'material-ui-icons/Person';

import { Link } from 'react-router-dom'

export const mailFolderListItems = (
  <div>
    <Link to='/dashboard'>
      <ListItem button>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
    </Link>

    <Link to='/applyleave'>
      <ListItem button>
        <ListItemIcon>
          <CreateIcon />
        </ListItemIcon>
        <ListItemText primary="Apply Leave" />
      </ListItem>
    </Link>

    <Link to='/reviewleave'>
      <ListItem button>
        <ListItemIcon>
          <VisibilityIcon />
        </ListItemIcon>
        <ListItemText primary="Review Leave" />
      </ListItem>
    </Link>

    <Link to='/manageemployee'>
      <ListItem button>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary="Manage Employee" />
      </ListItem>
    </Link>
  </div>
);

export const otherMailFolderListItems = (
  <div>
  </div>
);
