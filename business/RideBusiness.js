class RideBusiness {
    /*user: String,
    hitchhikers: [String],
    start: Date, // start time
    end: Date,
    route: mongoose.Schema.Types.ObjectId,
    availableSpaces: Number,
    vehicle: mongoose.Schema.Types.ObjectId*/

    constructor(riRep, uRep, roRep, biRep) {
        this.repository = riRep
        this.userRep = uRep
        this.routeRep = roRep
        this.biguRepository = biRep
    }

    //Quem deu carona inicou
    async start(rideId) {
        return new Promise((resolve, reject) => {
            var error = ""
            try {
                this.repository.findById(rideId).then((ride) => {
                    this.repository.setStart(rideId, Date.now())
                    ride.hitchhikers.forEach((value, index, array) => {
                        this.biguRepository.findById(value).then((bigu) => {
                            this.userRep.setRideMode(bigu.user, true)
                            resolve(ride)
                        })
                    })
                })
            } catch (err) {
                error = err
            }
            if (error != "") {
                throw new Error(error)
            }
        })
    }

    //Quem deu carona encerrou
    async end(rideId) {
        return new Promise((resolve, reject) => {
            var error = ''
            try {
                if (rideId == null) {
                    error = "dados invalidos"
                } else {
                    this.repository.findById(rideId).then((ri) => {
                        if (ri.end == null) {
                            this.repository.setEnd(rideId, Date.now())
                            this.userRep.setRideMode(ri.user, false)
                            this.userRep.addPoints(ri.user, 1)
                            resolve('ENCERRADA. OK')
                        } else {
                            resolve('QUER ME TROLLAR, INUTIL? OK')
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        })
    }

    async findContactsRides(cpf) {
        return new Promise((resolve, reject) => {
            var result = null
            var error = ''
            try {
                this.userRep.findByCpf(cpf).then((user) => {
                    this.userRep.findContactsRides(cpf).then((res) => {
                        if (res == null || res == '') {
                            error = 'without contacts rides'
                            console.log(error)
                        } else {
                            resolve(res)
                        }
                    })
                })
            } catch (err) {
                throw new Error(err)
            }
        })
    }

    async giveRide(cpf, routeId, availableSpaces, vehiclePlate) {
        return new Promise((resolve, reject) => {
            var error = ''
            try {
                this.userRep.findByCpf(cpf).then((resUser) => {
                    if (resUser.vehicles.indexOf(vehiclePlate) == -1) {
                        error = 'User can\'t have this vehicle'
                        console.log(error)
                    } else {
                        //Se o user já estiver dando ou recebendo carona
                        if (resUser.rideMode == false) {
                            this.repository.insert({
                                user: cpf,
                                route: routeId,
                                availableSpaces: availableSpaces,
                                vehicle: vehiclePlate
                            }).then((id) => {
                                this.userRep.addGivenRide(cpf, id)
                                this.userRep.setRideMode(cpf, true)
                                resolve(id)
                            })
                        } else {
                            error = "user already in giving ride or in ride"
                            console.log(error)
                        }
                    }
                })
            } catch (err) {
                error = err
            }
        })
        if (error != '') {
            throw new Error(error)
        }
    }
}
module.exports = RideBusiness