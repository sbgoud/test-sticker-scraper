import { Component } from "react";

interface Props {
    fallback?: JSX.Element;
}

export class ErrorBoundary extends Component<Props> {
    state = {
        hasError: false,
    };

    componentDidCatch(error: Error, info: any) {
        this.setState({ hasError: true });
        console.log(error, info);
    }

    render() {
        const { children, fallback = <span>Something went wrong.</span> } = this.props;
        if (this.state.hasError) {
            return fallback;
        }

        return children;
    }
}
