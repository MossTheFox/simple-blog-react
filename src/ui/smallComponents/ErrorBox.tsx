import { Alert, AlertTitle, Button } from "@mui/material";

function ErrorBox({ retryFunc,
    title,
    message,
    retryButtonText = '重试'
}: {
    retryFunc?: () => void;
    retryButtonText?: string;
    title?: string;
    message?: string;
}) {

    return <Alert severity="error"
        variant="filled"
        title="TESTAA" action={
            retryFunc ?
                <Button color="inherit" size="small" onClick={retryFunc}>{retryButtonText}</Button> : undefined
        }>
        {title &&
            <AlertTitle>{title}</AlertTitle>
        }
        {message ?? '出错'}
    </Alert>
}

export default ErrorBox;