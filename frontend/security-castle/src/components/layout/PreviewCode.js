import React from 'react'
import "../../css/codeviewer.css"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

class PreviewCode extends React.Component {
    state = {
        isLoaded: false,
        notFound: false,
        file: "",
        text: ""
    }

    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            notFound: false,
            check_flag: true,
            file: props.file,
            text: "",
            checked: [],
        }

        if(!props.check_flag)
        {
            this.state.check_flag = false;
        }
    }

    countLines(){
        let checkboxes = [];
        let lineCount = (this.state.text.match(/\n/g) || []).length + 1;
        for (let i = 1; i < lineCount+1; i++) {
            checkboxes.push(
                <div className={"checkbox"}>
                    <label>{i}</label>
                    <input
                        className={"checkbox"}
                        type={"checkbox"} name={i}
                        onChange={e => this.handleChange(e)}
                    />
                </div>
                )
        }
        if(this.state.check_flag)
        {
            return checkboxes;
        }
        return [];
    }

    handleChange(e)
    {
        let lineNum = e.target.name;
        let checked = e.target.checked;
        if(checked)
        {
            this.state.checked.push(lineNum)
        }
        if(!checked)
        {
            this.state.checked.splice(this.state.checked.indexOf(lineNum), 1)
        }
        if(this.props.onChange)
        {
            this.props.onChange(this.state.checked)
        }

    }

    componentDidMount() {
        if(this.props.file instanceof File)
        {
            this.props.file.text().then(text => {
                this.setState({
                    isLoaded: true,
                    text: text,
                    file: this.props.file
                })
            })

        }
        else
        {
            let url = `http://localhost:8000/${this.props.file.filePath}`
            fetch(url)
                .then(res => {
                    if (res.ok) {
                        return res.text();
                    }
                    else if(res.status === 404) {
                        this.setState({
                            notFound: true
                        })
                    }
                    else {
                        throw Error(res.statusText)
                    }
                })
                .then(text => {
                    this.setState({
                        text: text,
                        isLoaded: true
                    })
                })
        }
    }


    componentDidUpdate(prevProps, prevState) {

        if(prevProps.file !== this.props.file)
        {
            if(this.props.file instanceof File)
            {
                this.props.file.text().then(text => {
                    this.setState({
                        isLoaded: true,
                        text: text,
                        file: this.props.file
                    })
                })

            }
            else
            {
                let url = `http://localhost:8000/${this.props.file.filePath}`
                fetch(url)
                    .then(res => {
                        if (res.ok) {
                            return res.text();
                        }
                        else if(res.status === 404) {
                            this.setState({
                                notFound: true
                            })
                        }
                        else {
                            throw Error(res.statusText)
                        }
                    })
                    .then(text => {
                        this.setState({
                            text: text,
                            isLoaded: true
                        })
                    })
            }

        }
    }

    render() {
        const {isLoaded, notFound , text } = this.state
        if(notFound)
        {
            return <div>File not found</div>
        }
        if(!isLoaded)
        {
            return <div>Loading</div>
        }
        return <div className={"code-block"}>
            <div>
                {
                    this.countLines()
                }
            </div>
            <div>
                <SyntaxHighlighter language={"java"} style={docco} showLineNumbers={true}>
                    {text}
                </SyntaxHighlighter>
            </div>
        </div>
    }
}
export default PreviewCode
