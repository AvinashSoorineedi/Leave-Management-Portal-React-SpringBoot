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

import ApproveIcon from 'material-ui-icons/Done';
import RejectIcon from 'material-ui-icons/Clear';

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
    greenicon: {
        color: 'green',
    },
    redicon: {
        color: 'red',
    },
});

class ReviewLeave extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            data: [],
            page: 0,
            rowsPerPage: 5,
        };

        this.approveLeave = this.approveLeave.bind(this);
        this.rejectLeave = this.rejectLeave.bind(this);
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    componentDidMount() {
        this.getPendingLeaves().then(
            res => {
                this.setState({ data: res });
            }
        )
    }

    getPendingLeaves = async () => {
        const response = await fetch("/api/reviewleaves/" + localStorage.getItem("user"))
        const body = await response.json();
        return body;
    }

    approveLeave(levid, requesterid) {

        this.callAPIforApproveLeave(levid,requesterid).then(res => {
            alert(res.message);
            window.location.href = '/reviewleave';
        });
    }

    callAPIforApproveLeave = async (levid, requesterid) => {
        alert(levid+requesterid);
        const response = await fetch('api/approveleave/' + levid + '/' + requesterid);
        var body = await response.json();
        return body;
    }

    rejectLeave(levid, requesterid) {
        this.callAPIforRejectLeave(levid,requesterid).then(
            res => {
                alert(res.message);
                window.location.href = '/reviewleave';
            }
        );
    }

    callAPIforRejectLeave = async (levid, requesterid) => {
        const response = await fetch('api/rejectleave/' + levid + '/' + requesterid);
        const body = response.json();
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
                        <Typography variant="title">&nbsp;&nbsp;&nbsp;&nbsp;Leave Requests</Typography>
                        <br />
                    </div>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Leave ID</TableCell>
                                <TableCell >Employee Name</TableCell>
                                <TableCell >Start Date</TableCell>
                                <TableCell >End Date</TableCell>
                                <TableCell >Days</TableCell>
                                <TableCell >Type</TableCell>
                                <TableCell ></TableCell>
                                <TableCell ></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                                return (
                                    <TableRow key={n.id}>
                                        <TableCell>{n.id}</TableCell>
                                        <TableCell>{n.requestername}</TableCell>
                                        <TableCell>{n.fromdate}</TableCell>
                                        <TableCell>{n.todate}</TableCell>
                                        <TableCell>{n.noofdays}</TableCell>
                                        <TableCell>{n.type}</TableCell>
                                        <TableCell><IconButton onClick={this.approveLeave.bind(this, n.id, n.requesterid)}><ApproveIcon className={classes.greenicon} /></IconButton></TableCell>
                                        <TableCell><IconButton onClick={this.rejectLeave.bind(this, n.id, n.requesterid)}><RejectIcon className={classes.redicon} /></IconButton></TableCell>
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

ReviewLeave.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReviewLeave);