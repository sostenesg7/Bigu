var mongoose = require('mongoose')
var RideRepository = require('./RideRepository')
var UserRepository = require('./UserRepository')
var RequestRideRepository = require('./RequestRideRepository')

class BiguRepository {
    constructor(connection) {
        this.connection = connection
        this.Schema = new mongoose.Schema({
            checkin: Boolean,
            checkout: Boolean,
            reservation: mongoose.Schema.Types.ObjectId,
            ride: mongoose.Schema.Types.ObjectId,
            user: String
        })
        this.biguModel = this.connection.model('Bigu', this.Schema)

        //CÓDIGO PARA TESTE(ABAIXO)
        /*this.rideModel = new RideRepository(connection).rideModel
        this.userModel = new UserRepository(connection).userModel
        this.requestRideModel = new RequestRideRepository(connection).RequestRideModel
          */ //this.connection.model('Ride', new RideRepository(connection).schema)
        //this.UserModel = this.connection.model('User', { nome: String })
    }

    async findAllBigu() {
        var error = ''
        var result = null
        await this.biguModel.find(
            (err, res) => {
                if (err) {
                    error = err
                }
                result = res
            })

        if (result == null) {
            throw new Error(error)
        }
        return result
    }

    async insert(bigu) {
        return new Promise((resolve, reject) => {
            var error = ''
            var biguRep = new this.biguModel(bigu)
            biguRep.save((err, res) => {
                if (err) {
                    error = err
                }
                if (error !== '') {
                    throw new Error(error)
                }
                resolve(res._id)
            })

        })
    }

    async findById(id) {
        return new Promise((resolve, reject) => {
            var error = ''
            var result = null
            this.biguModel.findOne({ _id: id }, (err, res) => {
                    if (err || res == '' || res == null) {
                        error = err
                        reject(res)
                    }
                    resolve(res)
                })
                /*if (result == null) {
                    throw (new Error(error))
                }
                return result*/
        })
    }

    async remove(id) {
        var error = ''
        await this.biguModel.findOneAndRemove({ _id: id },
            () => {
                if (err) {
                    error = error
                    return
                }
            })
        if (error !== '') {
            throw new Error(error)
        }
    }

    //Utilizar o cpf como parametro | Mudar a chave primaria de usuario para cpf
    async removeAllFromUser(cpf) {
        var error = ''
        await this.biguModel.remove({ user: cpf },
            (err, res) => {
                if (err) {
                    error = err
                    return
                }
            })
        if (error !== '') {
            throw new Error(error)
        }
    }

    async updateCheckin(biguId, state) {
        var error = ''
        await this.biguModel.findOneAndUpdate({ _id: biguId }, { $set: { checkin: state } },
            (err, res) => {
                if (err) {
                    error = err
                    return
                }
            })
        if (error !== '') {
            throw new Error(error)
        }
    }

    async updateCheckout(biguId, state) {
        var error = ''
        await this.biguModel.findOneAndUpdate({ _id: biguId }, { $set: { checkout: state } },
            (err, res) => {
                if (err) {
                    error = err
                    return
                }
            })
        if (error !== '') {
            throw new Error(error)
        }
    }
}
module.exports = BiguRepository