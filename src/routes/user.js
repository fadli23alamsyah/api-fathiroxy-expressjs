const express = require('express')
const db = require('./../config/db')
const UserResponse = require('../models/user.response')

const user = express.Router()

// Mengambil semua data karyawan
user.get('/', (req, res) => {
    db.getConnection((error, connect)=>{
        // if(error) throw error
        if(error){ 
            res.status(500).send({"message" : error.code})
        }else{
            connect.query(`SELECT id_user, email, name, role FROM tb_user WHERE role = 'employee'`, (error, result)=>{
                // if(error) throw error

                if(error){
                    res.status(500).send({"message" : error.code})
                }else{
                    res.send({
                        "message" : "Berhasil mendapatkan data karyawan",
                        "data" : result.map(user => new UserResponse(user))
                    })
                }
            })
            connect.release()
        }
    })
})

// Menambahkan data karyawan
user.post('/', (req, res) => {
    let email = req.body.email
    let name = req.body.name

    if(!email|| !name){
        res.status(400).send({"message" : "Terdapat inputan kosong!!"})
    }else{
        db.getConnection((error, connect)=>{
            // if(error) throw error
            if(error){
                res.status(500).send({"message" : error.code})
            }else{
                connect.query(`SELECT * FROM tb_user WHERE email = '${email}' LIMIT 1`,(error, result)=>{
                    // if(error) throw error
                    if(error){
                        res.status(500).send({"message" : error.code})
                    }else{
                        if(result.length){
                            res.status(400).send({"message" : "Email telah terdaftar"})
                        }else{
                            let data = {
                                "email" : email,
                                "name" : name,
                                "role" : "employee",
                            }
                            connect.query(`INSERT INTO tb_user SET ?`, [data], (error, result)=>{
                                res.status(201).send({"message" : "Berhasil menambah data"})
                            })
                        }
                    }
                })
                connect.release()
            }
        })
    }
})

// Mendapatkan details user
user.get('/details', (req, res) => {
    let idUser = req.query.idUser

    if(!idUser){
        res.status(400).send({"message" : "Id harus diisi!!"})
    }else{
        db.getConnection((error, connect)=>{
            // if(error) throw error
            if(error){
                res.status(500).send({"message" : error.code})
            }else{
                connect.query(`SELECT id_user, email, name, role FROM tb_user WHERE id_user = '${idUser}'`, (error, result)=>{
                    // if(error) throw error
                    if(error){
                        res.status(500).send({"message" : error.code})
                    }else{
                        res.send({
                            "message" : "Berhasil mendapatkan data user dengan id "+ idUser,
                            "data" : result.map(user => new UserResponse(user))
                        })
                    }
                })
                connect.release()
            }
        })
    }
})

// Mengupdate details user
user.put('/details', (req, res) => {
    let idUser = req.body.idUser
    let name = req.body.name
    let email = req.body.email

    if(!idUser || !name || !email){
        res.status(400).send({"message" : "Terdapat data kosong!!"})
    }else{
        db.getConnection((error, connect)=>{
            // if(error) throw error
            if(error){
                res.status(500).send({"message" : error.code})
            }else{
                let data = {
                    "name" : name,
                    "email" : email,
                }
                connect.query(`SELECT * FROM tb_user WHERE email = '${email}' LIMIT 1`,(error, result)=>{
                    // if(error) throw error
                    if(error){
                        res.status(500).send({"message" : error.code})
                    }else{
                        if(result.length && result[0].id_user != idUser){
                            res.status(400).send({"message" : "Email telah terdaftar"})
                        }else{
                            connect.query(`UPDATE tb_user SET ? WHERE id_user = '${idUser}'`,[data], (error, result)=>{
                                if(error) throw error
                                
                                res.send({"message" : "Berhasil mengubah data user"})
                            })
                        }
                    }
                })
                connect.release()
            }
            
        })
    }
})

// Delete user 
user.delete('/', (req, res)=>{
    let idUser = req.body.idUser
    if(!idUser){
        res.status(400).send({"message" : "Id kosong"})
    }else{
        db.getConnection((error, connect)=>{
            // if(error) throw error
            if(error){ 
                res.status(500).send({"message" : error.code})
            }else{
                // connected
                connect.query(`DELETE FROM tb_user WHERE id_user = ${idUser}`, (error, result)=>{
                // if(error) throw error

                    if(error){
                        res.status(500).send({"message" : error.code})
                    }else{
                        res.send({"message" : "Data berhasil dihapus"})
                    }
                })
                connect.release()
            }
        })
    }
})

module.exports = user