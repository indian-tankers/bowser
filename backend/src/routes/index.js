const express = require('express');
const router = express.Router();

const allocateFuelingRoutes = require('./addFuelingAllocation');
const authRoutes = require('./auth');
const attatchedRoutes = require('./attatched');
const bowserAdminAuth = require('./bowserAdminAuth');
const fuelingOrdersRoutes = require('./fuelingOrders');
const fuelrequestRoutes = require('./fuelRequest');
const fuelingTransactionRouts = require('./addFuelingTransaction');
const listAllocations = require('./listAllocations');
const listDispensesRouts = require('./listDispenses');
const loadingOrder = require('./loading');
const locationUpdate = require('./locationUpdate');
const notificationsRoutes = require('./notifications');
const petrolPump = require('./petrolPump');
const roleRoutes = require('./roles');
const reportRoutes = require('./report');
const saleryCalc = require('./salery-calc');
const searchBowserRoutes = require('./searchBowserDetails');
const searchDriverRoutes = require('./searchDriver');
const searchVehicleNumberRoutes = require('./searchVehicleNumber');
const test = require('./test');
const tripSheetRoutes = require('./tripSheet');
const updateRoutes = require('./updates');
const userRoutes = require('./users');
const bowserRoutes = require('./bowsers');
const vehicleRoutes = require('./vehicle')
const vehicleDriverAuth = require('./vehicleDriversAuth')

router.get('/', (req, res) => {
    res.send('landing page');
});

router.use('/addFuelingTransaction', fuelingTransactionRouts);
router.use('/allocateFueling', allocateFuelingRoutes);
router.use('/auth', authRoutes);
router.use('/attatched', attatchedRoutes);
router.use('/auth/admin', bowserAdminAuth);
router.use('/fuelingOrders', fuelingOrdersRoutes);
router.use('/fuel-request', fuelrequestRoutes);
router.use('/listAllocations', listAllocations);
router.use('/listDispenses', listDispensesRouts);
router.use('/loading', loadingOrder);
router.use('/location', locationUpdate);
router.use('/notifications', notificationsRoutes);
router.use('/petrol-pump', petrolPump);
router.use('/roles', roleRoutes);
router.use('/reports', reportRoutes);
router.use('/salery-calc', saleryCalc);
router.use('/searchBowserDetails', searchBowserRoutes);
router.use('/searchDriver', searchDriverRoutes);
router.use('/searchVehicleNumber', searchVehicleNumberRoutes);
router.use('/test', test);
router.use('/tripSheet', tripSheetRoutes);
router.use('/users', userRoutes);
router.use('/bowsers', bowserRoutes);
router.use('/updates', updateRoutes);
router.use('/vehicle', vehicleRoutes);
router.use('/auth/driver', vehicleDriverAuth);

module.exports = router;
