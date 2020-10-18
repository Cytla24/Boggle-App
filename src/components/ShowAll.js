import React, { Component } from 'react';
import ShoWord from './ShoWord';

export class ShowAll extends Component {
    render() {
        return this.props.rWords.map((rWord) => (
            <div>
                <ShoWord word={rWord} />
            </div>
        ));
    }
}

export default ShowAll
