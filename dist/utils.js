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
export { DragContent };
export function allowRange(cursor, rect, allowArea) {
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
//# sourceMappingURL=utils.js.map