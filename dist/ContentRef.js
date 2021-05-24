var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/* eslint-disable react/no-find-dom-node */
import React from 'react';
import ReactDOM from 'react-dom';
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
        var element = ReactDOM.findDOMNode(this);
        if (this.props.getElement) {
            element = this.props.getElement(element);
        }
        this.props.onElementChange(element);
    };
    ContentRef.prototype.render = function () {
        return this.props.children;
    };
    return ContentRef;
}(React.Component));
export default ContentRef;
//# sourceMappingURL=ContentRef.js.map