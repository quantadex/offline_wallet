import React from 'react';
import {render} from 'react-dom';
import { injectGlobal, css } from 'emotion'

import Header from './components/header.jsx'
import GenerateKey from './components/generate_key.jsx'

injectGlobal`
    .cursor-pointer {
        cursor: pointer;
    }
`

const container = css`
    .content {
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
        const tabContent = [<GenerateKey />]
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