import { DragItem } from './type';
export declare class DragContent {
    static item: DragItem | undefined;
    static setItem(item: DragItem): void;
    static getItem(): DragItem | undefined;
    static removeItem(): void;
}
export declare function allowRange(cursor: {
    x: number;
    y: number;
}, rect: DOMRect, allowArea?: {
    width?: number;
    height?: number;
}): boolean;
