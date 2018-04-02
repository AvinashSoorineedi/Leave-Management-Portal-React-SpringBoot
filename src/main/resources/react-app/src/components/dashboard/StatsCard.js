import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

const styles = {
  
  card: {
    borderLeft: 'solid 4px #31708f', flex: '1', marginRight: '1em',
  },
  creamcancard: {
    borderLeft: 'solid 4px #F2BA50', flex: '1', marginRight: '1em',
  },
  deyorkcard: {
    borderLeft: 'solid 4px #7CC19B', flex: '1', marginRight: '1em',
  },
  flamingocard: {
    borderLeft: 'solid 4px #E95E33', flex: '1', marginRight: '1em',
  },
  fountainbluecard: {
    borderLeft: 'solid 4px #6BB3C7', flex: '1', marginRight: '1em',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 12,
  },
  icon: { float: 'right', width: 85, height: 85, padding: 5, paddingBottom: 35 , color: '#31708f' },
  creamcanicon: { float: 'right', width: 95, height: 95, padding: 0, paddingBottom: 55 , color: '#F2BA50' },
  deyorkicon: { float: 'right', width: 95, height: 95, padding: 0, paddingBottom: 55 , color: '#7CC19B' },
  flamingoicon: { float: 'right', width: 95, height: 95, padding: 0, paddingBottom: 55 , color: '#E95E33' },
  fountainblueicon: { float: 'right', width: 95, height: 95, padding: 0, paddingBottom: 55 , color: '#6BB3C7' },
  
};

function StatsCard(props) {
  const { classes } = props;

  return (

    <div>
      <Card className={classes[props.cardcolor]}>
        <CardContent>
        <props.icon className={classes[props.iconcolor]} />
        <Typography variant="text">
          {props.cardText}
        </Typography>
          <Typography className={classes.title} color="textSecondary">
            {props.secondaryText}
          </Typography>

        </CardContent>
      </Card>
    </div>
  );
}

StatsCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StatsCard);
