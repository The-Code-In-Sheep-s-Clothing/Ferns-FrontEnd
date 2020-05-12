import React from 'react';
import { ListItem, ListItemText, List, Box, TextField } from '@material-ui/core';
import './App.css';
 

class Terminal extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            terminalText: [],
            command: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({command: event.target.value});
    }

    handleSubmit(event){
        if(this.props.submit){
            this.setState({terminalText: this.state.terminalText.concat([this.props.submit(this.state.command)])});
        }
        this.setState({command: ""});
        event.preventDefault();
    }

    removespacing = {
        margin: 0,
        padding: 0
    }

    render(){

        return (
            <Box>
                <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                    <Box height={400}>
                        <List dense={true}>
                            {this.state.terminalText.map((item, index) => (
                                <ListItem key={index} style={this.removespacing}>
                                    <ListItemText 
                                        style={this.removespacing}
                                        primary={item}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    <TextField label="Command" onChange={this.handleChange} value={this.state.command}></TextField>
                </form>
            </Box>
        );
    }
}

export default Terminal;
