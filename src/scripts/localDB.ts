import { get, set } from "idb-keyval";
import { AUTOSAVE_DB_KEYVAL } from "../constants";

export type MarkdownAutosaveDocument = {
    unixTime: number;
    data: string;
};

/** TODO: 用数据库应有的样子来做增删查 */
export class MarkdownLocalCacheHandler {

    static async getMarkdownAutosavedRecords(): Promise<MarkdownAutosaveDocument[]> {
        let arr = await get(AUTOSAVE_DB_KEYVAL);
        if (!arr) {
            return [];
        }
        let parsed = JSON.parse(arr);
        if (!Array.isArray) {
            await set(AUTOSAVE_DB_KEYVAL, '[]');
            return [];
        }
        const res: MarkdownAutosaveDocument[] = [];
        for (const i of parsed) {
            if (
                (typeof i.unixTime === 'number') &&
                (typeof i.data === 'string')
            ) {
                res.push({
                    unixTime: i.unixTime,
                    data: i.data
                });
            }
        }
        return res;
    }

    static async pushMarkdownCache(data: string, time = new Date()): Promise<void> {
        data = data.trim();
        if (data.length === 0) return;
        let curr = await this.getMarkdownAutosavedRecords();
        if (curr.length > 19) {
            curr = curr.slice(0, 19);
        }
        if (curr.find((v) => v.data === data)) return;
        curr.unshift({
            data: data.trim(),
            unixTime: time.getTime()
        });
        await set(AUTOSAVE_DB_KEYVAL, JSON.stringify(curr));
    }
}

// @ts-ignore
import.meta.env.DEV && (window.__DEBUG_DB = MarkdownLocalCacheHandler);