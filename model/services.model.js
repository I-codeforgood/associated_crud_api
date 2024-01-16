const Sequelize = require('sequelize');
const db = require('../datasource/datasource');
const Category = require('./category.model');
const ServicePrice = require('./price.model');


module.exports.ServiceType = Object.freeze({
    Normal: 'Normal',
    VIP: 'VIP'
});

const Service = db.define('services', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        service_name: Sequelize.STRING,
        type: {
            type: Sequelize.ENUM,
            values: Object.values(this.ServiceType),
            defaultValue: this.ServiceType.Normal
        },
        category_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }

    }, {
        timestamps: true,
        classMethods: {
            associate: function(models) {
                Service.belongsTo(models.category, {
                    foreignKey: 'category_id'
                });
                models.prices.belongsTo(models.services, {
                    foreignKey: 'service_id'
                });
                Service.hasMany(models.prices, {
                    as: 'priceOptions'
                });
            }
        }
    }

);


module.exports = Service;