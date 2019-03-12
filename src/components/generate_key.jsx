import React from 'react';
import { css } from 'emotion';

import WalletApi from "../api/WalletApi";
import { PrivateKey, encryptWallet } from "@quantadex/bitsharesjs";
import jsPDF from 'jspdf'

const container = css`
    width: 100%;
    margin: auto;

    label {
        width: 100px;
    }

    input {
        flex: auto;
    }

    input:read-only {
        background: #eee;
    }

    .encrypt {
        background: #ddd;
        
        input {
            border-radius: 3px;
        }

        .error {
            bottom: 3px;
            left: 17px;
        }
    }

    .error {
        position: absolute;
        bottom: -14px;
        right: 0;
        font-size: 0.9em;
    }

`

export default class GenerateKey extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            publicKey: "",
            privateKey: "",
            password: "",
            confirm_password: "",
        };

        this.generateKey = this.generateKey.bind(this)
        this.saveToPDF = this.saveToPDF.bind(this)
    }

    generateKey() {
        const key = WalletApi.generate_key()
        this.setState({publicKey: key.publicKey, privateKey: key.privateKey, brainKey: key.brainKey, error: false})
    }

    handleChange(e) {
        this.setState({privateKey: e})
        try {
            var publicKey = PrivateKey.fromWif(e).toPublicKey().toString()
            this.setState({publicKey, error: false})
        } catch(err) {
            this.setState({error: true, errMsg: "Invalid Key", publicKey: ""})
        } 
    }

    download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
    
        element.click();
    
        document.body.removeChild(element);
    }

    validatePassword(pw1) {
        return pw1.length >= 8 && pw1.match(/[A-Z]/) && pw1.match(/[0-9]/)
    }

    encrypt() {
        if (this.state.password !== this.state.confirm_password) {
            this.setState({PwError: true, PwErrMsg: "Your password inputs are not the same"})
            return
        } 
        
        if (!this.validatePassword(this.state.password)) {
            this.setState({PwError: true, PwErrMsg: "Password must contains at least 8 characters, 1 uppercase, and 1 number."})
            return
        }

        const key = PrivateKey.fromWif(this.state.privateKey)
        const encryption = encryptWallet(key, this.state.password)
        const text= JSON.stringify(encryption)
        this.download("quanta_wallet.json", text)
        this.setState({downloaded: true, PwError: false, password: "", confirm_password: ""})
    }

    saveToPDF() {
        var doc = new jsPDF()
		const words = this.state.brainKey.split(" ");
		const mid = words.length / 2;
		const first = words.slice(0, mid);
		const second = words.slice(mid, words.length);

		doc.setFontSize(16)
		// doc.addImage(window.logoData, 'JPEG', 70, 10)
		doc.text('WALLET INFORMATION', 75, 40)
		var tm = 40
		doc.rect(10, tm+40, 190, 75)
		doc.setFontSize(18)
		doc.text('Your QUANTA private key\nKeep it safe, keep it secure.', 20, tm +50)
		doc.setFontSize(16)
		doc.text('Do not share it with anyone, not even the QUANTA foundation.\nWe will never ask you for your private key.', 20, tm +70)
		doc.setFontSize(12)
		doc.setTextColor("#FF0000")
		doc.text("BRAIN KEY:", 20, tm+85)
		doc.text(first.join(" ").toUpperCase(), 20, tm + 90)
		doc.text(second.join(" ").toUpperCase(), 20, tm + 95)

		doc.text("WIF KEY:", 20, tm + 105)
		doc.text(this.state.privateKey, 20, tm + 110)

		doc.setTextColor("#000000")
		doc.rect(10, tm +120, 190, 40)
		doc.setFontSize(18)
		doc.text('Your QUANTA public key\nYou may share this key with other parties.', 20, tm +130)
		doc.setFontSize(12)
		doc.setTextColor("#1dc4bf")
		doc.text(this.state.publicKey, 20, tm +150)
		doc.save('quanta_wallet.pdf')

		this.setState({ downloaded : true })

	}

    render() {
        return (
            <div className={container}>
                <button className="btn btn-primary mr-2" onClick={this.generateKey}>Generate</button>
                <span className="text-muted">or enter your own private key for encryption</span>
                <div className="d-flex mt-3">
                    <label>Public</label>
                    <input type="text" className="input-with-label" readOnly spellCheck="false" value={this.state.publicKey} />
                </div>
                <div className="d-flex mt-3 position-relative">
                    <label>Private</label>
                    <input type="text" spellCheck="false" className="input-with-label"
                        placeholder="Private Key"
                        onChange={(e) => this.handleChange(e.target.value)} value={this.state.privateKey} />
                    {this.state.error ? <span className="error text-danger">{this.state.errMsg}</span> : null}
                </div>

                <button className="btn btn-primary mr-2" 
                    disabled={this.state.error || this.state.privateKey.length == 0}
                    onClick={this.saveToPDF.bind(this)}>Download PDF</button>

                <div className="encrypt d-flex flex-column flex-sm-row my-3 px-3 py-4 position-relative">
                    <input className="mr-sm-3 mb-3 mb-sm-0" type="password" placeholder="Password" onChange={(e) => this.setState({password: e.target.value})} value={this.state.password} />
                    <input className="mr-sm-3 mb-3 mb-sm-0" type="password" placeholder="Confirm Password" onChange={(e) => this.setState({confirm_password: e.target.value})} value={this.state.confirm_password} />
                    
                    <button className="btn btn-primary" 
                        disabled={this.state.error || this.state.privateKey.length == 0 || this.state.password.length == 0 || this.state.confirm_password.length == 0}
                        onClick={() => this.encrypt()}>Encrypt & Download</button>
                    {this.state.PwError ? <span className="error text-danger">{this.state.PwErrMsg}</span> : null}
                </div>
                
            </div>
        )
    }
}