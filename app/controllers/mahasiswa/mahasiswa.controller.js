const db = require("../../models");
const Mahasiswa = db.mahasiswa;
const Divisi = db.divisi;
const gSheets = require("./gSheets.controller");
const PDFController = require("./pdfDownload.controller");
//GCP Cloud Storage
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ keyFilename: './app/controllers/mahasiswa/gcloud-storage.json' });

exports.downloadPDF = (req,res) => {
  const { nim_mhs, token } = req.body;
  Mahasiswa.count({
    where: { 
      nim_mhs: nim_mhs,
      token: token
    }
  })
  .then((count) => {
    if (count < 1) {
      res.status(403).send({ message: "Wrong NIM or Token! "});
    }
    else {
      Mahasiswa.findAll(
        {
          where: {
            nim_mhs: nim_mhs
          },
          attributes: ['nim_mhs', 'name']
        }
      )
      .then(async (response) => {
        response = response[0];
        let file_name = response.nim_mhs + "-" + response.name + ".pdf";
        let dl_path = "./pdf_files/" + file_name;
        const options = {
          version: 'v4',
          action: 'read',
          expires: Date.now() + 15 * 60 * 1000, // 15 minutes
          //destination: dl_path
        };
        const bucketname = 'oprec-mxm-2021';
        //const res_bucket = await storage.bucket(bucketname).file(file_name).download(options);
        const [ url ] = await storage.bucket(bucketname).file(file_name).getSignedUrl(options);
        res.status(200).send({ message: url });
      })
    }
  })
}

exports.uniqueCheck = (req,res) => {
  const { nim_mhs } = req.body;
  Mahasiswa.count({
    where: { 
      nim_mhs: nim_mhs
    }
  })
  .then((response) => {
    if (response < 1) res.status(200).send({ message: "OK! "});
    else res.status(403).send({ message: "Anda sudah mendaftar!" });
  })
}

exports.cekStatusForm = (req,res) => {
  const { nim_mhs } = req.body;
  Mahasiswa.findOne(
    {
      where: {
        nim_mhs: nim_mhs
      },
      attributes: ['statusID']
    }
  )
  .then(response => {
    if (!response) res.status(200).send({ message: "NIM tidak ditemukan. Coba cek lagi?"});
    else {
      let statusID = response.statusID;
      if (statusID < 3) res.status(200).send({ message: "Formulir pendaftaran anda telah diterima dan sedang direview."});
      else if (statusID === 3) res.status(200).send({ message: "Anda diterima untuk interview! Silakan mengecek email anda! "});
    }
  })
}

exports.SignUp = (req,res) => {
  const {nim_mhs, name, email, divisiID, no_hp, token, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, angkatan, prodi, ips, uLine, uInstagram, soal1, soal2, soal3} = req.body;
  Mahasiswa.count({
    where: { 
      nim_mhs: nim_mhs
    }
  })
  .then((count) => {
    if (count > 0) {
      res.status(403).send({ message: "Sudah pernah mendaftar! "});
    }
    else {
      Mahasiswa.create({
        nim_mhs: nim_mhs,
        name: name,
        email: email,
        divisiID: divisiID,
        lulusSeleksiForm: 0,
        tanggal_wawancara: null,
        lulusInterview: 0,
        no_hp: no_hp,
        token: token,
        tempat_lahir: tempat_lahir,
        tanggal_lahir: tanggal_lahir,
        jenis_kelamin: jenis_kelamin,
        alamat: alamat,
        angkatan: angkatan,
        prodi: prodi,
        ips: ips,
        uLine: uLine,
        uInstagram: uInstagram,
        soal1: soal1,
        soal2: soal2,
        soal3: soal3
      })
      .then(() => {
        Mahasiswa.findAll({
          where: {
            nim_mhs: nim_mhs
          },
          attributes: ['nim_mhs', 'name', 'email', 'no_hp', 'token', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin', 'alamat', 'angkatan', 'prodi', 'ips', 'uLine', 'uInstagram', 'soal1', 'soal2', 'soal3'],
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
          PDFController.mainCreatePDF(response.nim_mhs);
          res.status(200).send({ message: "Berhasil memasukkan data!"});
        });
      })
    }
  })
}