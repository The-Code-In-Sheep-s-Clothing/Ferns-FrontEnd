import React from 'react';
import logo from './logo.svg';
import Button from '@material-ui/core/Button';
 

class Bar extends React.Component{
    parent = {
        display: 'flex',
        justifyContent: 'space-between',
        paddingLeft: 30,
        paddingRight: 30,

    };

    child = {
        display: 'flex',
        paddingTop: 10
    };
    
    element = {
        padding: 20,
        backgroundColor: '#3f8abf',
        color: 'black',
    }

    render(){
        return (
            <div>
                <div style={this.parent}>
                    <div style={this.child}>
                        <Button variant="contained" color="primary" href="editor">
                            Editor
                        </Button>
                    </div>
                    <div style={this.child}>
                        <Button variant="contained" color="primary" href="documentation">
                            Documentation
                        </Button>
                    </div>
                    <div style={this.child}>
                        <Button variant="contained" color="primary" href="examples">
                            Examples
                        </Button>
                    </div>
                    <div style={this.child}>
                        <Button variant="contained" color="primary" href="contact">
                            Contact
                        </Button>
                    </div>
                </div>
                <hr></hr>
            </div>
        );
    }
}

export default Bar;
