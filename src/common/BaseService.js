const { Op } = require('sequelize');

class BaseService {
    model;

    constructor(model) {
        this.model = model;
    }

    async getAll(condition = {}, returnOption = {}) {
        try {
            return await this.model.findAll({
                where: condition,
                ...this._processReturnOptions(returnOption)
            });
        } catch (error) {
            throw error;
        }
    }

    async getOne(condition = {}, returnOption = {}) {
        try {
            return await this.model.findOne({
                where: condition,
                ...this._processReturnOptions(returnOption)
            });
        } catch (error) {
            throw error;
        }
    }

    async getByIds(ids = [], returnOption = {}) {
        try {
            return await this.model.findAll({
                where: {
                    id: {
                        [Op.in]: ids
                    }
                },
                ...this._processReturnOptions(returnOption)
            });
        } catch (error) {
            throw error;
        }
    }

    async create(payload, returnOption = {}, options = {}) {
        try {
            return await this.model.create(payload, options);
        } catch (error) {
            throw error;
        }
    }

    async bulkCreate(payloads, returnOption = {}, options = { validate: true }) {
        console.log("first", payloads);
        try {
            return await this.model.bulkCreate(payloads, options);
        } catch (error) {
            throw error;
        }
    }

    async update(id, updateData, returnOption = {}, options = {}) {
        try {
            const instance = await this.model.findByPk(id);
            if (!instance) {
                throw new Error('Record not found');
            }
            
            return await instance.update(updateData, {
                ...options,
                ...this._processReturnOptions(returnOption)
            });
        } catch (error) {
            throw error;
        }
    }

    async delete(id, returnOption = {}) {
        try {
            const instance = await this.model.findByPk(id);
            if (!instance) {
                throw new Error('Record not found');
            }
            
            // Use Sequelize paranoid delete (soft delete)
            return await instance.destroy();
        } catch (error) {
            throw error;
        }
    }

    async getPaginated(payload = {}, returnOption = {}) {
        try {
            const { skip = 0, limit = 10, filters = {} } = payload;
            
            // Add logic to exclude soft-deleted records
            filters.deletedAt = null;

            const { count, rows } = await this.model.findAndCountAll({
                where: filters,
                offset: skip,
                limit: limit,
                ...this._processReturnOptions(returnOption)
            });

            return { data: rows, total: count };
        } catch (error) {
            throw error;
        }
    }

    // Helper method to process return options
    _processReturnOptions(returnOption = {}) {
        const options = {};
        
        // Handle select fields (Sequelize uses 'attributes')
        if (returnOption.select) {
            options.attributes = returnOption.select.split(' ').filter(field => field);
        }
        
        // Handle include associations if needed
        if (returnOption.include) {
            options.include = returnOption.include;
        }
        
        return options;
    }
}

module.exports = BaseService;