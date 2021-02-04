const db = require("../../models");
const Mahasiswa = db.mahasiswa;
const Divisi = db.divisi;
const KoorUpdateLog = db.koorUpdateLog;
const Technical = db.technical;

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
    });
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
  })
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
    let final_msg = "Status Oprec adalah " + response.value_message;
    return res.status(200).send({ message: final_msg});
  })
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
    let final_msg = "Status Update Koor adalah " + response.value_message;
    return res.status(200).send({ message: final_msg});
  })
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
  res.status(200).send({ message: "Updated! "});
}