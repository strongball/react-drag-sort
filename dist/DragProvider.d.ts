import React, { PropsWithChildren } from 'react';
export interface Drag {
    type: string | Symbol;
    group: string | Symbol;
    translate: number;
    addItem: (payload: any, index: number) => void;
    removeItem: (payload: any) => void;
    moveItem: (payload: any, targetIndex: number) => void;
}
export declare const DragContext: React.Context<Drag>;
interface Props<T> {
    showEmpty?: boolean;
    type: string | Symbol;
    translate?: number;
    items: T[];
    compareFn?: (itemA: T, itemB: T) => boolean;
    onItemChange: (value: T[]) => void;
}
declare const DragManager: <T>(props: React.PropsWithChildren<Props<T>>) => JSX.Element;
export default DragManager;
