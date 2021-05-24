export declare const DEFAULT_TYPE = "DRAG";
export declare const DEFAULT_GROUP = "GROUP";
export declare const DEFAULT_TRANSLATE = 500;
export interface DragItem {
    index: number;
    type: string | Symbol;
    group?: string | Symbol;
    payload: any;
    manager: {
        addItem: (payload: any, index: number) => void;
        removeItem: (payload: any) => void;
        moveItem: (payload: any, targetIndex: number) => void;
    };
}
export declare type DataGroups<T> = {
    [key: string]: T[];
};
