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

const roles = [
    {
        value: 'admin',
        label: 'Admin',
    },
    {
        value: 'employee',
        label: 'Employee',
    },
];

class AddEmployee extends React.Component {

    constructor(props) {
        super(props);

        this.state = { id: '', name: '', dob: '', joiningdate: '', role: '', department: '', supervisorid: '', cl: '', el: '', email: '' }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {

        var months = {
            jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
            jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12"
        };

        this.callAPIforEditEmployeeDetails().then(res => {

            var joiningday = res.joiningdate.split("/");
            var joiningdate = joiningday[2] + "-" + months[joiningday[1].toLowerCase()] + "-" + joiningday[0];

            var dobday = res.dob.split("/");
            var dob = dobday[2] + "-" + months[dobday[1].toLowerCase()] + "-" + dobday[0];

            this.setState({
                id: res.id,
                name: res.name,
                dob: dob,
                joiningdate: joiningdate,
                role: res.role,
                department: res.department,
                supervisorid: res.supervisorId,
                cl: res.cl,
                el: res.el,
                email: res.email
            })
        });
    }

    callAPIforEditEmployeeDetails = async () => {
        const response = await fetch('api/employee/' + localStorage.getItem("edituser"));
        const body = response.json();
        return body;
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    //handling submit
    handleSubmit(e) {

        e.preventDefault();

        this.callAPIforAddEmployee().then(res => {

            alert(res.message);
            window.location.href = '/manageemployee';

        });
    }

    callAPIforAddEmployee = async () => {

        var formdata = {
            "id": this.state.id,
            "name": this.state.name,
            "dob": this.state.dob,
            "joiningdate": this.state.joiningdate,
            "role": this.state.role,
            "department": this.state.department,
            "supervisorId": this.state.supervisorid,
            "cl": this.state.cl,
            "el": this.state.el,
            "email": this.state.email,
        }

        const response = await fetch("api/employee/" + this.state.id, {
            method: 'PUT', // or 'PUT'
            body: JSON.stringify(formdata), // data can be `string` or {object}!
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });

        var body = await response.json();
        return body;
    }

    render() {
        const { classes } = this.props;
        const mandatoryFieldsFilled = this.state.id !== '' && this.state.name !== '' && this.state.dob !== '' && this.state.joiningdate !== ''
            && this.state.cl !== '' && this.state.el !== '' && this.state.email !== '' && this.state.role !== '' && this.state.supervisorid !== '';
        return (
            <form onSubmit={this.handleSubmit}>
                <Typography variant='title'> Edit Employee Details</Typography>
                <Grid container spacing={24} alignContent="center" className={classes.topMargin}>

                    <Grid item xs={8} sm={4}>
                        <TextField
                            id="id"
                            label="Employee ID*"
                            value={this.state.id}
                            className={classes.textField}
                            onChange={this.handleChange('id')}
                        />
                    </Grid>

                    <Grid item xs={8} sm={4}>
                        <TextField
                            id="name"
                            label="Employee Name*"
                            value={this.state.name}
                            className={classes.textField}
                            onChange={this.handleChange('name')}
                        />
                    </Grid>

                    <Grid item xs={8} sm={4}>
                        <TextField
                            id="select-role"
                            select
                            label="Role*"
                            className={classes.textField}
                            value={this.state.role}
                            onChange={this.handleChange('role')}
                            SelectProps={{
                                MenuProps: {
                                    className: classes.menu,
                                },
                            }}

                        >
                            {roles.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                </Grid>

                <Grid container spacing={24} alignContent="center" className={classes.topMargin}>

                    <Grid item xs={8} sm={4}>
                        <TextField
                            id="dob"
                            label="Date Of Birth*"
                            type="date"
                            value={this.state.dob}
                            onChange={this.handleChange('dob')}
                            className={classes.textField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>

                    <Grid item xs={8} sm={4}>
                        <TextField
                            id="joiningdate"
                            label="Date of Joining*"
                            type="date"
                            value={this.state.joiningdate}
                            onChange={this.handleChange('joiningdate')}
                            className={classes.textField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>

                    <Grid item xs={8} sm={4}>
                        <TextField
                            id="email"
                            label="Employee Email*"
                            type="email"
                            value={this.state.email}
                            className={classes.textField}
                            onChange={this.handleChange('email')}
                        />
                    </Grid>

                </Grid>

                <Grid container spacing={24} alignContent="center" className={classes.topMargin}>

                    <Grid item xs={8} sm={4}>
                        <TextField
                            id="el"
                            type="number"
                            disabled
                            label="Earned Leave*"
                            value={this.state.el}
                            className={classes.textField}
                            onChange={this.handleChange('el')}
                        />
                    </Grid>

                    <Grid item xs={8} sm={4}>
                    </Grid>

                    <Grid item xs={8} sm={4}>
                        <TextField
                            id="cl"
                            type="number"
                            disabled
                            label="Casual Leave*"
                            value={this.state.cl}
                            className={classes.textField}
                            onChange={this.handleChange('cl')}
                        />
                    </Grid>

                </Grid>

                <Grid container spacing={24} alignContent="center" className={classes.topMargin}>

                    <Grid item xs={8} sm={4}>
                        <TextField
                            id="department"
                            label="Department"
                            value={this.state.department}
                            className={classes.textField}
                            onChange={this.handleChange('department')}
                        />
                    </Grid>

                    <Grid item xs={8} sm={4}>
                    </Grid>

                    <Grid item xs={8} sm={4}>
                        <TextField
                            id="supervisorid"
                            label="Supervisor ID*"
                            value={this.state.supervisorid}
                            className={classes.textField}
                            onChange={this.handleChange('supervisorid')}
                        />
                    </Grid>

                </Grid>

                <Grid container spacing={24} alignContent="center" className={classes.topMargin}>

                    <Grid item xs={6} sm={2}>
                    </Grid>

                    <Grid item xs={6} sm={2}>
                    </Grid>

                    <Grid item xs={6} sm={2}>
                        <Button type="submit" disabled={!mandatoryFieldsFilled} variant="raised" color="primary" className={classes.button}>
                            Edit Employee
                        </Button>
                    </Grid>

                    <Grid item xs={6} sm={2}>
                        <Button variant="raised" color="default" className={classes.button} href='/manageemployee'>
                            Cancel
                        </Button>
                    </Grid>

                    <Grid item xs={6} sm={2}>
                    </Grid>

                </Grid>

            </form>
        )
    }
}

export default withStyles(styles)(AddEmployee);
