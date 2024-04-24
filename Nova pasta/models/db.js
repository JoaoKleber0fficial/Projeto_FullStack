import Sequelize from "sequelize";
import'dotenv/config'

const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB,process.env.DB_PASS,{

    host: process.env.DB_HOST,
    dialect: 'mysql'
})

sequelize.authenticate().then(function(){
    console.log("Meu banco de Dados esta conectado")

}).catch(function() {
    console.log("Ocorreu um erro no Servidor:")
})

export default sequelize