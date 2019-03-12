import React from 'react';
import { css } from 'emotion';

const container = css`
    .header-item {
        border-bottom: 2px solid transparent;
    }

    .header-item:hover {
        background: #eee;
    }

    .header-item.selected {
        border-bottom: 2px solid #555;
    }
`

export default class Header extends React.Component {
    render() {
        const tabs = ["Generate Key", "Encrypt Wallet"]
        return (
            <div className={container + " border-bottom d-flex"}>
                {tabs.map((tab, index) => {
                    return (
                        <div key={index} 
                        className={"header-item cursor-pointer border-right px-5 py-2" + (this.props.selected == index ? " selected" : "")}
                        onClick={() => this.props.changeTab(index)}>
                            {tab}
                        </div>
                    )
                })}
            </div>
        )
    }
}