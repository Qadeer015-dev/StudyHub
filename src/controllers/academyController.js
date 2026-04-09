const AcademyService = require('../services/academyService');
const AppError = require('../utils/AppError');

class AcademyController {
    static async create(req, res, next) {
        try {
            const academy = await AcademyService.createAcademy(req.body);
            res.status(201).json({
                success: true,
                message: 'Academy created successfully',
                data: academy
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req, res, next) {
        try {
            const filter = { status: req.query.status };
            const academies = await AcademyService.getAllAcademies(filter);
            res.status(200).json({
                success: true,
                count: academies.length,
                data: academies
            });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            // Accept either numeric id or uuid
            const identifier = req.params.id;
            let academy;
            if (identifier.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
                academy = await AcademyService.getAcademyByUuid(identifier);
            } else if (!isNaN(identifier)) {
                academy = await AcademyService.getAcademyById(parseInt(identifier));
            } else {
                throw new AppError('Invalid academy identifier', 400);
            }
            res.status(200).json({
                success: true,
                data: academy
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const result = await AcademyService.updateAcademy(id, req.body);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const result = await AcademyService.deleteAcademy(id);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AcademyController;