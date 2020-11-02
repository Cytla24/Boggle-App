import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

import firebase from 'firebase/app';
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectData } from 'react-firebase-hooks/firestore';

export class signin extends Component {

    signInWithGoogle = () => {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider);
    }

    render() {
        return (
            <div>
                <Button variant="Light" onClick={this.signInWithGoogle}>Start!</Button>
            </div>
        )
    }
}

export default signin
