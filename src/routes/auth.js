const express = require('express')
const db = require('./../config/db')

const auth = express.Router()

// req.query for url = /api?email=email@email.com&name=namepeople
auth.get('/', (req, res)=>{
    let email = req.query.email
    let name = req.query.name
    if(!email || !name){
        res.status(400).send({"message" : "Terdapat data kosong"})
    }else{
        db.getConnection((error, connect)=>{
            // if(error) throw error
            
            if(error){
                res.status(500).send({"message" : error.code})
            }else{
                connect.query(`SELECT * FROM tb_user WHERE email = '${email}' LIMIT 1`, (error, result)=>{
                    // if(error) throw error
    
                    if(error){
                        res.status(500).send({"message" : error.code})
                    }else{
                        if(!result.length){
                            let data = {
                                "email" : email,
                                "name" : name,
                                "role" : "customer",
                            }
                            connect.query(`INSERT INTO tb_user SET ?`,[data], (error, result)=>{
                                if(error) throw error
        
                                data.idUser = result.insertId
                                res.status(201).send({
                                    "message" : "Anda berhasil registrasi, Selamat datang",
                                    "data" : data
                                })
                            })
                        }else{
                            res.send({
                                "message" : "Login Berhasil",
                                "data" : {
                                    "idUser" : result[0].id_user,
                                    "name" : result[0].name,
                                    "email" : result[0].email,
                                    "role" : result[0].role,
                                }
                            })
                        }
                    }
                    connect.release()
                })
            }
        })
    }
})

module.exports = auth