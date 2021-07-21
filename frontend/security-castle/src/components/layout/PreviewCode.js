import React from 'react'
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
            file: props.file
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
        return <SyntaxHighlighter language={"java"} style={docco}>
            {text}
        </SyntaxHighlighter>
    }
}
export default PreviewCode
