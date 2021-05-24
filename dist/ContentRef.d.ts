import React from 'react';
declare type GetElementFN<E extends HTMLElement> = (element: E) => E;
export default class ContentRef<E extends HTMLElement> extends React.Component<{
    getElement?: GetElementFN<E>;
    onElementChange: (element: E) => void;
}, {}> {
    element?: E;
    constructor(props: any);
    componentDidMount(): void;
    componentDidUpdate(): void;
    updateElement(): void;
    render(): React.ReactNode;
}
export {};
