const db = require("../../models");
const Mahasiswa = db.mahasiswa;
const MahasiswaDivisi = db.mahasiswaDivisi;

exports.registerMhs = (req,res) => {
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
    let statusID = response[0].statusID;
    if (statusID < 3) res.status(200).send({ message: "Formulir pendaftaran anda telah diterima dan sedang direview."});
    else if (statusID === 3) res.status(200).send({ message: "Anda diterima untuk interview! Silakan mengecek email anda! "});
  })
}