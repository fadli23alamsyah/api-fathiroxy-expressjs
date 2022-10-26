const express = require('express')
const db = require('./../config/db')
const PriceListResponse = require('./../models/pricelist.response')

const priceList = express.Router()

// ambil semua data pricelist
priceList.get('/', (req, res)=>{
    db.getConnection((error, connect)=>{
        // if(error) throw error

        if(error){
            res.status(500).send({"message" : error.code})
        }else{
            connect.query(`SELECT * FROM tb_pricelist`, (error, result) => {
                // if(error) throw error
    
                if(error){
                    res.status(500).send({"message" : error.code})
                }else{
                    res.send({
                        "message" : "Data berhasil didapatkan",
                        "data" : result.map((price) => new PriceListResponse(price))
                    })
                }
            })
            connect.release()
        }
    })
})

// ambil data pricelist berdasarkan id
priceList.get('/details', (req, res)=>{
    let idPrice = req.query.idPrice

    if(!idPrice){
        res.status(400).send({"message" : "Id Price kosong!!!"})
    }else{
        db.getConnection((error, connect)=>{
            // if(error) throw error

            if(error){
                res.status(500).send({"message" : error.code})
            }else{
                connect.query(`SELECT * FROM tb_pricelist WHERE id_price = ${idPrice}`, (error, result) => {
                    // if(error) throw error
                    
                    if(error){
                        res.status(500).send({"message" : error.code})
                    }else{
                        res.send({
                            "message" : "Data berhasil didapatkan",
                            "data" : result.map((price) => new PriceListResponse(price))
                        })
                    }
                })
                connect.release()
            }
        })
    }
})

// update pricelist
priceList.put('/details', (req, res)=>{
    let idPrice = req.body.idPrice
    let price = req.body.price

    if(!idPrice || !price){
        res.status(400).send({"message" : "Terdapat data kosong!!!"})
    }else{
        db.getConnection((error, connect)=>{
            // if(error) throw error
            
            if(error){
                res.status(500).send({"message" : error.code})
            }else{
                connect.query(`UPDATE tb_pricelist SET price = ${price} WHERE id_price = ${idPrice}`, (error, result) => {
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

module.exports = priceList