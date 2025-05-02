class BaseService {
    model;

    constructor(model) {
        this.model = model;
    }

    async getAll(condition = {}, returnOption = {}) {
        try {
            return await this.model.find(condition)
                .lean(returnOption.lean || false)
                .select(returnOption.select || '');
        } catch (error) {
            throw error;
        }
    }

    async getOne(condition = {}, returnOption = {}) {
        try {
            return await this.model.findOne(condition)
                .lean(returnOption.lean || false)
                .select(returnOption.select || '');
        } catch (error) {
            throw error;
        }
    }

    async getByIds(ids = [], returnOption = {}) {
        try {
            return await this.model.find({ _id: { $in: ids } })
                .lean(returnOption.lean || false)
                .select(returnOption.select || '');
        } catch (error) {
            throw error;
        }
    }

    async create(payload, returnOption = {}, options = {}) {
        try {
            const doc = new this.model(payload);
            const saved = await doc.save(options);
            return returnOption.lean ? saved.toObject() : saved;
        } catch (error) {
            throw error;
        }
    }

    async bulkCreate(payloads, returnOption = {}, options = { ordered: true }) {
        const { lean } = returnOption;
        console.log("first", payloads)
        try {
            const result = await this.model.insertMany(payloads, options);
            return lean ? result.map(doc => doc.toObject()) : result;
        } catch (error) {
            throw error;
        }
    }

    async update(id, updateData, returnOption = {}, options = { new: true, runValidators: true }) {
        try {
            return await this.model.findByIdAndUpdate(
                id,
                { $set: updateData },
                options
            ).lean(returnOption.lean || false);
        } catch (error) {
            throw error;
        }
    }

    async delete(id, returnOption = {}) {
        try {
            return await this.model.findByIdAndUpdate(
                id,
                { 
                    $set: { isDeleted: true, deletedAt: new Date() } 
                },
                { new: true }
            ).lean(returnOption.lean || false);
        } catch (error) {
            throw error;
        }
    }

    async getPaginated(payload = {}, returnOption = {}) {
        try {
            const { skip = 0, limit = 10, filters = {} } = payload;
            filters.isDeleted = { $ne: true }; 

            const [data, total] = await Promise.all([
                this.model.find(filters)
                    .skip(skip)
                    .limit(limit)
                    .lean(returnOption.lean || false)
                    .select(returnOption.select || '')
                    .exec(),
                this.model.countDocuments(filters).exec(),
            ]);

            return { data, total };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = BaseService;