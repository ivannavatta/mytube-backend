import app from "./server";
import config from './configs/app.config'
const { port } = config

// En Vercel la función usa el app exportado; app.listen solo corre en local.
if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`server running at port: ${port}`);
    })
}

export default app
