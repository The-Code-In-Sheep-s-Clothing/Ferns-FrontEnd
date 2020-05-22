import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { Button, Box, TextField } from '@material-ui/core';
import { highlight, languages } from 'prismjs/components/prism-core';
import Editor from 'react-simple-code-editor';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-haskell';
import 'prismjs/themes/prism-dark.css'

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

const useStyles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
});

class Examples extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      value: 0,
      examples: []
    }

    fetch('/api/examples/')
      .then(response => response.json())
      .then(data => this.setState({examples: data.files}));
  }

  handleChange = (event, newValue) => {
    this.setState({value: newValue});
  };

  render(){
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Tabs
          orientation="vertical"
          value={this.state.value}
          onChange={this.handleChange}
          aria-label="Vertical tabs example"
          className={classes.tabs}
        >
          {this.state.examples.map((item, index) => (
              <Tab key={index} label={item.name} {...a11yProps(index)} />
          ))}
        </Tabs>
        {this.state.examples.map((item, index) => (
          <TabPanel key={index} value={this.state.value} index={index}>
            <Box>
              <Editor
                value={item.code}
                highlight={item => highlight(item, languages.js)}
                padding={0}
                style={{
                  fontFamily: '"Fira code", "Fira Mono", monospace',
                  fontSize: 12,
                }}
              />
              <br></br>
              <Button variant="contained" href={"/editor/" + item.name}>
                Open Example
            </Button>
            </Box>
          </TabPanel>
        ))}
      </div>
    );
  }
}

export default withStyles(useStyles)(Examples);