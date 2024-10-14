import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import FuelNotification from '@/components/FuelNotification';

const notificationsData = [
    { vehicleNumber: 'ABC123', driverId: '123', driverMobile: ['1234567890','6393440986'], driverName: 'John Doe', fuelQuantity: '10' },
    { vehicleNumber: 'DEF456', driverId: '456', driverMobile: ['9876543210'], driverName: 'Jane Doe', fuelQuantity: '20' },
    { vehicleNumber: 'DEF456', driverId: '456', driverMobile: ['9876543210'], driverName: 'Jane Doe', fuelQuantity: '20' },
    { vehicleNumber: 'DEF456', driverId: '456', driverMobile: ['9876543210'], driverName: 'Jane Doe', fuelQuantity: '20' },
    // Add more data as needed
];

export default function NotificationsScreen() {
    return (
        <ScrollView style={styles.container}>
            {notificationsData.map((data, index) => (
                <View style={{ marginBottom: 10 }} key={index}>
                    <FuelNotification {...data} />
                </View>
            ))}
          <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        paddingBottom:25,
        marginTop:40
    },
});