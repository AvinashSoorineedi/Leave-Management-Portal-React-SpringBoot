import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';
import MenuItem from 'material-ui/Menu/MenuItem';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  root: {
    flexGrow: 1,
  },
  topMargin: {
    paddingTop: 30,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

const leavetypes = [
  {
    value: 'Earned',
    label: 'Earned',
  },
  {
    value: 'Casual',
    label: 'Casual',
  },
];

class ApplyLeave extends React.Component {

  constructor(props) {
    super(props);

    this.state = { fromdate: '', todate: '', daysdiff: '', leavetype: '', reason: '', empid: '' }

    this.updateFromDate = this.updateFromDate.bind(this);
    this.updateToDate = this.updateToDate.bind(this);
    this.findDateDiff = this.findDateDiff.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({ empid: localStorage.getItem("user") });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };


  //calculating the Date Difference
  findDateDiff() {
    var to = new Date(this.state.todate);
    var from = new Date(this.state.fromdate);

    if ((((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1) > 0) {
      var datediff = Math.round(Math.abs((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))) + 1;
      this.setState({ daysdiff: datediff });
    } else {
      this.setState({ daysdiff: '' });
    }
  }

  //updating the from date
  updateFromDate(event) {
    this.setState({ fromdate: event.target.value }, () => this.findDateDiff());
  }

  //updating the to date
  updateToDate(event) {
    this.setState({ todate: event.target.value }, () => this.findDateDiff());
  }

  //handling submit
  handleSubmit(e) {

    e.preventDefault();

    this.callAPIforApplyLeave().then(res => {

      if (res.status === "SUCCESS") {
        alert(res.message);
        window.location.href = '/dashboard';
      } else {
        alert(res.message);
        window.location.href = '/applyleave';
      }
    });
  }

  callAPIforApplyLeave = async () => {

    var formdata = {
      "fromdate": this.state.fromdate,
      "todate": this.state.todate,
      "noofdays": this.state.datediff,
      "type": this.state.leavetype,
      "reason": this.state.reason
    }

    const response = await fetch("api/applyleave/" + this.state.empid, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(formdata), // data can be `string` or {object}!
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });

    var body = await response.json();
    console.log("returning response");
    return body;
  }

  render() {
    const { classes } = this.props;
    const mandatoryFieldsFilled = this.state.fromdate!='' && this.state.todate!='' && this.state.daysdiff!='' && this.state.type!='' && this.state.reason!=''; 
    return (
      <form onSubmit={this.handleSubmit}>
      <Typography variant='title'>Leave Form</Typography>
        <Grid container spacing={24} alignContent="center" className={classes.topMargin}>

          <Grid item xs={8} sm={4}>
            <TextField
              id="fromdate"
              label="From*"
              type="date"
              value={this.state.fromdate}
              onChange={this.updateFromDate}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={8} sm={4}>
            <TextField
              id="todate"
              label="To*"
              type="date"
              value={this.state.todate}
              onChange={this.updateToDate}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={8} sm={4}>
            <TextField
              id="noofdays"
              label="No.of Days"
              className={classes.textField}
              value={this.state.daysdiff}
              disabled
            />
          </Grid>

        </Grid>

        <Grid container spacing={24} alignContent="center" className={classes.topMargin}>
          <Grid item xs={8} sm={4}>
            <TextField
              id="select-leavetype"
              select
              label="Leave Type*"
              className={classes.textField}
              value={this.state.leavetype}
              onChange={this.handleChange('leavetype')}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              margin="normal"
            >
              {leavetypes.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={8} sm={4}>
          </Grid>

          <Grid item xs={8} sm={4}>
            <TextField
              id="textarea"
              label="Reason*"
              multiline
              value={this.state.reason}
              onChange={this.handleChange('reason')}
              className={classes.textField}
              margin="normal"
            />
          </Grid>
        </Grid>

        <Grid container spacing={24} alignContent="center" className={classes.topMargin}>

          <Grid item xs={8} sm={4}>
          </Grid>

          <Grid item xs={8} sm={4}>
            <Button type="submit" disabled={!mandatoryFieldsFilled} variant="raised" color="primary" className={classes.button}>
              Apply Leave
            </Button>
          </Grid>

          <Grid item xs={8} sm={4}>
          </Grid>

        </Grid>

      </form>
    )
  }
}

export default withStyles(styles)(ApplyLeave);
