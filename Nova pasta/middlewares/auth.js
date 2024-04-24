import { promisify } from 'util';
import  jwt  from "jsonwebtoken";
import 'dotenv/config'; 

async function validarToken(req, res, next){

    const header = req.headers.authorization
    
    if (!header) {
        
        return res.json({
            error: true,
            mensagem: "Erro: Necessario realizar login"
        })

    }

    const token = header.split(' ')[1]

    if (!token) {
        
        return res.json({
            error: true,
            mensagem: "Erro: Necessario realizar login"
        })

    }

    try {

        const decod = await promisify(jwt.verify)(token, process.env.SECRET)
        req.userId = decod.id

        return next()

    } catch (error){

        return res.json({
            error:true,
            mensagem:"Erro: token Invalido"
        })
        
    }


}

export default validarToken