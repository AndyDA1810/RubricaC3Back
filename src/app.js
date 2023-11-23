import  express  from "express";
import Productos from "./routes/productos.routes.js"
import Ventas from "./routes/ventas.routes.js"
import Index from "./routes/index.routes.js"
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use('/api', Productos);
app.use('/api', Ventas);
app.use('/api', Index);

app.use((req,res,next)=>{
    res.status(404).json({
        message:'Endoint not found'
    })
})

app.get('/',(req,res)=>{
    res.send("default route")
})

export default app