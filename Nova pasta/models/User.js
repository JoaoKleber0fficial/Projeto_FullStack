import sequelize from "./db.js";
import Sequelize, { DataTypes } from "sequelize";

const User = sequelize.define('user', {

    id:
    {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },

    name:
    {
        type: DataTypes.STRING,
        allowNull: false
    },

    email:
    {
        type: DataTypes.STRING,
        allowNull: false
    },

    password:
    {
        type: DataTypes.STRING,
        allowNull: false
    }

    
})

User.sync({alter: true})

export default User