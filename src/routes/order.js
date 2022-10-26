const express = require('express')
const OrderResponse = require('./../models/order.response')
const db = require('./../config/db')

const order = express.Router()

// Mengambil semua data
// /test?id=12&name=wendu menggunakan query
order.get('/', (req, res)=>{
    db.getConnection((error, connect)=>{
        // if(error) throw error 
        
        if(error){
            res.status(500).send({"message" : error.code})
        }else{
            // Filter
            let statusPayment = parseInt(req.query.statusPayment) || ''
            let typeOrder = req.query.typeOrder || ''
            let role = req.query.role || ''
            let idUser = parseInt(req.query.idUser) || ''

            let query = ''
            let queryEmployee = `SELECT * FROM tb_order WHERE status_order = 3 AND type_order = '${typeOrder}' AND id_employee = '${idUser}' OR status_order = 2 AND type_order = '${typeOrder}' `

            let queryNonCustomerId = `SELECT * FROM tb_order WHERE type_order LIKE '%${typeOrder}%' `

            let queryAdminCustomerId = `SELECT * FROM tb_order WHERE status_payment LIKE '%${statusPayment}%' AND type_order LIKE '%${typeOrder}%' AND id_user LIKE '%${idUser}%' `

            if(role == 'employee'){
                query = queryEmployee
            }else if(role == 'customer' && idUser == ''){
                query = queryNonCustomerId
            }else{
                query = queryAdminCustomerId
            }

            connect.query(query, (error, result) => {
                // if(error) throw error
                
                if(error){
                    res.status(500).send({"message" : error.code})
                }else{
                    let limit = 10
                    let totalData = result.length
                    let totalPage = Math.ceil(totalData / limit)
                    let currentPage = parseInt(req.query.currentPage) || 1
                    let countNewData = totalData - parseInt(req.query.totalData) || 0
                    // let offset = currentPage * limit - limit + countNewData // jika order Desc
                    let offset = currentPage * limit - limit


                    let orderEmployee = `ORDER BY FIELD(status_order, 3,2,4) , date_order ASC LIMIT ${offset}, ${limit}`

                    let orderNonCustomerId = `ORDER BY FIELD(status_order, 3,2,1,4), date_order ASC LIMIT ${offset}, ${limit}`

                    let orderCustomerId = `ORDER BY FIELD(status_order, 1,2,3,4), date_order ASC LIMIT ${offset}, ${limit}`

                    let orderAdmin = `ORDER BY FIELD(status_order, 1,3,2,4), date_order ASC LIMIT ${offset}, ${limit}`

                    if(role == 'employee'){
                        query = queryEmployee + orderEmployee
                    }else if(role == 'customer' && idUser == ''){
                        query = queryNonCustomerId + orderNonCustomerId
                    }else if(role == 'customer' && idUser != ''){
                        query = queryAdminCustomerId + orderCustomerId
                    }else{
                        query = queryAdminCustomerId + orderAdmin
                    }

                    connect.query(query, (error, result)=>{
                        // if(error) throw error

                        if(error){
                            res.status(500).send({"message" : error.code})
                            console.log(error)
                        }else{
                            res.send({
                                "message" : "Berhasil mengambil data",
                                "page" : {
                                    "limit" : limit,
                                    "totalData" : totalData,
                                    "totalPage" : totalPage,
                                    "currentPage" : currentPage,
                                },
                                "data" : result.map(order => new OrderResponse(order)),
                            })
                        }
                    })
                }
                connect.release()
            })
        }
    })
})

