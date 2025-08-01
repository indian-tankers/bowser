const express = require('express');
const router = express.Router();
const Driver = require('../models/driver');
const User = require('../models/user');

router.get('/:searchTerm', async (req, res) => {
    const searchTerm = req.params.searchTerm;

    try {
        const drivers = await Driver.find({
            $or: [
                { Name: { $regex: searchTerm, $options: 'i' } },
                { ITPLId: { $regex: searchTerm, $options: 'i' } },
                { 'MobileNo.MobileNo': { $regex: searchTerm, $options: 'i' } }
            ]
        }).exec();

        if (drivers.length === 0) {
            return res.status(404).json({ message: 'No driver found with the given search term' });
        }

        res.status(200).json(drivers);
    } catch (err) {
        console.error('Error searching drivers:', err);
        console.error('Error stack:', err.stack);
        res.status(500).json({ message: 'Server error', error: err.message, stack: err.stack });
    }
});

router.get('/bowser-drivers/:parameter', async (req, res) => {
    const parameter = req.params.parameter;
    const bowserDriverRoleId = '6710ddc21e5c7dc410e64e34';

    try {
        const users = await User.find({ $or: [{ userId: { $regex: parameter, $options: 'i' } }, { phoneNumber: { $regex: parameter, $options: "i" } }, { name: { $regex: parameter, $options: "i" } }] }, 'userId name phoneNumber roles verified');

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        const bowserDrivers = users.filter(user =>
            user.verified && user.roles.some(role => role.toString() === bowserDriverRoleId)
        );

        if (bowserDrivers.length === 0) {
            return res.status(404).json({ message: 'No users found with the bowser driver role' });
        }

        res.status(200).json(bowserDrivers.map(driver => ({
            name: driver.name,
            phoneNo: driver.phoneNumber
        })));
    } catch (err) {
        console.error('Error searching bowser drivers:', err);
        console.error('Error stack:', err.stack);
        res.status(500).json({ message: 'Server error', error: err.message, stack: err.stack });
    }
});

router.post('/updateDriverMobile', async (req, res) => {
    const { driverId, driverMobile } = req.body;

    if (!driverId || !driverMobile) {
        return res.status(400).json({ message: 'Driver ID and mobile number are required.' });
    }

    try {
        const updatedDriver = await Driver.findOneAndUpdate(
            { Name: { $regex: driverId, $options: "i" } },
            {
                $set: {
                    'MobileNo.LastUsed': false,
                    'MobileNo.IsDefaultNumber': false,
                },
                $push: {
                    MobileNo: [{
                        MobileNo: driverMobile,
                        LastUsed: true,
                        IsDefaultNumber: true
                    }]
                }
            },
            { new: true, upsert: true }
        );

        if (!updatedDriver) {
            return res.status(404).json({ message: 'Driver not found.' });
        }

        res.status(200).json({ message: 'Driver mobile number updated successfully.', driver: updatedDriver });
    } catch (error) {
        console.error('Error updating driver mobile number:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.get('/petrolPump/:parameter', async (req, res) => {
    const parameter = req.params.parameter;
    const petrolPumpPersonalRolId = '676ff0aef63b19048c04649b';

    try {
        const users = await User.find({ $or: [{ userId: { $regex: parameter, $options: 'i' } }, { phoneNumber: { $regex: parameter, $options: "i" } }, { name: { $regex: parameter, $options: "i" } }] }, 'userId name phoneNumber roles verified');

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        const bowserDrivers = users.filter(user =>
            user.verified && user.roles.some(role => role.toString() === petrolPumpPersonalRolId)
        );

        if (bowserDrivers.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.status(200).json(bowserDrivers.map(driver => ({
            name: driver.name,
            phoneNo: driver.phoneNumber
        })));
    } catch (err) {
        console.error('Error searching Petrol pumps:', err);
        console.error('Error stack:', err.stack);
        res.status(500).json({ message: 'Server error', error: err.message, stack: err.stack });
    }
})

module.exports = router;
