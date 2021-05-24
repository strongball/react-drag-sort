import { DragItem } from './type';
export class DragContent {
    static item: DragItem | undefined;
    static setItem(item: DragItem) {
        this.item = item;
    }
    static getItem(): DragItem | undefined {
        return this.item;
    }
    static removeItem() {
        this.item = undefined;
    }
}
export function allowRange(
    cursor: { x: number; y: number },
    rect: DOMRect,
    allowArea?: { width?: number; height?: number }
): boolean {
    const thresholdX = allowArea?.width === undefined ? 0.5 : 1 - allowArea.width;
    const thresholdY = allowArea?.height === undefined ? 0.5 : 1 - allowArea.height;
    const paddingWidth = (rect.width * thresholdX) / 2;
    const paddingHeight = (rect.height * thresholdY) / 2;
    const scrollX = window.pageXOffset || 0;
    const scrollY = window.pageYOffset || 0;
    return (
        cursor.x >= rect.left + paddingWidth + scrollX &&
        cursor.x <= rect.right - paddingWidth + scrollX &&
        cursor.y >= rect.top + paddingHeight + scrollY &&
        cursor.y <= rect.bottom + paddingHeight + scrollY
    );
}
