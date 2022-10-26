class PriceListResponse{
    constructor(priceList){
        this.idPrice = priceList.id_price
        this.name = priceList.name
        this.price = priceList.price
    }
}

module.exports = PriceListResponse