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
        attributes: ['value_message']
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

//end of tes state
exports.addErrorLog = (kode_error, bagian, subbagian, fungsi, pesan) => {
    ErrorLogs.create({
        error_code: kode_error,
        section: bagian,
        subsection: subbagian,
        function: fungsi,
        message: pesan
    })
}