import React from 'react';
import {render} from 'react-dom';
import { injectGlobal, css } from 'emotion'

import Header from './components/header.jsx'
import GenerateKey from './components/generate_key.jsx'
import DecryptKey from './components/decrypt_key.jsx'

injectGlobal`
    .cursor-pointer {
        cursor: pointer;
    }

    label, input {
        height: 40px;
        line-height: 40px;
        padding: 0 15px;
    }

    label {
        text-align: center;
        font-weight: bold;
        border: 1px solid #ccc;
        border-right: 0;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
    }

    input {
        border: 1px solid #ccc;
        border-radius: 3px;
    }
    input:focus {
        outline: 0;

    }
    .input-with-label {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
    
    .width-content {
        width: max-content;
    }
`

const container = css`
    .content {
        width: 100%;
        max-width: 1000px;
        padding: 20px;
    }
`

class Container extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 0,
        };
    }

    changeTab(i) {
        this.setState({selectedTab: i})
    }

    render () {
        const tabContent = [<GenerateKey />, <DecryptKey />]
        return (
            <div className={container}>
                <Header selected={this.state.selectedTab} changeTab={this.changeTab.bind(this)} />
                <div className="content">
                    {tabContent[this.state.selectedTab]}
                </div>
            </div>
        )
    }
}

render(<Container/>, document.getElementById('app'));