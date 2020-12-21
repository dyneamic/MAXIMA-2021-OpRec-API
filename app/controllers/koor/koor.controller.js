const db = require("../../models");
const Mahasiswa = db.mahasiswa;
const Divisi = db.divisi;
const Status = db.status;

exports.allMahasiswa = (req,res) => {
  Mahasiswa.findAll(
    {
      where: {
        nim: nim_arr
      },
      attributes: ['nim', 'name', 'email', 'prodi', 'angkatan', 'no_hp', 'uLine', 'uInstagram' ],
      include: [
          {
              model: Divisi,
              attributes: ['name']
          },
          {
              model: Status,
              attributes: ['name']
          }
      ]
    }
  )
  .then(response => {
    res.json(response);
  });
}

exports.byDivisi = (req,res) => {
  const { divisiID } = req.body;
  Mahasiswa.findAll(
    {
      where: { 
        divisiID: divisiID
      },
      attributes: ['nim']
    }
  )
  .then(response1 => {
    let nim_arr = [];
    for (i = 0; i < response1.length; i++) {
      nim_arr[i] = parseInt(response1[i].nim);
    }
   
    Mahasiswa.findAll(
      {
        where: {
          nim: nim_arr
        },
        attributes: ['nim', 'name', 'email', 'prodi', 'angkatan', 'no_hp', 'uLine', 'uInstagram' ],
        include: [
            {
                model: Divisi,
                attributes: ['name']
            },
            {
                model: Status,
                attributes: ['name']
            }
        ]
      }
    )
    .then(response2 => {
      res.json(response2);
    });
  })
}

exports.updateStatus = (req,res) => {
  const { nim_mhs, statusID, nim_koor } = req.body;
  Mahasiswa.update(
    {
      statusID: statusID,
      lastUpdatedBy: nim_koor
    },
    {
      where: {
        nim: nim_mhs
      }
    }
  )
  .then(response => {
    res.status(200).send({ message: "Berhasil update! "});
  })
}