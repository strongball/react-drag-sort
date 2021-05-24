'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var ReactDOM = require('react-dom');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __spreadArray(to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
}

var DEFAULT_TYPE = 'DRAG';
var DEFAULT_TRANSLATE = 500;

var DragContent = /** @class */ (function () {
    function DragContent() {
    }
    DragContent.setItem = function (item) {
        this.item = item;
    };
    DragContent.getItem = function () {
        return this.item;
    };
    DragContent.removeItem = function () {
        this.item = undefined;
    };
    return DragContent;
}());
function allowRange(cursor, rect, allowArea) {
    var thresholdX = (allowArea === null || allowArea === void 0 ? void 0 : allowArea.width) === undefined ? 0.5 : 1 - allowArea.width;
    var thresholdY = (allowArea === null || allowArea === void 0 ? void 0 : allowArea.height) === undefined ? 0.5 : 1 - allowArea.height;
    var paddingWidth = (rect.width * thresholdX) / 2;
    var paddingHeight = (rect.height * thresholdY) / 2;
    var scrollX = window.pageXOffset || 0;
    var scrollY = window.pageYOffset || 0;
    return (cursor.x >= rect.left + paddingWidth + scrollX &&
        cursor.x <= rect.right - paddingWidth + scrollX &&
        cursor.y >= rect.top + paddingHeight + scrollY &&
        cursor.y <= rect.bottom + paddingHeight + scrollY);
}

var DragContext = React__default['default'].createContext({});
var DragManager = function (props) {
    var items = props.items, onItemChange = props.onItemChange, showEmpty = props.showEmpty, compareFn = props.compareFn;
    var type = props.type || DEFAULT_TYPE;
    var group = React.useRef(Symbol());
    var translate = props.translate || DEFAULT_TRANSLATE;
    var addItem = function (payload, index) {
        var newArr = __spreadArray([], items);
        newArr.splice(index, 0, payload);
        onItemChange(newArr);
    };
    var removeItem = React.useCallback(function (payload) {
        var newArr = __spreadArray([], items);
        var index = newArr.findIndex(function (item) { return (compareFn ? compareFn(item, payload) : item === payload); });
        if (index > -1) {
            newArr.splice(index, 1);
            onItemChange(newArr);
        }
    }, [items]);
    var moveItem = React.useCallback(function (payload, targetIndex) {
        var newArr = __spreadArray([], items);
        var oldIndex = newArr.findIndex(function (item) { return (compareFn ? compareFn(item, payload) : item === payload); });
        if (oldIndex > -1) {
            newArr.splice(oldIndex, 1);
            newArr.splice(targetIndex, 0, payload);
        }
        onItemChange(newArr);
    }, [items]);
    var handleDrop = React.useCallback(function (event) {
        event.preventDefault();
        var draging = DragContent.getItem();
        if (items.length === 0 && draging && draging.group !== group.current) {
            addItem(draging.payload, 0);
            draging.manager.removeItem(draging.payload);
        }
    }, [items]);
    return (React__default['default'].createElement(DragContext.Provider, { value: { type: type, group: group.current, translate: translate, addItem: addItem, removeItem: removeItem, moveItem: moveItem } },
        React__default['default'].createElement(React__default['default'].Fragment, null,
            showEmpty && (React__default['default'].createElement("div", { style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                }, onDragOver: handleDrop })),
            props.children)));
};

var ContentRef = /** @class */ (function (_super) {
    __extends(ContentRef, _super);
    function ContentRef(props) {
        return _super.call(this, props) || this;
    }
    ContentRef.prototype.componentDidMount = function () {
        this.updateElement();
    };
    ContentRef.prototype.componentDidUpdate = function () {
        this.updateElement();
    };
    ContentRef.prototype.updateElement = function () {
        var element = ReactDOM__default['default'].findDOMNode(this);
        if (this.props.getElement) {
            element = this.props.getElement(element);
        }
        this.props.onElementChange(element);
    };
    ContentRef.prototype.render = function () {
        return this.props.children;
    };
    return ContentRef;
}(React__default['default'].Component));

var DragableItem = function (props) {
    var index = props.index, payload = props.payload, disable = props.disable, allowArea = props.allowArea, onDragStart = props.onDragStart, onDragEnd = props.onDragEnd, getElement = props.getElement;
    var _a = React.useContext(DragContext), type = _a.type, group = _a.group, translate = _a.translate, addItem = _a.addItem, removeItem = _a.removeItem, moveItem = _a.moveItem;
    var dragHandler = props.dragHandler !== undefined ? props.dragHandler : true;
    var delayMove = React.useRef(false);
    var _b = React.useState(false), isDragging = _b[0], setIsDragging = _b[1];
    var _c = React.useState(), element = _c[0], setElement = _c[1];
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
    var handleDragHover = React.useCallback(function (event) {
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
    React.useEffect(function () {
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
    React.useEffect(function () {
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
    return (React__default['default'].createElement(ContentRef, { getElement: getElement, onElementChange: setElement }, props.children));
};
function useTransFormAnimation(element, translate, deps) {
    var oldPosition = React.useRef();
    var rect = element === null || element === void 0 ? void 0 : element.getBoundingClientRect();
    var newPosition = rect ? { x: rect.x + window.pageXOffset, y: rect.y + window.pageYOffset } : undefined;
    React.useEffect(function () {
        if (!newPosition) {
            return;
        }
        oldPosition.current = newPosition;
    }, [newPosition === null || newPosition === void 0 ? void 0 : newPosition.x, newPosition === null || newPosition === void 0 ? void 0 : newPosition.y]);
    React.useEffect(function () {
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

exports.DragItem = DragableItem;
exports.DragProvider = DragManager;
//# sourceMappingURL=index.js.map
