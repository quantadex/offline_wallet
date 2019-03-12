import React from 'react';
import { css } from 'emotion';

import WalletApi from "../api/WalletApi";

const container = css`

`

export default class EncryptKey extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };

        // this.encryptKey = this.encryptKey.bind(this)
    }

    encryptKey() {
        console.log(1)
    }

    render() {
        return (
            <div className={container}>
            </div>
        )
    }
}