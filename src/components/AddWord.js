import React, { Component } from 'react'
import { Button } from 'react-bootstrap';

export class AddWord extends Component {
    state = {
        title : ''
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.props.addWord(this.state.title);
        this.setState({ title: '' });
    }

    onChange = (e) => this.setState({ title : e.target.value });

    render() {
        return (
            <form onSubmit={this.onSubmit} style={{ display: 'flex' }}>
                <input 
                type="text" 
                name="title" 
                style={{ width: '50%', flex: '10', padding: '5px' }}
                placeholder="Type word..." 
                value={this.state.title}
                onChange={this.onChange}
                />
                <Button variant="success" type="submit">
                    Submit
                </Button>
            </form>
        )
    }
}

export default AddWord
