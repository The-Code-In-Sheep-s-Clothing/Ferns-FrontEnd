import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));



export default function Documentation() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        <Tab label="Games Definitions" {...a11yProps(0)} />
        <Tab label="Value Definitions" {...a11yProps(1)} />
        <Tab label="Type Definitions" {...a11yProps(2)} />
        <Tab label="Types" {...a11yProps(3)} />
        <Tab label="Expressions" {...a11yProps(4)} />
        <Tab label="Builtin Functions" {...a11yProps(5)} />
        <Tab label="Default Prelude" {...a11yProps(6)} />
      </Tabs>
      <TabPanel value={value} index={0}>
          <div>
              game ::= game Name typedef∗ board input typedef∗valuedef∗(game definition)
          
            </div>
            <div>
            board ::= type Board = Array (int,int) of ptype (board type)
            </div>
            <div>
            input ::= type Input = type (input type)
            </div>
            <div>
            typedef ::= type Name = type (type definition)
            </div>
            
            <div>
            <br/>
                type Board = Array (n,m) of T
                <br/><br/>
                can be thought of as syntactic sugar for, and is thus equivalent to, the following two definitions:
                <br/><br/>
                type Piece = T
                <br/><br/>
                type Board = Array (n,m) of Piece
                <br/><br/>
                This definition allows us to assign the following type to the built-in function place.
                <br/><br/>
                place : (Piece,Board,Position) -> Board

</div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
      <TabPanel value={value} index={4}>
        Item Five
      </TabPanel>
      <TabPanel value={value} index={5}>
        Item Six
      </TabPanel>
      <TabPanel value={value} index={6}>
        Item Seven
      </TabPanel>
    </div>
  );
}
