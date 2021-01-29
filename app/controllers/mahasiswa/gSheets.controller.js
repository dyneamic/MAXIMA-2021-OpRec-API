const { GoogleSpreadsheet } = require('google-spreadsheet');

const doc = new GoogleSpreadsheet('1QKgm8uPbHqZhAVTWlITczJ43q8gceVGuYYpnF06qHXI');
const creds = require("./key.json");

const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

function formatTanggalCetak(date) {
  let day = date.getDate();
  //let month = date.getMonth() + 1;
  let month = monthNames[date.getMonth()];
  let year = date.getFullYear();

  if (day < 10) day = '0' + day;
  if (month < 10) month = '0' + month;

  let hours = date.getHours();
  let mins = date.getMinutes() + 1;
  let secs = date.getSeconds();

  if (hours < 10) hours = '0' + hours;
  if (mins < 10) mins = '0' + mins;
  if (secs < 10) secs = '0' + secs;
  
  return day + " " + month + " " + year + " " + hours + ":" + mins + ":" + secs;
}


function formatTanggalLahir(old_date) {
  let date = new Date(old_date);
  let day = date.getDate();
  let month = monthNames[date.getMonth()];
  let year = date.getFullYear();

  if (day < 10) day = '0' + day;
  if (month < 10) month = '0' + month;
  
  return day + " " + month + " " + year;
}

exports.tesRun = async (mhs) => {
  // Initialize the sheet - doc ID is the long id in the sheets URL
  
  //try{
    await doc.useServiceAccountAuth(creds);
    // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
    //await doc.useServiceAccountAuth({
    //  client_email: "oprec-mxm21@maxima-2021-shee-1609830583141.iam.gserviceaccount.com",
    //  private_key: "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCod9dWspCJ6zcV\n4CKQTpUstxHteIA2QEIMpLnUNCPy82QzbhDHVrNwFSHGFoD46S2G3z9Kmp9zKKu5\nbz5wlW1qYNEbpCq5BP4ouCo0ssv4PvgX96PgkC7Ki85Nb6Dwc6rbCfcU6ajnmCKS\nUEWhcGICA1li22HPNJyb6MjY2dBKBCh6yDNrXC9RxsQUsIzmt9AXVwAuRELA0Z/N\n2Bx5LyDsmPWZHheiN4Drr1GVF8p2fXIhF6TcSkpQAaH6f3PjGbAJKmGkUyDBqBGo\nNH7mfjwhAnVd3sfwcKLIp9bwLwCjlvAOc79duL2qUs38ahmd6GEiZf6asG9vj834\nrQ2uA4N5AgMBAAECggEATiiTUhiz8BidTNvYjUS39q/UdGzUZtb3DbCaujWafAup\ncCbfR+wUgap8Kc+k9FYSFiGa1nzX/vBeg0B2Intg8NqMCRvn6kDDvZZ7lklhUgG8\nzjnI4NVjr/qestRYQVYYbVi5Ng2VnCS73U+6jkR6Y96z6KZJQX1yLu8Xx2t+M+fr\nQJ/APfgO9FiYmMwDFKT69svAovB58wDZ3/b6azekEdlh8vuJ180GAU5kD1oKm1bd\nVR/IGJfFmSXMci1blI1xc7RAnG0WaRfRkhF7eu/rnmmrKVDRN2TCinXhS4pw/dYs\nqEwgbIroOI7wUS29r6sQJ4GDVUdckMu7Dqu5vAE0RQKBgQDQ68OBgIVTGOLArhI9\nBgC8uY1NyHkEFIA49cCZRj+x+pU10nPCbKLMa7tKXTfo0uqOD9wjkFZjrMj7NONU\nokqu6YeH6Y6C9ZJXncVi3Irv7sGlk737c6fhAfRpWPuDgdjCOQArJ8aGs8HE4b5N\nFLrEU+aEUIBvJ/zvUO15gcvoDwKBgQDObm8nho77cF8kms6KeSCgvi26MDxHoKq1\nzihqfE/rnHvdpVyJXcTiUR6lPaH6+HT4W9rhDOhJ4YG0M5SuXxXl4FTFs65jzQ9D\nZEnMH9AZR56vpt3iGVTPbC+YUSBfJaPJosIrpCglCKRpB0nczsCDEBtYDHt57x07\nPAu5DZqT9wKBgEJLTdJ+MdBYiTuTAP6UNQ+t4YTZJG2DA90PPnpkrDmRxl851LnR\nNyee1+OVCPS8WOmTZstyNbeTUINGGQz2IrS2LeeW2T39Jt7elY/1Y7EXFiOwagys\neo0PzbrQHZ9xSJL4+3C2QmzkBYywBW74MPuzk+ZQlTCwg7Z8+54e7dFJAoGAHKxM\nNjJDg/tMy9nQ3H0MoicoVNdEWDKh45TaGkhgFXrr3ZKNcusaYNEhr5QK/sAqByFD\nGsVfMnvnNy9+9GVytjZdsARQMb6W4yZ39alpj0laak2EPlaEaDc/uSlzlKO2x1gb\nHlKz3MkBhTEk+k2hgdLn6Wf6cqpa5hJmEnMoSGsCgYEAgXO4hZ559gwqKvvxIBCH\n8aMzRemji1IU7b7elbbsPYqNcO3pTcfaDZc2fpU624ylgNPpJVEdv1XswTKlAYcv\nMzyAYDKjM/56J/XGCVLxXjIoAZ/wBTwOG6DqWyvdQFEWunPhWmAbZoQWtD3gYxaS\nz+EAW7txQRw6s1xOYOoyZd0=",
    //});

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    
    sheet.loadHeaderRow()
    .then(() => {
      console.log(sheet.headerValues);
    });

    sheet.addRow({
      "Date": formatTanggalCetak(new Date()),
      "NIM": mhs.nim_mhs,
      "Name": mhs.name,
      "Email": mhs.email,
      "Divisi": mhs.divisi.name,
      "No_HP": mhs.no_hp,
      "Token": mhs.token,
      "Tempat_Lahir": mhs.tempat_lahir,
      "Tanggal_Lahir": formatTanggalLahir(mhs.tanggal_lahir),
      "Jenis_Kelamin": mhs.jenis_kelamin,
      "Alamat": mhs.alamat,
      "Angkatan": mhs.angkatan,
      "Prodi": mhs.prodi,
      "IPS": mhs.ips,
      "uLine": mhs.uLine,
      "uInstagram": mhs.uInstagram,
      "Soal1": mhs.soal1,
      "Soal2": mhs.soal2,
      "Soal3": mhs.soal3
    })
    .then(() => {
      sheet.saveUpdatedCells();
    })
    
    //await insertRow.save();

    // adding / removing sheets
    //const newSheet = await doc.addSheet({ title: 'hot new sheet!' });
    //await newSheet.delete();
  //}
  //finally{
   // res.status(200).send({message: "runned!"});
  //}
  
}
