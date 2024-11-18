import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text, RefreshControl } from 'react-native';
import FuelNotification from '@/components/FuelNotification';
import { FuelingOrderData } from '@/src/types/models';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useTheme } from '@react-navigation/native';

interface ServerResponse {
    orders: FuelingOrderData[];
    totalPages: number;
    currentPage: number;
}

export default function NotificationsScreen() {
    const [notificationsData, setNotificationsData] = useState<FuelingOrderData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const { colors } = useTheme();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchNotifications().then(() => setRefreshing(false));
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            setError(null);
            const userDataString = await AsyncStorage.getItem('userData');
            let userData = userDataString && JSON.parse(userDataString);
            if (!userData || !userData['User Id']) {
                throw new Error('User data not found. Please log in again.');
            }
            const url = `https://bowser-backend-2cdr.onrender.com/fuelingOrders/${userData['User Id']}`; //https://bowser-backend-2cdr.onrender.com //http://192.168.137.1:5000
            const response = await axios.get<ServerResponse>(url);
            setNotificationsData(response.data.orders);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
        }, [])
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.text }}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {notificationsData.length > 0 ? (
                notificationsData.map((data) => (
                    <View style={{ marginBottom: 10 }} key={data._id}>
                        <FuelNotification
                            vehicleNumber={data.vehicleNumber}
                            driverId={data.driverId}
                            driverMobile={data.driverMobile || ''}
                            driverName={data.driverName}
                            quantityType={data.quantityType}
                            quantity={data.fuelQuantity.toString()}
                            bowser={data.bowser}
                            orderId={data._id.toString()}
                            allocationAdmin={data.allocationAdmin || {
                                name: '',
                                id: '',
                                phoneNo: ''
                            }}
                        />
                    </View>
                ))
            ) : (
                <Text style={styles.noNotifications}>No Pending Orders Available</Text>
            )}
            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingTop: 40,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noNotifications: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
});
