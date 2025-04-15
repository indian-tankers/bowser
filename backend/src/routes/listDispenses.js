const express = require('express');
const router = express.Router();
const { FuelingTransaction } = require('../models/Transaction');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const { updateTripSheet } = require('../utils/tripSheet')
const { mongoose } = require('mongoose');

router.get('/', async (req, res) => {
    const { tripSheetId, bowserNumber, startDate, endDate, driverName, page = 1, limit = 20, sortBy = 'fuelingDateTime', order = 'desc', verified, category, vehicleNo, allocator } = req.query;
    const skip = (page - 1) * limit;
    let filter = {};

    if (verified === 'true') {
        filter.verified = true;
    } else if (verified === 'false') {
        filter.verified = { $in: [false, null] };
    }

    if (bowserNumber) {
        filter['bowser.regNo'] = bowserNumber;
    }

    if (allocator) {
        filter.$or = [
            { 'allocationAdmin.name': { $regex: allocator, $options: "i" } },
            { 'allocationAdmin.id': { $regex: allocator, $options: "i" } }
        ];
    }

    if (tripSheetId && tripSheetId !== null && tripSheetId !== undefined) {
        filter['tripSheetId'] = Number(tripSheetId);
    }

    if (driverName) {
        filter['driverName'] = { $regex: driverName, $options: 'i' };
    }
    if (vehicleNo) {
        filter['vehicleNumber'] = { $regex: vehicleNo, $options: 'i' };
    }

    if (startDate && endDate) {
        filter.fuelingDateTime = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        };
    }


    if (category !== undefined && category !== 'all') {
        filter['category'] = category;
    }

    const sortOrder = order === 'asc' ? 1 : -1;

    console.log("filter: ", filter)

    try {
        const records = await FuelingTransaction.find(filter, {
            vehicleNumber: 1,
            tripSheetId: 1,
            quantityType: 1,
            fuelQuantity: 1,
            driverName: 1,
            driverMobile: 1,
            bowser: 1,
            fuelingDateTime: 1,
            location: 1,
            verified: 1,
            category: 1,
            party: 1,
            odometer: 1,
            posted: 1
        }).skip(skip).limit(Number(limit)).sort({ [sortBy]: sortOrder });
        const totalRecords = await FuelingTransaction.countDocuments();
        console.log(records.length)

        if (records.length == 0) {
            res.status(400).json({ message: 'No records found' })
        } else {
            res.json({
                totalRecords,
                totalPages: Math.ceil(totalRecords / limit),
                currentPage: Number(page),
                records,
            });
        }
    } catch (error) {
        console.error('Error fetching fueling records:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to export fueling records to Excel
router.get('/export/excel', async (req, res) => {
    const { bowserNumber, driverName, tripSheetId, sortBy = 'fuelingDateTime', order = 'desc', limit, verified } = req.query;
    let filter = {};

    if (verified === 'true') {
        filter.verified = true;
    } else if (verified === 'false') {
        filter.verified = { $in: [false, null] };
    }
    if (bowserNumber) {
        filter['bowser.regNo'] = bowserNumber;
    }

    if (driverName) {
        filter['driverName'] = { $regex: driverName, $options: 'i' };
    }
    if (tripSheetId) {
        const numericTripSheetId = Number(tripSheetId);
        if (!isNaN(numericTripSheetId)) {
            filter['tripSheetId'] = numericTripSheetId;
        } else {
            console.error('Invalid tripSheetId format. Expected a number.');
            return res.status(400).json({ message: 'Invalid tripSheetId format. Expected a number.' });
        }
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const recordLimit = limit ? parseInt(limit, 10) : undefined;

    try {
        const records = await FuelingTransaction.find(filter, {
            fuelingDateTime: 1,
            tripSheetId: 1,
            bowser: 1,
            gpsLocation: 1,
            location: 1,
            driverName: 1,
            driverMobile: 1,
            vehicleNumber: 1,
            fuelQuantity: 1,
            quantityType: 1,
            verified: 1
        }).sort({ [sortBy]: sortOrder }).limit(recordLimit);

        const formattedRecords = records.map(record => ({
            'Trip Sheet Number': record.tripSheetId,
            'Fueling Time': record.fuelingDateTime,
            'Fueling Location': record.location,
            'Bowser Number': record.bowser.regNo,
            'Bowser Driver': record.bowser.driver.name,
            'Bowser Driver Ph No.': record.bowser.driver.phoneNo,
            'Vehicle Number': record.vehicleNumber,
            'Vehicle Driver Name': record.driverName,
            'Vehicle Driver Mobile': record.driverMobile,
            'Fueling Type': record.quantityType,
            'Quantity': record.fuelQuantity,
            'Cordinates location': record.gpsLocation,
        }));

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filterDescription = `${bowserNumber ? `Bowser-${bowserNumber}_` : ''}${driverName ? `Driver-${driverName}_` : ''}`;
        const fileName = `dispenses_data_${filterDescription}Count-${formattedRecords.length}_${timestamp}.xlsx`;

        const worksheet = XLSX.utils.json_to_sheet(formattedRecords);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dispenses Data');

        const filePath = path.join(__dirname, fileName);
        XLSX.writeFile(workbook, filePath);

        res.download(filePath, fileName, err => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).json({ message: 'Error downloading file', err });
            }

            fs.unlinkSync(filePath);
        });
    } catch (error) {
        console.error('Error exporting data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const singleRecord = await FuelingTransaction.findById(id);

        if (!singleRecord) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.json(singleRecord);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.patch('/update/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedRecord = await FuelingTransaction.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }, { new: true });

        if (!updatedRecord) {
            return res.status(404).json({ heading: "Failed", message: 'Record not found' });
        }
        await updateTripSheet({ tripSheetId: updatedRecord.tripSheetId, newDispense: updatedRecord })

        res.status(200).json({ heading: "Success!", message: 'Record updated successfully', updatedRecord });
    } catch (error) {
        console.error('Error updating record:', error);
        res.status(500).json({ heading: "Failed!", message: 'Internal server error' });
    }
});
router.patch('/verify/:id', async (req, res) => {
    console.log(req.body)
    const { id } = req.params;
    let { by } = req.body
    try {
        const transaction = await FuelingTransaction.findByIdAndUpdate(new mongoose.Types.ObjectId(id), {
            verified: {
                status: true,
                by: {
                    id: by.id,
                    name: by.name
                }
            }
        }, { new: true });

        if (transaction) {
            await updateTripSheet({ tripSheetId: transaction.tripSheetId, verify: transaction })
        }

        if (!transaction) {
            return res.status(404).json({ heading: "Failed", message: 'Record not found' });
        }

        res.status(200).json({ heading: "Success!", message: 'Record verified successfully' });
    } catch (error) {
        console.error('Error updating record:', error);
        res.status(500).json({ heading: "Failed!", message: 'Internal server error' });
    }
});
router.patch('/post/:id', async (req, res) => {
    console.log(req.body)
    const { id } = req.params;
    let { by } = req.body
    try {
        const transaction = await FuelingTransaction.findByIdAndUpdate(id, {
            posted: {
                status: true,
                by: {
                    id: by.id,
                    name: by.name
                }
            }
        }, { new: true });

        if (transaction) {
            await updateTripSheet({ tripSheetId: transaction.tripSheetId, post: transaction })
        }

        if (!transaction) {
            return res.status(404).json({ heading: "Failed", message: 'Record not found' });
        }

        res.status(200).json({ heading: "Success!", message: 'Record verified successfully' });
    } catch (error) {
        console.error('Error updating record:', error);
        res.status(500).json({ heading: "Failed!", message: 'Internal server error' });
    }
});
router.post('/verify', async (req, res) => {
    const { ids, by } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ heading: "Failed!", message: "Invalid or empty ids array" });
    }
    try {
        const result = await FuelingTransaction.updateMany(
            { _id: { $in: ids } },
            {
                $set: {
                    verified: {
                        status: true,
                        by: {
                            id: by.id,
                            name: by.name
                        }
                    }
                }
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ heading: "Failed!", message: "No records found to update" });
        }

        const transactions = await FuelingTransaction.find({ _id: { $in: ids } });
        for (let i = 0; i < transactions.length; i++) {
            await updateTripSheet({ tripSheetId: transactions[i].tripSheetId, newDispense: transactions[i] });
        }

        res.json({
            heading: "Success!",
            message: `${result.modifiedCount} record(s) verified successfully`,
            result
        });
    } catch (error) {
        console.error('Error updating records:', error);
        res.status(500).json({ heading: "Failed!", message: 'Internal server error' });
    }
});

router.delete('/delete', async (req, res) => {
    const { tripSheetId, id } = req.body
    console.log(req.body)
    try {
        const deletedRecord = await FuelingTransaction.findByIdAndDelete(id);

        if (!deletedRecord) {
            return res.status(404).json({ message: 'Record not found' });
        }

        await updateTripSheet({ tripSheetId, removeDispenseId: id })

        res.status(200).json({ message: 'Fueling record deleted successfully', success: true });
    } catch (err) {
        console.error('Error deleting Fueling record:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
})

module.exports = router;
