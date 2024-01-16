const Sequelize = require('sequelize');
const db = require('../datasource/datasource');
const Category = require('./category.model');
const Service = require('./services.model');


module.exports.PriceType = Object.freeze({
    Hourly: 'Hourly',
    Weekly: 'Weekly',
    Monthly: 'Monthly'
});

const ServicePrice = db.define('prices', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    duration: Sequelize.INTEGER,
    price: Sequelize.DECIMAL,
    type: {
        type: Sequelize.ENUM,
        values: Object.values(this.PriceType),
        defaultValue: this.PriceType.Hourly
    },
    service_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
    classMethods: {
        associate: function (models) {
            ServicePrice.belongsTo(models.services, {
                foreignKey: 'service_id'
            });
        }
    }
});


module.exports = ServicePrice;