const express = require('express')
const db = require('./../config/db')
const FinanceResponse = require('./../models/finance.response')

const finance = express.Router()

// Ambil semua data
finance.get('/', (req, res) =>{
    db.getConnection((error, connect)=>{
        // if(error) throw error

        if(error){
            res.status(500).send({"message" : error.code})
        }else{
            let title = req.query.title ?? ''
            connect.query(`SELECT * FROM tb_finance WHERE title LIKE '%${title}%' ORDER BY date DESC`, (error, result)=>{
                // if(error) throw error
    
                if(error){
                    res.status(500).send({"message" : error.code})
                }else{
                    res.send({
                        "message" : "Data berhasil didapatkan",
                        "data" : result.map((finance) => new FinanceResponse(finance))
                    })
                }
            })
            connect.release()
        }
    })
})

// Tambah data
finance.post('/', (req, res)=>{
    let title = req.body.title
    let total = req.body.total
    let addInfo = req.body.addInfo

    if(!title || !total){
        res.status(400).send({"message" : "Terdapat data kosonh"})
    }else{
        db.getConnection((error, connect)=>{
            // if(error) throw error

            if(error){
                res.status(500).send({"message" : error.code})
            }else{
                let data = {
                    "title" : title,
                    "total" : total,
                    "add_info" : addInfo,
                    "date" : Date.now()
                }
                connect.query(`INSERT INTO tb_finance SET ? `, [data], (error, result)=>{
                    // if(error) throw error
    
                    if(error){
                        res.status(500).send({"message" : error.code})
                    }else{
                        res.status(201).send({"message" : "Data berhasil ditambahkan"})
                    }
                })
                connect.release()
            }
        })
    }
})

// Hapus data
finance.delete('/', (req, res) =>{
    let idFinance = req.body.idFinance

    if(!idFinance){
        res.status(400).send({"message" : "Id Finance kosong"})
    }else{
        db.getConnection((error, connect)=>{
            // if(error) throw error

            if(error){
                res.status(500).send({"message" : error.code})
            }else{
                connect.query(`DELETE FROM tb_finance WHERE id_finance = ${idFinance}`, (error, result)=>{
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

// Ambil berdasarkan id
finance.get('/details', (req, res)=>{
    let idFinance = req.query.idFinance

    if(!idFinance){
        res.status(400).send({"message" : "Id Finance kososng"})
    }else{
        db.getConnection((error, connect)=>{
            // if(error) throw error

            if(error){
                res.status(500).send({"message" : error.code})
            }else{
                connect.query(`SELECT * FROM tb_finance WHERE id_finance = ${idFinance}`, (error, result)=>{
                    // if(error) throw error
    
                    if(error){
                        res.status(500).send({"message" : error.code})
                    }else{
                        res.send({
                            "message" : "Data berhasil didapatkan berdasarkan id " + idFinance,
                            "data" : result.map((finance) => new FinanceResponse(finance))
                        })
                    }
                })
                connect.release()
            }
        })
    }
})

// Update data
finance.put('/details', (req, res)=>{
    let idFinance = req.body.idFinance
    let title = req.body.title
    let total = req.body.total
    let addInfo = req.body.addInfo

    if(!idFinance || !title || !total){
        res.status(400).send({"message" : "Terdapat data kosong"})
    }else{
        db.getConnection((error, connect)=>{
            // if(error) throw error

            if(error){
                res.status(500).send({"message" : error.code})
            }else{
                let data = {
                    "title" : title,
                    "total" : total,
                    "add_info" : addInfo
                }
                connect.query(`UPDATE tb_finance SET ? WHERE id_finance = ${idFinance}`, [data], (error, result)=>{
                    // if(error) throw error
    
                    if(error){
                        res.status(500).send({"message" : error.code})
                    }else{
                        res.send({"message" : "Data berhasil diupdate"})
                    }
                })
                connect.release()
            }
        })
    }
})

module.exports = finance