const db = require("../../models");
const Mahasiswa = db.mahasiswa;
const Divisi = db.divisi;
const PDFDocument = require("pdfkit");
const fs = require("fs");
//GCP Cloud Storage
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ keyFilename: './app/controllers/mahasiswa/gcloud-storage.json' });

//tambahan
let endOfOne = 0;
let endOfTwo = 0;
const multiplierSpace = 15;
//end of tambahan

function generateHeader(doc) {
  doc
    .image("app/controllers/mahasiswa/mxm_logo.png", 50, 45, { width: 50 })
    .image("app/controllers/mahasiswa/umn_logo.png", 110, 45, { width: 25, height: 50 })
    .fillColor("#444444")
    .fontSize(20)
    //.text("MAXIMA 2021", 110, 57)
    .fontSize(10)
    .text("MAXIMA 2021 - Open Recruitment", 200, 50, { align: "right"})
    .text("Universitas Multimedia Nusantara", 200, 65, { align: "right" })
    .text("Tangerang, Indonesia", 200, 80, { align: "right" })
    .moveDown();
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatTanggalCetak(date) {
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  if (day < 10) day = '0' + day;
  if (month < 10) month = '0' + month;

  let hours = date.getHours();
  let mins = date.getMinutes() + 1;
  let secs = date.getSeconds();

  if (hours < 10) hours = '0' + hours;
  if (mins < 10) mins = '0' + mins;
  if (secs < 10) secs = '0' + secs;
  
  return day + "/" + month + "/" + year + " " + hours + ":" + mins + ":" + secs;
}

function formatTanggalLahir(date) {
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  if (day < 10) day = '0' + day;
  if (month < 10) month = '0' + month;
  
  return day + "/" + month + "/" + year;
}

function generateTopInformation(doc, mhs) {
  let count = 1;

  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Formulir Pendaftaran", 50, 150);

  generateHr(doc, 175);

  const informationPartOne = 190;

  doc
    .fontSize(10)
    .text("Nama:", 50, informationPartOne)
    .font("Helvetica-Bold")
    .text(mhs.name, 150, informationPartOne)
    .font("Helvetica")
    .text("NIM:", 50, informationPartOne + (multiplierSpace * count))
    .text(mhs.nim, 150, informationPartOne + (multiplierSpace * count++))
    .text("Email:", 50, informationPartOne + (multiplierSpace * count))
    .text(mhs.email, 150, informationPartOne + (multiplierSpace * count++))
    .text("Tanggal Cetak:", 50, informationPartOne + (multiplierSpace * count))
    .text(formatTanggalCetak(new Date()), 150, informationPartOne + (multiplierSpace * count++))
    .text("Pilihan Divisi:", 50, informationPartOne + (multiplierSpace * count))
    .text(mhs.divisi.name, 150, informationPartOne + (multiplierSpace * count++))
    .text("No HP:", 50, informationPartOne + (multiplierSpace * count))
    .text(mhs.no_hp, 150, informationPartOne + (multiplierSpace * count++))
    .text("Kode Token:", 50, informationPartOne + (multiplierSpace * count))
    .text(mhs.token, 150, informationPartOne + (multiplierSpace * count++))
    .moveDown();

  generateHr(doc, informationPartOne + (multiplierSpace * count++));
  endOfOne = informationPartOne + (multiplierSpace * count);

  doc.moveDown();
}  

function generateSecondInformation(doc, mhs) {
  let informationPartTwo = endOfOne;
  let count = 1;

  doc
    .fillColor("#444444")
    .fontSize(13)
    .text("Informasi Tambahan", 50, informationPartTwo)

  informationPartTwo = endOfOne + 25;
  generateHr(doc, informationPartTwo);
  informationPartTwo = endOfOne + 25;

  doc
    .fontSize(20)
    .font("Helvetica")
    .fontSize(10)
    .text("Tempat Lahir:", 50, informationPartTwo + (multiplierSpace * count))
    .text(mhs.tempat_lahir, 150, informationPartTwo + (multiplierSpace * count++))
    .text("Tanggal Lahir:", 50, informationPartTwo + (multiplierSpace * count))
    .text(formatTanggalLahir(mhs.tanggal_lahir), 150, informationPartTwo + (multiplierSpace * count++))
    .text("Jenis Kelamin:", 50, informationPartTwo + (multiplierSpace * count))
    .text(mhs.jenis_kelamin, 150, informationPartTwo + (multiplierSpace * count++))
    .text("Alamat:", 50, informationPartTwo + (multiplierSpace * count))
    .text(mhs.alamat, 150, informationPartTwo + (multiplierSpace * count++))
    .text("Angkatan:", 50, informationPartTwo + (multiplierSpace * count))
    .text(mhs.angkatan, 150, informationPartTwo + (multiplierSpace * count++))
    .text("Fakultas:", 50, informationPartTwo + (multiplierSpace * count))
    .text(mhs.fakultas, 150, informationPartTwo + (multiplierSpace * count++))
    .text("Program Studi:", 50, informationPartTwo + (multiplierSpace * count))
    .text(mhs.prodi, 150, informationPartTwo + (multiplierSpace * count++))
    .text("IPS:", 50, informationPartTwo + (multiplierSpace * count))
    .text(mhs.ips, 150, informationPartTwo + (multiplierSpace * count++))
    .text("WhatsApp:", 50, informationPartTwo + (multiplierSpace * count))
    .text(mhs.whatsapp, 150, informationPartTwo + (multiplierSpace * count++))
    .text("Line:", 50, informationPartTwo + (multiplierSpace * count))
    .text(mhs.uLine, 150, informationPartTwo + (multiplierSpace * count++))
    .text("Instagram:", 50, informationPartTwo + (multiplierSpace * count))
    .text(mhs.uInstagram, 150, informationPartTwo + (multiplierSpace * count++))
    .moveDown();

  generateHr(doc, informationPartTwo+ (multiplierSpace * count++));

  endOfTwo = informationPartTwo + (multiplierSpace * count);

  doc.moveDown();
}

function generateResponseInformation(doc, mhs) {
  let informationPartThree = endOfTwo;

  let count = 1;

  doc
    .fillColor("#444444")
    .fontSize(13)
    .text("Jawaban Pertanyaan", 50, informationPartThree)

  informationPartThree = endOfTwo + 25;
  generateHr(doc, informationPartThree);
  informationPartThree = endOfTwo + 25;

  doc
    .fontSize(20)
    .font("Helvetica")
    .fontSize(10)
    .text("Definisi Dreamland:", 50, informationPartThree + (multiplierSpace * count))
    .text(mhs.soal1, 150, informationPartThree + (multiplierSpace * count++))
    .moveDown();

  const pos2 = doc.y;

  doc
    .fontSize(20)
    .font("Helvetica")
    .fontSize(10)
    .text("Peningkatan:", 50, pos2)
    .text(mhs.soal2, 150, pos2)
    .moveDown();

  const pos3 = doc.y;

  doc
    .fontSize(20)
    .font("Helvetica")
    .fontSize(10)
    .text("Pertanyaan Divisi:", 50, pos3)
    .text(mhs.soal3, 150, pos3)
    .moveDown(2);
  
  generateHr(doc, doc.y);

  doc.moveDown();
}

function generateFooter(doc) {
  let curpos = doc.y + 20;
  doc
    .fontSize(10)
    .text(
      "This is a computer-generated document, hence no signature required.",
      50,
      curpos,
      { 
        align: "left" //, width: 500 
      }
    );
}

function createPDF(path, response, nim_param, express_res) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });
  //doc.pipe(fs.createWriteStream(path));
  generateHeader(doc);
  generateTopInformation(doc, response);
  generateSecondInformation(doc, response);
  generateResponseInformation(doc, response);
  //generateCustomerInformation(doc, invoice);
  //generateInvoiceTable(doc, invoice);
  generateFooter(doc);

  doc.pipe(fs.createWriteStream(path))
    .on('finish', async () => {
      // Replace with your bucket name and filename.
      const bucketname = 'oprec-mxm-2021';

      const res_bucket = await storage.bucket(bucketname).upload(path);
      // `mediaLink` is the URL for the raw contents of the file.
      let pdf_url = res_bucket[0].metadata.mediaLink;
      console.log('PDF closed');
      Mahasiswa.update(
        {
          pdfLink: pdf_url
        },
        {
          where: {
            nim: nim_param
          }
        }
      )
      .then(() => {
        express_res.download(path);
      })
    });
  doc.end();
}

exports.downloadPDF = (req,res) => {
  const { nim } = req.params; 
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
  .then(async (response) => {
    response = response[0];
    const path = "./app/controllers/mahasiswa/pdf_files/";
    const unique_file = response.nim + "-" + response.name + ".pdf";
    let final_path = path + unique_file;
    createPDF(final_path, response, nim, res);
    //res.status(200).sendFile(path);
  });
  
}