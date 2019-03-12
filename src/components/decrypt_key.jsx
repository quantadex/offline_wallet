import React from 'react';
import { css } from 'emotion';

import { PrivateKey, decryptWallet } from "@quantadex/bitsharesjs";

const container = css`
    .drop-zone {
        width: max-content;
        border: 1px dashed #ccc;
        background: #eee;
    }
    .browse-file {
        line-height: inherit;
        height: auto;
    }

    .error {
        position: absolute;
        bottom: -14px;
        right: 0;
        font-size: 0.9em;
    }
`

export default class DecryptKey extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            encrypted_data: null,
            public_key: null,
            private_key: null
        };

        // this.encryptKey = this.encryptKey.bind(this)
    }

    uploadFile(file) {
        var self = this
        if (!file.name.endsWith(".json")) {
            self.setState({uploaded_file_msg: ".json file only"})
            return
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            var contents = JSON.parse(e.target.result)
            console.log(contents)
            self.setState({encrypted_data: contents, uploaded_file_msg: file.name + " uploaded"})
        };
        reader.readAsText(file);
    }

    handleDrop(e) {
        e.preventDefault();
        var file = e.dataTransfer.files[0]
        this.uploadFile(file)
    }

    decrypt() {
        try {
			const decrypted = decryptWallet(this.state.encrypted_data, this.state.password)
            const private_key = decrypted.toWif()
            const public_key = PrivateKey.fromWif(private_key).toPublicKey().toString()
            
            this.setState({public_key, private_key, password: "", error: false, encrypted_data: null, uploaded_file_msg: null})
		} catch(e) {
			console.log(e)
			this.setState({error: true, errorMsg: "Incorrect Password"})
		}
    }

    render() {
        return (
            <div className={container}>
                <div className="drop-zone d-flex p-4" onDragOver={(e)=> e.preventDefault()} onDrop={(e) => this.handleDrop(e)}>
                    Drop your backup file in this area or&nbsp;<label htmlFor="file" className="browse-file cursor-pointer p-0 m-0 border-0">browse your files.</label>
                    <input className="d-none" type="file" name="file" id="file" accept=".json" onChange={(e) => this.uploadFile(e.target.files[0])}/>
                </div>
                {this.state.uploaded_file_msg ? 
                    <div>{this.state.uploaded_file_msg}</div>
                    : null
                }
                <div className="width-content d-flex mt-3 position-relative">
                    <label>Password</label>
                    <input type="password" name="password" placeholder="Password" className="flex-auto input-with-label"
                        value={this.state.password} onChange={(e) => this.setState({password: e.target.value})}/>
                    <span className="error text-danger" hidden={!this.state.error}>{this.state.errorMsg}</span>
                </div>
                <button className="btn btn-primary mr-2" 
                    disabled={this.state.password.length == 0 || !this.state.encrypted_data}
                    onClick={this.decrypt.bind(this)}>Decrypt</button>

                {this.state.private_key ?
                    <div className="border-top mt-4 pt-4">
                        <b>Public Key:</b> {this.state.public_key}<br/>
                        <b>Private Key:</b> {this.state.private_key}
                    </div>
                    : null
                }
            </div>
        )
    }
}