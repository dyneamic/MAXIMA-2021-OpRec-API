const db = require("../../models");
const Technical = db.technical;
const ErrorLogs = db.errorLogs;

const Op = db.Sequelize.Op;

//multer s3//
//var aws = require('aws-sdk');
//var multer = require('multer');
//var multerS3 = require('multer-s3');
//end of multerS3//

//tes state
//end of tes state
/*
exports.addErrorLog = (kode_error, bagian, subbagian, fungsi, pesan) => {
    ErrorLogs.create({
        error_code: kode_error,
        section: bagian,
        subsection: subbagian,
        function: fungsi,
        message: pesan
    })
}
*/

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
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(req.headers['x-forwarded-for']);
    console.log(req.connection.remoteAddress);
    res.status(200).send({ message: ip});
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