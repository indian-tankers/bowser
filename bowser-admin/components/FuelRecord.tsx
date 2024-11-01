import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
// import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, User, Fuel, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import { DispensesRecord } from '@/types';
import Modal from './Modal';

interface FuelRecordCardProps {
    record?: DispensesRecord;
}

const FuelRecordCard: React.FC<FuelRecordCardProps> = ({ record }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (!record) {
        return <p className="text-center text-gray-500">Loading record...</p>;
    }

    // Function to handle image click
    const openImageModal = (image: string) => {
        setSelectedImage(image);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
    };

    return (
        <Card className="p-4 shadow-lg">
            {/* Header */}
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Driver: {record?.driverName}</span>
                    {record?.verified ? (
                        <Badge variant="default" className="ml-2 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" /> Verified
                        </Badge>
                    ) : (
                        <Badge variant="destructive" className="ml-2 flex items-center">
                            <XCircle className="w-4 h-4 mr-1" /> Not Verified
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>

            {/* Content */}
            <CardContent>
                <div className="mb-4">
                    <h2 className="text-md font-semibold">Vehicle Details</h2>
                    <p className="text-sm text-gray-600"><strong>Number Plate:</strong> {record?.vehicleNumber}</p>
                    <div className="flex space-x-4 mt-2">
                        <img className="w-32 h-32 object-cover rounded-md" src={`${record?.vehicleNumberPlateImage}`} alt="Vehicle Plate"
                            onClick={() => openImageModal(record.vehicleNumberPlateImage)}
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <h2 className="text-md font-semibold">Fueling Details</h2>
                    <p className="text-sm text-gray-600"><strong>Quantity:</strong> {record?.fuelQuantity} liters - {record?.quantityType}</p>
                    <p className="text-sm text-gray-600"><strong>Date & Time:</strong> {record?.fuelingDateTime}</p>
                </div>

                <div className="mb-4">
                    <h2 className="text-md font-semibold">Bowser Details</h2>
                    <p className="text-sm text-gray-600"><strong>Registration Number:</strong> {record?.bowser.regNo || "Not Registered"}</p>
                    <p className="text-sm text-gray-600"><strong>Driver:</strong> {record?.bowser.driver.name}</p>
                    <p className="text-sm text-gray-600"><strong>Phone:</strong> {record?.bowser.driver.phoneNo}</p>
                </div>

                <div className="mb-4">
                    <h2 className="text-md font-semibold">Location</h2>
                    <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" /> {record?.gpsLocation}
                    </p>
                </div>

                <div className="flex space-x-4">
                    <div>
                        <h2 className="text-md font-semibold">Fuel Meter Image</h2>
                        <img
                            src={record?.fuelMeterImage}
                            alt="Fuel Meter"
                            className="w-32 h-32 object-cover rounded-md"
                            onClick={() => openImageModal(record.fuelMeterImage)}
                        />
                    </div>
                    <div>
                        <h2 className="text-md font-semibold">Slip Image</h2>
                        <img
                            src={record?.slipImage}
                            alt="Slip"
                            className="w-32 h-32 object-cover rounded-md"
                            onClick={() => openImageModal(record.slipImage)}
                        />
                    </div>
                </div>
            </CardContent>

            {/* Footer */}
            <CardFooter className="mt-4">
                <p className="text-sm text-gray-500">Order ID: {String(record?.orderId)}</p>
                <p className="text-sm text-gray-500">Admin: {String(record?.allocationAdmin?.name) || 'N/A'}</p>
            </CardFooter>
            {/* Modal for Image */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {selectedImage && (
                    <img
                        src={selectedImage}
                        alt="Enlarged"
                        className="w-full h-auto object-contain"
                    />
                )}
            </Modal>
        </Card>
    );
};

export default FuelRecordCard;
