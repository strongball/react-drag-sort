/* eslint-disable react/no-find-dom-node */
import React from 'react';
import ReactDOM from 'react-dom';
type GetElementFN<E extends HTMLElement> = (element: E) => E;
export default class ContentRef<E extends HTMLElement> extends React.Component<
    { getElement?: GetElementFN<E>; onElementChange: (element: E) => void },
    {}
> {
    element?: E;
    constructor(props: any) {
        super(props);
    }
    componentDidMount() {
        this.updateElement();
    }
    componentDidUpdate() {
        this.updateElement();
    }
    updateElement() {
        let element = ReactDOM.findDOMNode(this) as E;
        if (this.props.getElement) {
            element = this.props.getElement(element);
        }
        this.props.onElementChange(element);
    }
    render() {
        return this.props.children;
    }
}
