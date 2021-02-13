const db = require("../../models");
const Mahasiswa = db.mahasiswa;
const Divisi = db.divisi;
const KoorUpdateLog = db.koorUpdateLog;
const Technical = db.technical;
const MahasiswaQueue = db.mahasiswaQueue;
const techControl = require("../technical/technical.controller");
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ keyFilename: './keys/gcloud-storage.json' });

exports.allMahasiswa = (req,res) => {
  Mahasiswa.findAll(
    {
      attributes: ['nim_mhs', 'name', 'lulusSeleksiForm', 'tanggal_wawancara', 'lulusInterview'],
      include: [
          {
              model: Divisi,
              attributes: ['name']
          }
      ]
    }
  )
  .then(response => {
    res.status(200).json(response);
  })
  .catch(err => {
    kode_error = 120100;
    techControl.addErrorLog(kode_error, "Controller", "Koor CRUD", "All Mahasiswa", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  });
}

exports.byDivisi = (req,res) => {
  const { divisiID } = req.body;
  Mahasiswa.findAll(
    {
      where: { 
        divisiID: divisiID
      },
      attributes: ['nim_mhs']
    }
  )
  .then(response1 => {
    let nim_arr = [];
    for (i = 0; i < response1.length; i++) {
      nim_arr[i] = parseInt(response1[i].nim_mhs);
    }
    Mahasiswa.findAll(
      {
        where: {
          nim_mhs: nim_arr
        },
        attributes: ['nim_mhs', 'name', 'lulusSeleksiForm', 'tanggal_wawancara', 'lulusInterview'],
        include: [
            {
                model: Divisi,
                attributes: ['name']
            }
        ]
      }
    )
    .then(response2 => {
      res.status(200).json(response2);
    })
    .catch(err => {
      kode_error = 120201;
      techControl.addErrorLog(kode_error, "Controller", "Koor CRUD", "Mahasiswa Find All", err.message);
      res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
    })
  })
  .catch(err => {
    kode_error = 120200;
    techControl.addErrorLog(kode_error, "Controller", "Koor CRUD", "Mahasiswa Find All", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  })
}

exports.seleksiForm = (req,res) => {
  const { nim_mhs, lulusSeleksiForm, nim_koor } = req.body;
  Mahasiswa.update(
    {
      lulusSeleksiForm: lulusSeleksiForm
    },
    {
      where: {
        nim_mhs: nim_mhs
      }
    }
  )
  .then(() => {
    KoorUpdateLog.create({
      nim_koor: nim_koor,
      nim_mhs: nim_mhs,
      update_type: "Update Lulus Seleksi Form",
      updated_value: lulusSeleksiForm
    })
    .then(() => {
      res.status(200).send({ message: "Berhasil update! "});
    })
    .catch(err => {
      kode_error = 120301;
      techControl.addErrorLog(kode_error, "Controller", "Koor CRUD", "Update Seleksi Form", err.message);
      res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
    })
  })
  .catch(err => {
    kode_error = 120300;
    techControl.addErrorLog(kode_error, "Controller", "Koor CRUD", "Update Seleksi Form", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  })
}

exports.hasilInterview = (req,res) => {
  const { nim_mhs, lulusInterview, nim_koor } = req.body;
  Mahasiswa.update(
    {
      lulusInterview: lulusInterview
    },
    {
      where: {
        nim_mhs: nim_mhs
      }
    }
  )
  .then(() => {
    KoorUpdateLog.create({
      nim_koor: nim_koor,
      nim_mhs: nim_mhs,
      update_type: "Update Lulus Interview",
      updated_value: lulusInterview
    })
    .then(() => {
      res.status(200).send({ message: "Berhasil update! "});
    })
    .catch(err => {
      kode_error = 120401;
      techControl.addErrorLog(kode_error, "Controller", "Koor CRUD", "Update Hasil Interview", err.message);
      res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
    })
  })
  .catch(err => {
    kode_error = 120400;
    techControl.addErrorLog(kode_error, "Controller", "Koor CRUD", "Update Hasil Interview", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  })
}

exports.updateJadwalInterview = (req,res) => {
  const { nim_mhs, tanggal_wawancara, nim_koor } = req.body;
  Mahasiswa.update(
    {
      tanggal_wawancara: tanggal_wawancara
    },
    {
      where: {
        nim_mhs: nim_mhs
      }
    }
  )
  .then(() => {
    KoorUpdateLog.create({
      nim_koor: nim_koor,
      nim_mhs: nim_mhs,
      update_type: "Update Jadwal Interview",
      updated_value: tanggal_wawancara
    })
    .then(() => {
      res.status(200).send({ message: "Berhasil update! "});
    })
    .catch(err => {
      kode_error = 120501;
      techControl.addErrorLog(kode_error, "Controller", "Koor CRUD", "Update Jadwal Interview", err.message);
      res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
    })
  })
  .catch(err => {
    kode_error = 120500;
    techControl.addErrorLog(kode_error, "Controller", "Koor CRUD", "Update Jadwal Interview", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  });
}

exports.statusOprec = (req,res) => {
  Technical.findAll({
    where: {
      id: 3
    },
    attributes: ['value_message']
  })
  .then((response) => {
    response = response[0];
    return res.status(200).send({ message: response.value_message});
  })
  .catch(err => {
    kode_error = 120600;
    techControl.addErrorLog(kode_error, "Controller", "Koor CRUD", "Status Oprec", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  });
}

exports.statusKoor = (req,res) => {
  Technical.findAll({
    where: {
      id: 4
    },
    attributes: ['value_message']
  })
  .then((response) => {
    response = response[0];
    return res.status(200).send({ message: response.value_message});
  })
  .catch(err => {
    kode_error = 120700;
    techControl.addErrorLog(kode_error, "Controller", "Koor CRUD", "Status Update Koor", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  });
}

exports.updateOprecMhsStatus = (req,res) => {
  const opt = parseInt(req.body.toggle);
  let new_msg = '';
  console.log('Opt: ' + opt);
  if (opt === 0) new_msg = 'false';
  else if (opt === 1) new_msg = 'true';
  Technical.update(
    {
      value_message: new_msg
    },
    {
      where: {
        id: 3
      }
    }
  )
  .then(() => {
    res.status(200).send({ message: "Updated! "});
  })
  .catch(err => {
    kode_error = 120800;
    techControl.addErrorLog(kode_error, "Controller", "Koor CRUD", "Update Status Oprec", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  });
}

exports.updateKoorStatus = (req,res) => {
  const opt = parseInt(req.body.toggle);
  let new_msg = '';
  console.log('Opt: ' + opt);
  if (opt === 0) new_msg = 'false';
  else if (opt === 1) new_msg = 'true';
  Technical.update(
    {
      value_message: new_msg
    },
    {
      where: {
        id: 4
      }
    }
  )
  .then(() => {
    res.status(200).send({ message: "Updated! "});
  })
  .catch(err => {
    kode_error = 120900;
    techControl.addErrorLog(kode_error, "Controller", "Koor CRUD", "Update Status Koor", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  });
}

exports.updateZoomLink = (req,res) => {
  const { link } = req.body;
  Technical.update(
    {
      value_message: link
    },
    {
      where: {
        id: 2
      }
    }
  )
  .then(() => {
    res.status(200).send({ message: "Updated! "});
  })
  .catch(err => {
    kode_error = 121000;
    techControl.addErrorLog(kode_error, "Controller", "Koor CRUD", "Update Zoom Link", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  });
}

exports.downloadPDF = (req,res) => {
  const { nim_mhs } = req.body;
  Mahasiswa.count({
    where: { 
      nim_mhs: nim_mhs
    }
  })
  .then((count) => {
    if (count < 1) {
      res.status(403).send({ message: "NIM not found!" });
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
        let file_name = response.nim_mhs + "-" + response.name + ".pdf";
        const options = {
          version: 'v4',
          action: 'read',
          expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        };
        const bucketname = 'oprec-mxm-2021';
        const [ url ] = await storage.bucket(bucketname).file(file_name).getSignedUrl(options);
        res.status(200).send({ message: url });
      })  
      .catch(err => {
        kode_error = 121101;
        techControl.addErrorLog(kode_error, "Controller", "Koor CRUD", "Download PDF", err.message);
        res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
      })
    }
  })
  .catch(err => {
    kode_error = 121100;
    techControl.addErrorLog(kode_error, "Controller", "Koor CRUD", "Download PDF", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  })
}

exports.antrianMahasiswa = (req,res) => {
  MahasiswaQueue.findAll(
    {
      order: [
        ['no_urut', 'ASC'],
      ],
      attributes: ['nim_mhs', 'divisiID', 'no_urut'],
      include: [
          {
              model: Divisi,
              attributes: ['name']
          },
          {
              model: Mahasiswa,
              attributes: ['name']
          }
      ]
    }
  )
  .then(response => {
    res.status(200).json(response);
  })
  .catch(err => {
    kode_error = 121200;
    techControl.addErrorLog(kode_error, "Controller", "Koor CRUD", "All Antrian", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  });
}

exports.antrianByDivisi = (req,res) => {
  const { divisiID } = req.body;
  MahasiswaQueue.findAll(
    {
      where: { 
        divisiID: divisiID
      },
      attributes: ['nim_mhs']
    }
  )
  .then(response1 => {
    let nim_arr = [];
    for (i = 0; i < response1.length; i++) {
      nim_arr[i] = parseInt(response1[i].nim_mhs);
    }
    MahasiswaQueue.findAll(
      {
        where: {
          nim_mhs: nim_arr
        },
        order: [
          ['no_urut', 'ASC'],
        ],
        attributes: ['nim_mhs', 'divisiID', 'no_urut'],
        include: [
            {
                model: Divisi,
                attributes: ['name']
            },
            {
                model: Mahasiswa,
                attributes: ['name']
            }
        ]
      }
    )
    .then(response2 => {
      res.status(200).json(response2);
    })
    .catch(err => {
      kode_error = 121301;
      techControl.addErrorLog(kode_error, "Controller", "Koor CRUD", "Antrian by Divisi", err.message);
      res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
    })
  })
  .catch(err => {
    kode_error = 121300;
    techControl.addErrorLog(kode_error, "Controller", "Koor CRUD", "Antrian by Divisi", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  })
}

exports.statusZoom = (req,res) => {
  Technical.findAll({
    where: {
      id: 5
    },
    attributes: ['value_message']
  })
  .then((response) => {
    response = response[0];
    return res.status(200).send({ message: response.value_message});
  })
  .catch(err => {
    kode_error = 121400;
    techControl.addErrorLog(kode_error, "Controller", "Koor CRUD", "Status Zoom Route", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  });
}

exports.updateZoomStatus = (req,res) => {
  const opt = parseInt(req.body.toggle);
  let new_msg = '';
  console.log('Opt: ' + opt);
  if (opt === 0) new_msg = 'false';
  else if (opt === 1) new_msg = 'true';
  Technical.update(
    {
      value_message: new_msg
    },
    {
      where: {
        id: 5
      }
    }
  )
  .then(() => {
    res.status(200).send({ message: "Updated! "});
  })
  .catch(err => {
    kode_error = 121500;
    techControl.addErrorLog(kode_error, "Controller", "Koor CRUD", "Update Zoom Route Status", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  });
}

exports.currentZoomLink = (req,res) => {
  Technical.findAll({
    where: {
      id: 2
    },
    attributes: ['value_message']
  })
  .then((response) => {
    response = response[0];
    return res.status(200).send({ message: response.value_message});
  })
  .catch(err => {
    kode_error = 121600;
    techControl.addErrorLog(kode_error, "Controller", "Koor CRUD", "Current Zoom Link", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  });
}

exports.updateMahasiswaCheckForm = (req,res) => {
  const opt = parseInt(req.body.toggle);
  let new_msg = '';
  console.log('Opt: ' + opt);
  if (opt === 0) new_msg = 'false';
  else if (opt === 1) new_msg = 'true';
  Technical.update(
    {
      value_message: new_msg
    },
    {
      where: {
        id: 6
      }
    }
  )
  .then(() => {
    res.status(200).send({ message: "Updated! "});
  })
  .catch(err => {
    kode_error = 121700;
    techControl.addErrorLog(kode_error, "Controller", "Koor CRUD", "Update Status Mahasiswa", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  });
}

exports.statusMahasiswaCheckForm = (req,res) => {
  Technical.findAll({
    where: {
      id: 6
    },
    attributes: ['value_message']
  })
  .then((response) => {
    response = response[0];
    return res.status(200).send({ message: response.value_message});
  })
  .catch(err => {
    kode_error = 121800;
    techControl.addErrorLog(kode_error, "Controller", "Koor CRUD", "Current Status Mahasiswa", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  });
}

exports.updateLulusInterview = (req,res) => {
  const opt = parseInt(req.body.toggle);
  let new_msg = '';
  console.log('Opt: ' + opt);
  if (opt === 0) new_msg = 'false';
  else if (opt === 1) new_msg = 'true';
  Technical.update(
    {
      value_message: new_msg
    },
    {
      where: {
        id: 7
      }
    }
  )
  .then(() => {
    res.status(200).send({ message: "Updated! "});
  })
  .catch(err => {
    kode_error = 121900;
    techControl.addErrorLog(kode_error, "Controller", "Koor CRUD", "Update Status Lulus Interview", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  });
}

exports.statusLulusInterview = (req,res) => {
  Technical.findAll({
    where: {
      id: 7
    },
    attributes: ['value_message']
  })
  .then((response) => {
    response = response[0];
    return res.status(200).send({ message: response.value_message});
  })
  .catch(err => {
    kode_error = 122000;
    techControl.addErrorLog(kode_error, "Controller", "Koor CRUD", "Current Status Lulus Interview", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  });
}