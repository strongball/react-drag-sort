import React, { useRef, useContext, useEffect, useCallback, PropsWithChildren, useState } from 'react';
import { DragItem } from './type';
import { DragContext } from './DragProvider';
import { DragContent, allowRange } from './utils';
import ContentRef from './ContentRef';

interface DragColProps<E extends HTMLElement> {
    index: number;
    payload: any;
    allowArea?: { width?: number; height?: number };
    dragHandler?: boolean;
    disable?: boolean;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    getElement?: GetElementFN<E>;
}
type GetElementFN<E extends HTMLElement> = (element: E) => E;
export const DragableItem = <E extends HTMLElement>(props: PropsWithChildren<DragColProps<E>>) => {
    const { index, payload, disable, allowArea, onDragStart, onDragEnd, getElement } = props;
    const { type, group, translate, addItem, removeItem, moveItem } = useContext(DragContext);
    const dragHandler = props.dragHandler !== undefined ? props.dragHandler : true;
    const delayMove = useRef(false);
    const [isDragging, setIsDragging] = useState(false);
    const [element, setElement] = useState<HTMLElement>();

    const item: DragItem = { type, index, group, payload, manager: { addItem, removeItem, moveItem } };
    const handleDragStart = (event: DragEvent) => {
        event.stopPropagation();
        DragContent.setItem(item);
        setIsDragging(true);
        onDragStart && onDragStart();
    };
    const handleDragEnd = () => {
        const draging = DragContent.getItem();
        if (group === draging?.group) {
            setIsDragging(false);
        }
        DragContent.removeItem();
        onDragEnd && onDragEnd();
    };

    const handleDragHover = useCallback(
        (event: DragEvent) => {
            const draging = DragContent.getItem();
            if (!draging || draging.type !== item.type) {
                return;
            }
            event.preventDefault();
            if (disable || delayMove.current || !element) {
                return;
            }

            if (draging.payload && draging.payload === item.payload) {
                return;
            }
            if (!allowRange({ x: event.pageX, y: event.pageY }, element.getBoundingClientRect(), allowArea)) {
                return;
            }

            // can move after translate done.
            delayMove.current = true;
            const delayTimeout = setTimeout(() => {
                delayMove.current = false;
            }, translate);

            // move item.
            if (draging.group === item.group) {
                item.manager.moveItem(draging.payload, item.index);
            } else {
                draging.manager.removeItem(draging.payload);
                item.manager.addItem(draging.payload, item.index);
            }
            DragContent.setItem({
                ...draging,
                type,
                index,
                group,
                manager: item.manager,
            });
            return () => {
                clearTimeout(delayTimeout);
                delayMove.current = false;
            };
        },
        [addItem, removeItem, moveItem, element]
    );

    useEffect(() => {
        if (!element) {
            return;
        }
        element.setAttribute('draggable', String(dragHandler && !disable));
        element.ondragstart = handleDragStart;
        element.ondragend = handleDragEnd;
        element.ondragover = handleDragHover;
    }, [index, payload, disable, element, handleDragHover]);
    // 動畫用
    useTransFormAnimation(element, translate, [index]);
    useEffect(() => {
        if (!element) {
            return;
        }
        element.style['userSelect'] = String(!dragHandler);
        element.style['cursor'] = dragHandler ? (isDragging ? 'grabbing' : 'grab') : '';
        const handleTimeout = setTimeout(() => {
            element.style.opacity = isDragging ? '0.5' : '';
        });
        return () => {
            clearTimeout(handleTimeout);
        };
    }, [dragHandler, isDragging, element]);

    return (
        <ContentRef getElement={getElement} onElementChange={setElement}>
            {props.children}
        </ContentRef>
    );
};

function useTransFormAnimation<E extends HTMLElement>(element: E | undefined, translate: number, deps: any[]) {
    const oldPosition = useRef<{ x: number; y: number }>();
    const rect = element?.getBoundingClientRect();
    const newPosition = rect ? { x: rect.x + window.pageXOffset, y: rect.y + window.pageYOffset } : undefined;

    useEffect(() => {
        if (!newPosition) {
            return;
        }
        oldPosition.current = newPosition;
    }, [newPosition?.x, newPosition?.y]);
    useEffect(() => {
        if (!element) {
            return;
        }
        const rect = element.getBoundingClientRect();
        const newPosition = { x: rect.x + window.pageXOffset, y: rect.y + window.pageYOffset };

        if (oldPosition.current) {
            const diffX = oldPosition.current.x - newPosition.x;
            const diffY = oldPosition.current.y - newPosition.y;
            // move to old position
            element.style.transform = `translate(${diffX}px, ${diffY}px)`;
            element.style.transition = 'transform 0s';
            setTimeout(() => {
                // move to new position
                element.style.transition = `transform ${translate}ms`;
                element.style.transform = '';
            }, 0);
            setTimeout(() => {
                element.style.transform = 'none';
                element.style.transition = '';
            }, translate);
        }
    }, deps);
}

export default DragableItem;
