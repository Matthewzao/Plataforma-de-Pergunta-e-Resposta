const Sequelize = require("sequelize")
const connection = require("./database")

const Pergunta = connection.define('pergunta', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Pergunta.sync({ force: false }).then(() => {
    console.log("Table Created!")
})

module.exports = Pergunta;