const API_URL = `https://blog-api-forward.dev.mxowl.com` as const;

const abortController = {
    get signal() {
        let controller = new AbortController();
        setTimeout(() => {
            controller.abort();
        }, 16 * 1000);
        return controller.signal;
    }
};


export async function getServerStatus(signal = abortController.signal) {
    let res = await fetch(`${API_URL}/status`);
    if (!res.ok) {
        throw new Error(res.statusText);
    }
    return 'ok';
}