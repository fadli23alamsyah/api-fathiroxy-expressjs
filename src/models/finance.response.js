class FinanceResponse{
    constructor(finance){
        this.idFinance = finance.id_finance
        this.title = finance.title
        this.date = finance.date
        this.total = finance.total
        this.addInfo = finance.add_info
    }
}

module.exports = FinanceResponse