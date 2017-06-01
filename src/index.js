import React from 'react';
import {render} from 'react-dom';

import './style/css/bootstrap.min.css';
import './index.css';

import {sampleText} from './sampleText';
import marked from 'marked';

class App extends React.Component {
    state = {
        text: sampleText
    };

    componentWillMount() {
        const text = localStorage.getItem('text');

        if (text) {
            this.setState({text: text});
        }
    }

    componentWillUpdate(nextProps, nextState) {
        localStorage.setItem('text', nextState.text);
    }

    saveTextAsFile() {
        const textToWrite = this.state.text;
        const textFileAsBlob = new Blob([textToWrite], {type: 'text/plain'});
        const fileNameToSaveAs = "file" + Date.now() + ".md";
        const downloadLink = document.createElement("a");
        downloadLink.download = fileNameToSaveAs;
        downloadLink.innerHTML = "Download File";
        if (window.webkitURL !== null) {
            downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
        }
        else {
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
        }
        downloadLink.click();
    }

    editText = (event) => {
        const text = event.target.value;
        this.setState({text: text});
    };

    renderText = (text) => {
        const renderText = marked(text, {sanitize: true});
        return {__html: renderText};
    };

    render() {
        return (
            <div className="container">
                <h1 className="title">Markdown Realtime viewer</h1>
                <h3 className="title">Made with <a href="https://facebook.github.io/react/">React</a></h3>
                <div className="row">

                    <div className="col-sm-6">
                        <textarea className="form-control" value={this.state.text} rows="30"
                                  onChange={(e) => this.editText(e)}/>
                    </div>

                    <div className="col-sm-6">
                        <div dangerouslySetInnerHTML={this.renderText(this.state.text)}/>
                    </div>
                </div>

                <div className="col-md-6">
                    <button className="form-control" onClick={(e) => this.saveTextAsFile()}>
                        Download your markdown file
                    </button>
                </div>

            </div>
        )
    }
}

render(
    <App/>,
    document.getElementById('root')
);