import { get, set } from "idb-keyval";
import { AUTOSAVE_DB_KEYVAL } from "../constants";

export type MarkdownAutosaveDocument = {
    unixTime: number;
    data: string;
};

const AUTOSAVE_LIMIT = 50;

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
        if (curr.length > AUTOSAVE_LIMIT) {
            curr = curr.slice(0, AUTOSAVE_LIMIT);
        }
        // 重复
        if (curr.find((v) => v.data === data)) return;
        // 前缀包含
        let prefixInclude = curr.findIndex((v) => v.data.startsWith(data) && data.length - v.data.length < 25);
        if (prefixInclude === -1) {
            curr.unshift({
                data: data.trim(),
                unixTime: time.getTime()
            });
        } else {
            curr[prefixInclude].data = data;
            curr[prefixInclude].unixTime = Date.now();
            curr.sort((a, b) => b.unixTime - a.unixTime);
        }
        await set(AUTOSAVE_DB_KEYVAL, JSON.stringify(curr));
    }
}

// @ts-ignore
import.meta.env.DEV && (window.__DEBUG_DB = MarkdownLocalCacheHandler);