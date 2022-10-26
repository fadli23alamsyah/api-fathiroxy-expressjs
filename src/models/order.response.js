class OrderResponse{
    constructor(order){
        this.idOrder = order.id_order
        this.nameCustomer = order.name_customer
        this.quantity = order.quantity
        this.totalPayment = order.total_payment
        this.typeOrder = order.type_order
        this.statusOrder = order.status_order
        this.statusPayment = order.status_payment
        this.addInfo = order.add_info
        this.dateOrder = order.date_order
        this.dateFinish = order.date_finish
        this.nameEmployee = order.name_employee
        this.idEmployee = order.id_employee
        this.idUser = order.id_user
    }
}

module.exports = OrderResponse