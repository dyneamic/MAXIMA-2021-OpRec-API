const db = require("../../models");
const Mahasiswa = db.mahasiswa;
const Divisi = db.divisi;
const gSheets = require("./gSheets.controller");

/*
exports.updateData = (req,res) => {
  const {nim, name, email, prodi, angkatan, divisiID, no_hp, uLine, uInstagram} = req.body;
  Mahasiswa.update(
    {
      name: name,
      email: email,
      prodi: prodi,
      angkatan: angkatan,
      no_hp: no_hp,
      uLine: uLine,
      uInstagram: uInstagram,
      statusID: 1,
      divisiID: divisiID
    },
    {
      where: {
        nim: nim
      }
    }
  )
  .then(() => {
    res.status(200).send({ message: "Berhasil memperbarui data!"});
  })
}
*/

exports.getData = (req,res) => {
  const { nim } = req.body;
  Mahasiswa.findAll(
    {
      where: {
        nim: nim
      },
      attributes: ['nim', 'name', 'email', 'prodi', 'angkatan', 'no_hp', 'uLine', 'uInstagram', 'divisiID']
    }
  )
  .then((response) => {
    res.status(200).send(response);
  })
}

exports.cekStatus = (req,res) => {
  const { nim } = req.body;
  Mahasiswa.findOne(
    {
      where: {
        nim: nim
      },
      attributes: ['statusID']
    }
  )
  .then(response => {
    if (!response) res.status(200).send({ message: "NIM tidak ditemukan. Coba cek lagi?"});
    let statusID = response.statusID;
    if (statusID < 3) res.status(200).send({ message: "Formulir pendaftaran anda telah diterima dan sedang direview."});
    else if (statusID === 3) res.status(200).send({ message: "Anda diterima untuk interview! Silakan mengecek email anda! "});
  })
}

exports.SignUp = (req,res) => {
  const {nim, name, email, divisiID, no_hp, token, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, angkatan, fakultas, prodi, ips, whatsapp, uLine, uInstagram, soal1, soal2, soal3} = req.body;
  Mahasiswa.create({
    nim: nim,
    name: name,
    email: email,
    divisiID: divisiID,
    statusID: 1,
    no_hp: no_hp,
    token: token,
    tempat_lahir: tempat_lahir,
    tanggal_lahir: tanggal_lahir,
    jenis_kelamin: jenis_kelamin,
    alamat: alamat,
    angkatan: angkatan,
    fakultas: fakultas,
    prodi: prodi,
    ips: ips,
    whatsapp: whatsapp,
    uLine: uLine,
    uInstagram: uInstagram,
    soal1: soal1,
    soal2: soal2,
    soal3: soal3
  })
  .then(() => {
    Mahasiswa.findAll({
      where: {
        nim: nim
      },
      attributes: ['nim', 'name', 'email', 'no_hp', 'token', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin', 'alamat', 'angkatan', 'fakultas', 'prodi', 'ips', 'whatsapp', 'uLine', 'uInstagram', 'soal1', 'soal2', 'soal3'],
      include: [
        {
            model: Divisi,
            attributes: ['name']
        }
      ]
    })
    .then((response) => {
      response = response[0];
      gSheets.tesRun(response);
      res.status(200).send({ message: "Berhasil memasukkan data!"});
    });
  })
}