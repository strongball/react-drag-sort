import React, { PropsWithChildren } from 'react';
interface DragColProps<E extends HTMLElement> {
    index: number;
    payload: any;
    allowArea?: {
        width?: number;
        height?: number;
    };
    dragHandler?: boolean;
    disable?: boolean;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    getElement?: GetElementFN<E>;
}
declare type GetElementFN<E extends HTMLElement> = (element: E) => E;
export declare const DragableItem: <E extends HTMLElement>(props: React.PropsWithChildren<DragColProps<E>>) => JSX.Element;
export default DragableItem;
