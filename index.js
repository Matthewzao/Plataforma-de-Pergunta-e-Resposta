const bodyParser = require("body-parser");
const express = require("express");
const connection = require("./database/database")
const app = express();
const Pergunta = require("./database/Pergunta")
const Resposta = require("./database/Resposta")

// Database
connection
    .authenticate()
    .then(() => {
        console.log("Connection Done!")
    })
    .catch((msgErro) => {
        console.log(msgErro)
    })

app.set('view engine', 'ejs')
app.use(express.static('public'))

// BodyParser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Routes
app.get("/", (request, response) => {
    Pergunta.findAll({
        raw: true, order: [
            ['id', 'DESC']
        ]
    }).then(perguntas => {
        response.render("index", {
            perguntas: perguntas
        });

    });

});

app.get("/perguntar", (request, response) => {
    response.render("perguntar")
});

app.post("/savequestion", (request, response) => {
    var title = request.body.title
    var description = request.body.description
    Pergunta.create({
        title: title,
        description: description
    }).then(() => {
        response.redirect("/");
    });
});

app.get("/pergunta/:id", (request, response) => {
    var id = request.params.id;
    Pergunta.findOne({
        where: { id: id }
    }).then(pergunta => {
        if (pergunta != undefined) {

            Resposta.findAll({
                where: { perguntaId: pergunta.id },
                order: [['id', 'DESC']]
            }).then(respostas => {
                response.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                }); // PERGUNTA ENCONTRADA
            })
        } else {
            response.redirect("/") // NAO ENCONTRADA
        }
    })
});

app.post("/responder", (request, response) => {
    var corpo = request.body.corpo;
    var perguntaId = request.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        response.redirect("/pergunta/" + perguntaId)
    })
});

app.listen(3333, () => {
    console.log("App Started!")
});