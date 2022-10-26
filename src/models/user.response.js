class UserResponse{
    constructor(user){
        this.idUser = user.id_user
        this.name = user.name
        this.email = user.email
        this.role = user.role
    }
}

module.exports = UserResponse