import { BASE_URL } from "@/lib/api";

export const updateDriverMobile = async (driverId: string, driverMobile: string) => {
    try {
        const response = await fetch(`${BASE_URL}/searchDriver/updateDriverMobile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ driverId, driverMobile }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update driver mobile number: ${response.status}`);
        }

        const result = await response.json();
        return result.message;
    } catch (error) {
        console.error('Error updating driver mobile number:', error);
        throw error;
    }
};

export const updateTripDriver = async (vehicleNo: string, driver: string) => {
    try {
        const response = await fetch(`${BASE_URL}/allocateFueling/updateTripDriver`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ vehicleNo, driver }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update trip details: ${response.status}`);
        } else {
            const result = await response.json();
            return result.message;
        }
    } catch (error) {
        console.error('Error trip details:', error);
        throw error;
    }
}

export const getLocalDateTimeString = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
};

export const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
};