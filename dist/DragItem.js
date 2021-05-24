var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React, { useRef, useContext, useEffect, useCallback, useState } from 'react';
import { DragContext } from './DragProvider';
import { DragContent, allowRange } from './utils';
import ContentRef from './ContentRef';
export var DragableItem = function (props) {
    var index = props.index, payload = props.payload, disable = props.disable, allowArea = props.allowArea, onDragStart = props.onDragStart, onDragEnd = props.onDragEnd, getElement = props.getElement;
    var _a = useContext(DragContext), type = _a.type, group = _a.group, translate = _a.translate, addItem = _a.addItem, removeItem = _a.removeItem, moveItem = _a.moveItem;
    var dragHandler = props.dragHandler !== undefined ? props.dragHandler : true;
    var delayMove = useRef(false);
    var _b = useState(false), isDragging = _b[0], setIsDragging = _b[1];
    var _c = useState(), element = _c[0], setElement = _c[1];
    var item = { type: type, index: index, group: group, payload: payload, manager: { addItem: addItem, removeItem: removeItem, moveItem: moveItem } };
    var handleDragStart = function (event) {
        event.stopPropagation();
        DragContent.setItem(item);
        setIsDragging(true);
        onDragStart && onDragStart();
    };
    var handleDragEnd = function () {
        var draging = DragContent.getItem();
        if (group === (draging === null || draging === void 0 ? void 0 : draging.group)) {
            setIsDragging(false);
        }
        DragContent.removeItem();
        onDragEnd && onDragEnd();
    };
    var handleDragHover = useCallback(function (event) {
        var draging = DragContent.getItem();
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
        var delayTimeout = setTimeout(function () {
            delayMove.current = false;
        }, translate);
        // move item.
        if (draging.group === item.group) {
            item.manager.moveItem(draging.payload, item.index);
        }
        else {
            draging.manager.removeItem(draging.payload);
            item.manager.addItem(draging.payload, item.index);
        }
        DragContent.setItem(__assign(__assign({}, draging), { type: type,
            index: index,
            group: group, manager: item.manager }));
        return function () {
            clearTimeout(delayTimeout);
            delayMove.current = false;
        };
    }, [addItem, removeItem, moveItem, element]);
    useEffect(function () {
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
    useEffect(function () {
        if (!element) {
            return;
        }
        element.style['userSelect'] = String(!dragHandler);
        element.style['cursor'] = dragHandler ? (isDragging ? 'grabbing' : 'grab') : '';
        var handleTimeout = setTimeout(function () {
            element.style.opacity = isDragging ? '0.5' : '';
        });
        return function () {
            clearTimeout(handleTimeout);
        };
    }, [dragHandler, isDragging, element]);
    return (React.createElement(ContentRef, { getElement: getElement, onElementChange: setElement }, props.children));
};
function useTransFormAnimation(element, translate, deps) {
    var oldPosition = useRef();
    var rect = element === null || element === void 0 ? void 0 : element.getBoundingClientRect();
    var newPosition = rect ? { x: rect.x + window.pageXOffset, y: rect.y + window.pageYOffset } : undefined;
    useEffect(function () {
        if (!newPosition) {
            return;
        }
        oldPosition.current = newPosition;
    }, [newPosition === null || newPosition === void 0 ? void 0 : newPosition.x, newPosition === null || newPosition === void 0 ? void 0 : newPosition.y]);
    useEffect(function () {
        if (!element) {
            return;
        }
        var rect = element.getBoundingClientRect();
        var newPosition = { x: rect.x + window.pageXOffset, y: rect.y + window.pageYOffset };
        if (oldPosition.current) {
            var diffX = oldPosition.current.x - newPosition.x;
            var diffY = oldPosition.current.y - newPosition.y;
            // move to old position
            element.style.transform = "translate(" + diffX + "px, " + diffY + "px)";
            element.style.transition = 'transform 0s';
            setTimeout(function () {
                // move to new position
                element.style.transition = "transform " + translate + "ms";
                element.style.transform = '';
            }, 0);
            setTimeout(function () {
                element.style.transform = 'none';
                element.style.transition = '';
            }, translate);
        }
    }, deps);
}
export default DragableItem;
//# sourceMappingURL=DragItem.js.map