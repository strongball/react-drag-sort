import React, { PropsWithChildren, useCallback, useRef } from 'react';
import { DEFAULT_TYPE, DEFAULT_TRANSLATE } from './type';
import { DragContent } from './utils';

export interface Drag {
    type: string | Symbol;
    group: string | Symbol;
    translate: number;
    addItem: (payload: any, index: number) => void;
    removeItem: (payload: any) => void;
    moveItem: (payload: any, targetIndex: number) => void;
}
export const DragContext = React.createContext<Drag>({} as any);

interface Props<T> {
    showEmpty?: boolean;
    type: string | Symbol;
    translate?: number;
    items: T[];
    compareFn?: (itemA: T, itemB: T) => boolean;
    onItemChange: (value: T[]) => void;
}
const DragManager = <T,>(props: PropsWithChildren<Props<T>>) => {
    const { items, onItemChange, showEmpty, compareFn } = props;

    const type = props.type || DEFAULT_TYPE;
    const group = useRef(Symbol());
    const translate = props.translate || DEFAULT_TRANSLATE;

    const addItem = (payload: T, index: number) => {
        const newArr = [...items];
        newArr.splice(index, 0, payload);
        onItemChange(newArr);
    };
    const removeItem = useCallback(
        (payload: T) => {
            const newArr = [...items];
            const index = newArr.findIndex((item) => (compareFn ? compareFn(item, payload) : item === payload));
            if (index > -1) {
                newArr.splice(index, 1);
                onItemChange(newArr);
            }
        },
        [items]
    );
    const moveItem = useCallback(
        (payload: any, targetIndex: number) => {
            const newArr = [...items];
            const oldIndex = newArr.findIndex((item) => (compareFn ? compareFn(item, payload) : item === payload));
            if (oldIndex > -1) {
                newArr.splice(oldIndex, 1);
                newArr.splice(targetIndex, 0, payload);
            }
            onItemChange(newArr);
        },
        [items]
    );

    const handleDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            const draging = DragContent.getItem();
            if (items.length === 0 && draging && draging.group !== group.current) {
                addItem(draging.payload, 0);
                draging.manager.removeItem(draging.payload);
            }
        },
        [items]
    );

    return (
        <DragContext.Provider value={{ type, group: group.current, translate, addItem, removeItem, moveItem }}>
            <>
                {showEmpty && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                        }}
                        onDragOver={handleDrop}
                    ></div>
                )}
                {props.children}
            </>
        </DragContext.Provider>
    );
};

export default DragManager;
