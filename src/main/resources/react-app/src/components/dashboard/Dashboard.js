import React from 'react';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import DashboardIcon from 'material-ui-icons/Dashboard';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

import {
  FilteringState,
  IntegratedFiltering,
  PagingState,
  IntegratedPaging,
} from '@devexpress/dx-react-grid';

import {
  Grid as TableGrid, Table, TableHeaderRow, TableFilterRow, PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';

//icons
import WalletIcon from 'material-ui-icons/AccountBalanceWallet';
import HotelIcon from 'material-ui-icons/LocalHotel';
import DateIcon from 'material-ui-icons/DateRange';
import SupervisorIcon from 'material-ui-icons/SupervisorAccount';

import StatsCard from './StatsCard';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  topMargin:{
    paddingTop: 30,
  },
});

class Dashboard extends React.Component {

  state = {
    empdata:[],
    columns: [
      { name: 'leaveid', title: 'Leave Id' },
      { name: 'startdate', title: 'Start Date' },
      { name: 'enddate', title: 'End Date' },
      { name: 'noofdays', title: 'No of Days' },
      { name: 'leavetype', title: 'Leave Type' },
      { name: 'leavestatus', title: 'Leave Status' }
      ],
      rows: []
  };

  getEmployeeDetails = async() => {
    const response = await fetch('api/employee/RIPL000');
    const body = await response.json();
    if(body==null){ throw Error("No Employee Exists with the requested ID")};
    return body;
  }

  componentDidMount(){
    this.getEmployeeDetails()
    .then(res => {
      localStorage.setItem("user",res.id);
      this.setState({empdata : res, rows : res.employeeLeaves});
    }).catch(err => console.log(err));
  }

render(){
  const {classes} = this.props;
  const {empdata, columns, rows} = this.state;

    return (
      <div className={classes.root}>

      <Grid container spacing={24} alignContent="center" className={classes.topMargin}>

        <Grid item xs={6} sm={3}>
        <StatsCard cardText={this.state.empdata.cl} secondaryText="CL Balance" icon={HotelIcon} cardcolor='creamcancard' iconcolor='creamcanicon'/>
        </Grid>

        <Grid item xs={6} sm={3}>
        <StatsCard cardText={this.state.empdata.el} secondaryText="EL Balance" icon={WalletIcon} cardcolor='deyorkcard' iconcolor='deyorkicon'/>
        </Grid>

        <Grid item xs={6} sm={3}>
        <StatsCard cardText={this.state.empdata.supervisorName} secondaryText="Supervisor" icon={SupervisorIcon} cardcolor='flamingocard' iconcolor='flamingoicon'/>
        </Grid>

        <Grid item xs={6} sm={3}>
        <StatsCard cardText={this.state.empdata.joiningdate} secondaryText="Joining Date" icon={DateIcon} cardcolor='fountainbluecard' iconcolor='fountainblueicon'/>
        </Grid>
      </Grid>

       <Paper>
      <br/>
       <Typography variant="title">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;My Leave Requests</Typography>
       <br/>
        <TableGrid
          rows={rows}
          columns={columns}
        >
          <PagingState
            defaultCurrentPage={0}
            pageSize={10}
          />
          <IntegratedPaging />
          <FilteringState defaultFilters={[]} />
          <IntegratedFiltering />
          <Table />
          <TableHeaderRow />
          <TableFilterRow />
          <PagingPanel />
        </TableGrid>
      </Paper> 
    </div>
    );
  }
}

export default withStyles(styles)(Dashboard);
