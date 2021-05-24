var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import React, { useCallback, useRef } from 'react';
import { DEFAULT_TYPE, DEFAULT_TRANSLATE } from './type';
import { DragContent } from './utils';
export var DragContext = React.createContext({});
var DragManager = function (props) {
    var items = props.items, onItemChange = props.onItemChange, showEmpty = props.showEmpty, compareFn = props.compareFn;
    var type = props.type || DEFAULT_TYPE;
    var group = useRef(Symbol());
    var translate = props.translate || DEFAULT_TRANSLATE;
    var addItem = function (payload, index) {
        var newArr = __spreadArray([], items);
        newArr.splice(index, 0, payload);
        onItemChange(newArr);
    };
    var removeItem = useCallback(function (payload) {
        var newArr = __spreadArray([], items);
        var index = newArr.findIndex(function (item) { return (compareFn ? compareFn(item, payload) : item === payload); });
        if (index > -1) {
            newArr.splice(index, 1);
            onItemChange(newArr);
        }
    }, [items]);
    var moveItem = useCallback(function (payload, targetIndex) {
        var newArr = __spreadArray([], items);
        var oldIndex = newArr.findIndex(function (item) { return (compareFn ? compareFn(item, payload) : item === payload); });
        if (oldIndex > -1) {
            newArr.splice(oldIndex, 1);
            newArr.splice(targetIndex, 0, payload);
        }
        onItemChange(newArr);
    }, [items]);
    var handleDrop = useCallback(function (event) {
        event.preventDefault();
        var draging = DragContent.getItem();
        if (items.length === 0 && draging && draging.group !== group.current) {
            addItem(draging.payload, 0);
            draging.manager.removeItem(draging.payload);
        }
    }, [items]);
    return (React.createElement(DragContext.Provider, { value: { type: type, group: group.current, translate: translate, addItem: addItem, removeItem: removeItem, moveItem: moveItem } },
        React.createElement(React.Fragment, null,
            showEmpty && (React.createElement("div", { style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                }, onDragOver: handleDrop })),
            props.children)));
};
export default DragManager;
//# sourceMappingURL=DragProvider.js.map