// Menambahkan data
order.post('/', (req, res)=>{
    let nameCustomer = req.body.nameCustomer    //required
    let quantity = req.body.quantity            //required
    let totalPayment = req.body.totalPayment    //required
    let typeOrder = req.body.typeOrder          //required 
    let statusOrder = req.body.statusOrder      //required
    let statusPayment = req.body.statusPayment  //required
    let idUser = req.body.idUser                //required
    let addInfo = req.body.addInfo
    
    if(!nameCustomer || !quantity || !totalPayment || !typeOrder || !statusOrder || !statusPayment || !idUser){
        res.status(400).send({
            "message" : "Terdapat data kosong"
        })
    }else{
        db.getConnection((error, connect)=>{
            // if(error) throw error

            if(error){
                res.status(500).send({"message" : error.code})
            }else{
                let data = {
                    "name_customer" : nameCustomer,
                    "quantity" : quantity,
                    "total_payment" : totalPayment,
                    "type_order" : typeOrder,
                    "status_order" : statusOrder,
                    "status_payment" : statusPayment,
                    "add_info" : addInfo,
                    "date_order" : Date.now(),
                    "id_user" : idUser
                }
                connect.query(`INSERT INTO tb_order SET ?`, [data], (error, result)=>{
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

// Ambil data berdasarkan id
order.get('/details', (req, res)=>{
    let idOrder = req.query.idOrder

    if(!idOrder){
        res.status(400).send({ "message" : "Id Order kosong!!"})
    }else{
        db.getConnection((error, connect)=>{
            // if(error) throw error

            if(error){
                res.status(500).send({"message" : error.code})
            }else{
                connect.query(`SELECT * FROM tb_order WHERE id_order = '${idOrder}'`,(error, result)=>{
                    // if(error) throw error
    
                    if(error){
                        res.status(500).send({"message" : error.code})
                    }else{
                        if(result.length){
                            res.send({
                                "message" : "Data berhasil didapatkan",
                                "data" : result.map((order) => new OrderResponse(order))
                            })
                        }else{
                            res.status(404).send({"message" : "Data tidak ditemukan"})
                        }
                    }
                })
                connect.release()
            }
        })
    }
})

// Update data
order.put('/details', (req, res)=>{
    let idOrder = req.body.idOrder              //required
    let nameCustomer = req.body.nameCustomer    //required
    let quantity = req.body.quantity            //required
    let totalPayment = req.body.totalPayment    //required
    let statusPayment = req.body.statusPayment  //required
    let addInfo = req.body.addInfo

    if(!idOrder || !nameCustomer || !quantity || !totalPayment || !statusPayment){
        res.status(400).send({"messsage" : "Terdapat data kosong kosong!!"})
    }else{
        db.getConnection((error, connect)=>{
            // if(error) throw error

            if(error){
                res.status(500).send({"message" : error.code})
            }else{
                let data = {
                    "name_customer" : nameCustomer,
                    "quantity" : quantity,
                    "total_payment" : totalPayment,
                    "status_payment" : statusPayment,
                    "add_info" : addInfo,
                }
                connect.query(`UPDATE tb_order SET ? WHERE id_order = ${idOrder}`, [data], (error, result) =>{
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

// Delete data
order.delete('/', (req, res)=>{
    let idOrder = req.body.idOrder
    if(!idOrder){
        res.status(400).send({"message" : "Id Order kosong"})
    }else{
        db.getConnection((error, connect)=>{
            // if(error) throw error

            if(error){
                res.status(500).send({"message" : error.code})
            }else{
                connect.query(`DELETE FROM tb_order WHERE id_order = ${idOrder}`, (error, result)=>{
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

// update status order
order.put('/statusorder', (req, res)=>{
    let idUser = req.body.idUser
    let idOrder = req.body.idOrder
    let statusOrder = req.body.statusOrder

    if(!idOrder || !idUser){
        res.status(400).send({"message" : "Terdapat data kosong!!"})
    }else{
        db.getConnection((error, connect)=>{
            // if(error) throw error
            
            if(error){
                res.status(500).send({"message" : error.code})
            }else{
                connect.query(`SELECT * FROM tb_user WHERE id_user = ${idUser} LIMIT 1`, (error, result)=>{
                    // if(error) throw error
    
                    if(error){
                        res.status(500).send({"message" : error.code})
                    }else{
                        let data = {"status_order" : statusOrder}
                        
                        if(result[0].role == 'admin' && statusOrder == 4){
                            data.date_finish = Date.now()
                        }else if(result[0].role == 'employee' && statusOrder == 3){
                            data.name_employee = result[0].name
                            data.id_employee = idUser
                        }
                        
                        connect.query(`UPDATE tb_order SET ? WHERE id_order = ${idOrder}`, [data], (error, result) =>{
                            // if(error) throw error

                            if(error){
                                res.status(500).send({"message" : error.code})
                            }else{
                                res.send({"message" : "Update telah selesai"})
                            }
                        })
                    }
                })
                connect.release()
            }
        })
    }
})

module.exports = order