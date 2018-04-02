import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, {
    TableBody,
    TableCell,
    TableHead,
    TableFooter,
    TablePagination,
    TableRow,
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import FirstPageIcon from 'material-ui-icons/FirstPage';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';
import LastPageIcon from 'material-ui-icons/LastPage';
import Typography from 'material-ui/Typography';

import EditIcon from 'material-ui-icons/ModeEdit';
import DeleteIcon from 'material-ui-icons/Delete';
import PersonAdd from 'material-ui-icons/PersonAdd';

import AddEmployee from './AddEmployee';

const actionsStyles = theme => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing.unit * 2.5,
    },
});

class TablePaginationActions extends React.Component {
    handleFirstPageButtonClick = event => {
        this.props.onChangePage(event, 0);
    };

    handleBackButtonClick = event => {
        this.props.onChangePage(event, this.props.page - 1);
    };

    handleNextButtonClick = event => {
        this.props.onChangePage(event, this.props.page + 1);
    };

    handleLastPageButtonClick = event => {
        this.props.onChangePage(
            event,
            Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
        );
    };

    render() {
        const { classes, count, page, rowsPerPage, theme } = this.props;

        return (
            <div className={classes.root}>
                <IconButton
                    onClick={this.handleFirstPageButtonClick}
                    disabled={page === 0}
                    aria-label="First Page"
                >
                    {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
                </IconButton>
                <IconButton
                    onClick={this.handleBackButtonClick}
                    disabled={page === 0}
                    aria-label="Previous Page"
                >
                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                </IconButton>
                <IconButton
                    onClick={this.handleNextButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Next Page"
                >
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </IconButton>
                <IconButton
                    onClick={this.handleLastPageButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Last Page"
                >
                    {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
                </IconButton>
            </div>
        );
    }
}

TablePaginationActions.propTypes = {
    classes: PropTypes.object.isRequired,
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    theme: PropTypes.object.isRequired,
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
    TablePaginationActions,
);

let counter = 0;
function createData(name, calories, fat) {
    counter += 1;
    return { id: counter, name, calories, fat };
}

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 500,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    blueicon: {
        color: '#2C9AE5',
    },
});

class ManageEmployee extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            data: [],
            page: 0,
            rowsPerPage: 5,
        };

        this.deleteEmployee = this.deleteEmployee.bind(this);
        this.editEmployee = this.editEmployee.bind(this);
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    componentDidMount() {
        this.callAPIforGetAllEmployees().then(
            res => {
                this.setState({ data: res });
            }
        )
    }

    callAPIforGetAllEmployees = async () => {
        const response = await fetch("/api/employees/");
        const body = await response.json();
        return body;
    }

    addEmployee() {
        window.location.href = '/addemployee';
    }

    deleteEmployee(empid) {

        if (window.confirm("Do you really want to delete Employee " + empid + "?")) {
            this.callAPIforDeleteEmployee(empid).then(
                res => {
                    alert(res.message);
                    window.location.href = '/manageemployee';
                }
            );
        }
    }

    editEmployee(empid) {
        localStorage.setItem("edituser", empid);
        window.location.href = '/editemployee';
    }

    callAPIforDeleteEmployee = async (empid) => {

        const response = await fetch('api/employee/' + empid, {
            method: 'DELETE'
        });

        const body = await response.json();
        return body;
    }

    render() {
        const { classes } = this.props;
        const { data, rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

        return (
            <Paper className={classes.root}>
                <div className={classes.tableWrapper}>
                    <div className={classes.title}>
                        <br />
                        <Typography variant="title">&nbsp;&nbsp;&nbsp;&nbsp;Manage Employee</Typography>
                        <br />
                    </div>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Employee ID</TableCell>
                                <TableCell>Employee Name</TableCell>
                                <TableCell>Joining Date</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Balance EL</TableCell>
                                <TableCell>Balance CL</TableCell>
                                <TableCell>Supervisor ID</TableCell>
                                <TableCell><IconButton className={classes.blueicon} onClick={this.addEmployee.bind(this)}><PersonAdd /></IconButton></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                                return (
                                    <TableRow key={n.id}>
                                        <TableCell>{n.id}</TableCell>
                                        <TableCell>{n.name}</TableCell>
                                        <TableCell>{n.joiningdate}</TableCell>
                                        <TableCell>{n.role}</TableCell>
                                        <TableCell>{n.el}</TableCell>
                                        <TableCell>{n.cl}</TableCell>
                                        <TableCell>{n.supervisorId}</TableCell>
                                        <TableCell><IconButton onClick={this.editEmployee.bind(this, n.id)}><EditIcon /></IconButton></TableCell>
                                        <TableCell><IconButton onClick={this.deleteEmployee.bind(this, n.id)}><DeleteIcon /></IconButton></TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 48 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    colSpan={8}
                                    count={data.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onChangePage={this.handleChangePage}
                                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                    Actions={TablePaginationActionsWrapped}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </Paper>
        );
    }
}

ManageEmployee.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ManageEmployee);