import app from "./server";
import config from './configs/app.config'
const { port } = config

app.listen(port, () => {
    console.log(`server running at port: ${port}`);
    
})