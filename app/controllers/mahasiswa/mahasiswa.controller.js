const db = require("../../models");
const Mahasiswa = db.mahasiswa;
const Divisi = db.divisi;
const gSheets = require("./gSheets.controller");
const PDFController = require("./pdfDownload.controller");
const techControl = require("../technical/technical.controller");
//GCP Cloud Storage
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ keyFilename: './keys/gcloud-storage.json' });

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
          attributes: ['nim_mhs', 'name', 'createdAt']
        }
      )
      .then(async (response) => {
        response = response[0];
        let curr_time = new Date();
        let time_diff = curr_time.getTime() - response.createdAt.getTime();
        let mins_diff = Math.floor(time_diff / 1000 / 60);
        if (mins_diff > 60) {
          res.status(503).send({ message: "Link Expired. Please contact MAXIMA 2021 for assistance." });
        }
        else {
          let file_name = response.nim_mhs + "-" + response.name + ".pdf";
          const options = {
            version: 'v4',
            action: 'read',
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
          };
          const bucketname = 'oprec-mxm-2021';
          const [ url ] = await storage.bucket(bucketname).file(file_name).getSignedUrl(options);
          res.status(200).send({ message: url });
        }
      })  
      .catch(err => {
        kode_error = 220101;
        techControl.addErrorLog(kode_error, "Controller", "Mahasiswa", "Download PDF", err.message);
        res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
      })
    }
  })
  .catch(err => {
    kode_error = 220100;
    techControl.addErrorLog(kode_error, "Controller", "Mahasiswa", "Download PDF", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
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
  .catch(err => {
    kode_error = 220200;
    techControl.addErrorLog(kode_error, "Controller", "Mahasiswa", "Download PDF", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  })
}

exports.cekStatusForm = (req,res) => {
  const { nim_mhs } = req.body;
  Mahasiswa.findOne(
    {
      where: {
        nim_mhs: nim_mhs
      },
      attributes: ['lulusSeleksiForm', 'tanggal_wawancara']
    }
  )
  .then(response => {
    if (!response) res.status(200).send({ message: "NIM tidak ditemukan. Coba cek lagi?"});
    else {
      let status = response.lulusSeleksiForm;
      let tanggal = response.tanggal_wawancara;
      if (status === true) res.status(200).send({ message: `Anda lulus ke tahap interview pada tanggal_wawancara ${tanggal}`});
      else res.status(200).send({ message: "Maaf, anda belum diterima. Jangan berkecil hati! Sampai bertemu di kesempatan selanjutnya."});
    }
  })
  .catch(err => {
    kode_error = 220300;
    techControl.addErrorLog(kode_error, "Controller", "Mahasiswa", "Cek Status Form", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
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
        })
        .catch(err => {
          kode_error = 220402;
          techControl.addErrorLog(kode_error, "Controller", "Mahasiswa", "Sign Up", err.message);
          res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
        })
      })
      .catch(err => {
        kode_error = 220401;
        techControl.addErrorLog(kode_error, "Controller", "Mahasiswa", "Sign Up", err.message);
        res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
      })
    }
  })
  .catch(err => {
    kode_error = 220400;
    techControl.addErrorLog(kode_error, "Controller", "Mahasiswa", "Sign Up", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  })
}