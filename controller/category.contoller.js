const {
    where
} = require('sequelize');
const pool = require('../datasource/datasource')
const Category = require('../model/category.model')
const Service = require('../model/services.model')
const ServicePrice = require("../model/price.model")


exports.addCategory = (req, res, next) => {
    const name = req.body.category_name;
    Category.create({
            category_name: name
        })
        .then(result => {
            console.log('Added Catgory');
            res.status(201).json({
                message: 'Category Added successfully!',
                category: result
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getAllCategories = (req, res, next) => {
    Category.findAll({
            //OPTIMIZE REQ  // include: ["services"]
        })
        .then(categories => {
            res.status(200).json({
                Categories: categories
            });
        })
        .catch(err => console.log(err));
}

exports.updateCategory = (req, res, next) => {
    const updatedName = req.body.category_name;
    const id = req.params.categoryId
    Category.findByPk(id)
        .then(category => {
            if (!category) {
                return res.status(404).json({
                    message: 'Category not found!'
                });
            }
            category.category_name = updatedName;
            return category.save();
        })
        .then(result => {
            console.log('Edit Catgory');
            res.status(201).json({
                message: 'Category Edited successfully!',
                category: result
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.deleteCategory = (req, res, next) => {
    const id = req.params.categoryId;
    Category.findByPk(id)
        .then(async category => {
            if (!category) {
                return res.status(404).json({
                    message: 'Category not found!'
                });
            }
            const servicesCount = await Service.count({
                where: {
                    category_id: id
                }
            });

            if (servicesCount > 0) {
                return res.status(400).json({
                    message: 'Cannot delete category with associated services'
                });
            }
            await Category.destroy({
                where: {
                    id: id
                }
            });
        })
        .then(result => {
            res.status(200).json({
                message: 'Category deleted!'
            });
        })
        .catch(err => console.log(err));
}

exports.addService = (req, res, next) => {
    const name = req.body.name
    const type = req.body.type
    const id = req.params.categoryId
    Category.findByPk(id)
        .then(category => {
            if (!category) {
                return res.status(404).json({
                    message: 'Category not found!'
                });
            }
        })
    Service.create({
            service_name: name,
            type: type,
            category_id: id
        })
        .then(result => {
            console.log('Added Service');
            const pricesList = req.body.prices
            pricesList.map((price) => {
                price.service_id = result.id
            })
            ServicePrice.bulkCreate(
                pricesList)
            res.status(201).json({
                message: 'Service Added successfully!',
                service: result
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getAllServices = (req, res, next) => {
    const cat_id = req.params.categoryId
    Service.findAll({
            where: {
                category_id: cat_id
            }
        })
        .then(services => {
            res.status(200).json({
                Services: services
            });
        })
        .catch(err => console.log(err));
}

exports.deleteService = (req, res, next) => {
    const cat_id = req.params.categoryId;
    const id = req.params.serviceId
    Service.findOne({
            where: {
                category_id: cat_id,
                id: id
            }
        })
        .then(service => {
            if (!service) {
                return res.status(404).json({
                    message: 'Service not found!'
                });
            }
            ServicePrice.destroy({
                where: {
                    service_id: id
                }
            })
            return Service.destroy({
                where: {
                    id: id
                }
            });
        })
        .then(result => {
            res.status(200).json({
                message: 'Service deleted!'
            });
        })
        .catch(err => console.log(err));
}

exports.updateService = (req, res, next) => {
    const id = req.params.serviceId
    const categoryId = req.params.categoryId
    const {
        name,
        type,
        priceOptions
    } = req.body;
    Service.findByPk(id)
        .then(async service => {
            if (!service) {
                return res.status(404).json({
                    message: 'Service not found!'
                });
            }
            const updatedService = await Service.update({
                service_name: name,
                type: type
            }, {
                where: {
                    id: id,
                    category_id: categoryId
                },
                returning: true
            });
        })
        .then(async result => {
            await Promise.all(priceOptions.map(async option => {
                await ServicePrice.upsert({
                    ...option,
                    service_id: id
                });
            }));
            console.log('Edit Service');
            res.status(201).json({
                message: 'Service Edited successfully!',
                service: result
            });
        })
        .catch(err => {
            console.log(err);
        });
}