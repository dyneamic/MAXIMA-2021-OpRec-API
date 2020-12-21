const db = require("../../models");
const Mahasiswa = db.mahasiswa;
const MahasiswaDivisi = db.mahasiswaDivisi;

exports.registerMhs = (req,res) => {
  const {nim, name, email, prodi, angkatan, divisiID, no_hp, uLine, uInstagram} = req.body;
  Mahasiswa.count({
    where: {
      nim: nim
    }
  })
  .then(counts => {
    if (counts >= 1) {
      res.status(403).send({ message: "Sudah pernah mendaftar sebelumnya!"});
    }
    else {
      Mahasiswa.create(
        {
          nim: nim,
          name: name,
          email: email,
          prodi: prodi,
          angkatan: angkatan,
          no_hp: no_hp,
          uLine: uLine,
          uInstagram: uInstagram,
          statusID: 1,
          lastUpdatedBy: 0,
          divisiID: divisiID
        }
      )
      .then(rowsUpdated => {
        res.status(200).send({ message: "Berhasil Mendaftar! "});
      })
      .catch(err => {
        kode_error = 110100;
        //techControl.addErrorLog(kode_error, "Controller", "Home Data Management", "Add Home", err.message);
        res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
      });
    }
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