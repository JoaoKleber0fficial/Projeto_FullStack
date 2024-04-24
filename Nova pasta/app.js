import express from "express";
import User from "./models/User.js";
import bcrypt from 'bcrypt';
import validarToken from "./middlewares/auth.js";
import  jwt  from "jsonwebtoken";
import'dotenv/config';
import cors from "cors";

const app = express()

app.use((req, res, next) => {

    /* qualquer rota pode ter acesso no momento, mas quando fizermos o deploy iremos expecificar as rotas que poderão ter acesso */
    res.header("Access-Control-Allow-Origin", "*")

    /* Definindo metodos de acesso */
    res.header("Access-Control-Allow-Methods", "GET", "POST", "PUT", "DELETE")

    /* Permitindo acesso aos conteudos */
    res.header("Access-Control-Expose-Headers", "X-PINGOTHER, Content-Type, Authorization")

    app.use(cors())
    next()

})


app.use(express.json())

//Pegando nome e email do usuario que será passado por tela de login
app.get('/users', validarToken, async(req, res) => {
    
    await User.findAll()
    .then((users)=> {
        return res.json({

            error:false,
            mensagem: "todos os Usuarios cadastrado encontrados com sucesso",
            users
        })
    }).catch(()=>{

        return res.json({

            error:true,
            mensagem: "Ocorreu um erro ao procurar os Usuario"

        })

    })

})

//pegando um usuario especifico partir do ID
app.get('/user/:id', validarToken, async(req, res) => {
    
    const {id} = req.params
    await User.findOne({where: {id : id}})
    .then((users)=> {
        return res.json({

            error:false,
            mensagem: "Usuario encontrado com sucesso!",
            users

        })
    }).catch(()=>{

        return res.json({

            error:true,
            mensagem: "Ocorreu um erro ao procurar o seu Usuario"

        })

    })

})

//Cadastrar o usuario
app.post('/user', validarToken, async (req, res) => {

    var dados = req.body

    dados.password = await bcrypt.hash(dados.password, 8)

    await User.create(dados)
    .then(()=> {

        return res.json({

            error:false,
            mensagem: "Usuario foi cadastrado com sucesso!"
        })

    }).catch(()=>{

        return res.json({

            error:true,
            mensagem: "Ocorreu um erro ao cadastrar o seu Usuario"

        })

    })

})


//alterar senha do usuario cadastrado
app.put('/user-senha/:id', validarToken, async(req, res) => {
    
    const {id} = req.params
    var dados = req.body
    dados.password = await bcrypt.hash(dados.password,8)

    await User.update({password : dados.password},{where: {id : id}})
    .then(()=> {

        return res.json({

            error:false,
            mensagem: "Usuario atualizado com sucesso!",

        })

    }).catch(()=>{

        return res.json({

            error:true,
            mensagem: "Ocorreu um erro ao atualizar o seu Usuario"

        })

    })

})

//Alterar o usuario
app.put('/user/:id', validarToken, async(req, res) => {
    
    const {id} = req.params
    await User.update(req.body,{where: {id : id}})
    .then(()=> {

        return res.json({

            error:false,
            mensagem: "Usuario atualizado com sucesso!",

        })

    }).catch(()=>{

        return res.json({

            error:true,
            mensagem: "Ocorreu um erro ao atualizar o seu Usuario"

        })

    })

})

//Delete o usuario
app.delete('/user/:id', validarToken, async(req, res) => {
    
    const {id} = req.params
    await User.destroy({where: {id : id}})
    .then((users)=> {

        return res.json({

            error:false,
            mensagem: "Usuario deletado com sucesso",
            users
        })

    }).catch(()=>{

        return res.json({

            error:true,
            mensagem: "Ocorreu um erro ao deletar o seu Usuario"

        })

    })

})

//Realizar Login do Usuario
app.post('/user-login', async(req, res)=> {

    const userEmail = await User.findOne({  where : {email : req.body.email}})

    if (!userEmail) {

        return res.status(400).json({

            error:true,
            mensagem: "Email não encontrado :("
    
        })
            
    }

    if (!(await bcrypt.compare(req.body.password, userEmail.password))) {

        return res.status(400).json({

            error:true,
            mensagem: "Senha Invalida!!!"
    
        })
        
    }

    setTimeout(() => {
        const token = jwt.sign({ id: userEmail.id }, process.env.SECRET, {
            expiresIn: "7d" // Chave válida por 7 dias
        });

        return res.json({
            error: false,
            mensagem: "O login foi realizado com sucesso!!",
            token
        });
    }, 3000);

})

//iniciando middleware
app.listen(8081, ()=>{
    console.log("Já chegou o disco voador!!!")
})