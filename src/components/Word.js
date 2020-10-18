import React, { Component } from 'react';

export class word extends Component {
    render() {
        return (
            <div>
                <h6>{this.props.word.title}</h6>
            </div>
        )
    }
}

export default word
