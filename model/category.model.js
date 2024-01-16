const Sequelize = require('sequelize');
const db = require('../datasource/datasource');
const Service = require('./services.model');

const Category = db.define('category', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    category_name: Sequelize.STRING
}, {
    timestamps: true
});

Category.associate = function (models) {
    Category.hasMany(Service, {
        as: 'services',
        foreignKey: 'category_id'
    });
};

module.exports = Category;