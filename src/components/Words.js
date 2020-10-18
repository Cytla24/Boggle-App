import React, { Component } from 'react'; 
import Word from './Word';

export class words extends Component {

    render() {
        return this.props.words.map((word) => (
            <div>
                <Word key={word.id} word={word} />
            </div>
        ));
    }
}

export default words
