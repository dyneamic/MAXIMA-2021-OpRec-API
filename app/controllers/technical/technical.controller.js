const db = require("../../models");
const Technical = db.technical;
const ErrorLogs = db.errorLogs;

const Op = db.Sequelize.Op;

exports.getIsDatabaseOnline = (req,res) => {
    Technical.findAll(
    {
        where: {
            id: 1
        },
        attributes: ['message']
    })
    .then(function(response) {
    res.json(response);
    });
}

exports.getIsServerOnline = (req, res) => {
    res.status(200).send({ message: "MXM 21 Oprec - NodeJS Server Is Up and Running"});
};

exports.tesAPIKey = (req,res) => {
    res.status(200).send({ message: "Authorized API key received. "})
}

exports.checkIP = (req,res) => {
    let ip = req.headers['x-forwarded-for'];
    res.status(200).send({ "Your IP": ip});
}
/*
exports.viewErrorLogs = (req, res) => {
    ErrorLogs.findAll({
    })
    .then(function (response) {
        res.json(response);
    })
}
*/