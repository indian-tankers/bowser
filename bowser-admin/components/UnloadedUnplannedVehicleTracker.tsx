"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { format } from "date-fns"
import { useEffect, useMemo, useState } from "react"
import Combobox, { ComboboxOption } from "./Combobox"
import { TankersTrip, Driver, TransAppUser } from "@/types"
import { getLocalDateTimeString } from "@/utils"
import { BASE_URL } from "@/lib/api"
import { toast, Toaster } from "sonner"
import { formatDate } from "@/lib/utils"
import { SearchModal } from "./SearchModal"
import { searchItems } from "@/utils/searchUtils"
import Loading from "@/app/loading"

export default function UnloadedUnplannedVehicleTracker({ tripsData, user }: { tripsData: TankersTrip[], user: TransAppUser | null }) {
    const [loading, setLoading] = useState<boolean>(false)
    const [targetTime, setTargetTime] = useState<Date | undefined>(getLocalDateTimeString() ? new Date(getLocalDateTimeString()) : undefined)
    const [proposedDate, setProposedDate] = useState<Date | undefined>(getLocalDateTimeString() ? new Date(getLocalDateTimeString()) : undefined)
    const [odometer, setOdometer] = useState<number | undefined>(undefined)
    const [orderedBy, setOrderedBy] = useState<string>("")
    const [data, setData] = useState<TankersTrip[]>(tripsData || [])
    const [driverMobile, setDriverMobile] = useState<string>("")
    const [vehicleSearch, setVehicleSearch] = useState<string>("")
    const [tripId, setTripId] = useState<string>("")
    const [Driver, setDriver] = useState<string>("");
    const [search, setSearch] = useState<string>("")
    const [stackHolders, setStackHolders] = useState<ComboboxOption[]>([])
    const [stackHolder, setStackHolder] = useState<string>("")
    const vehicles: ComboboxOption[] = useMemo(() => {
        return data.map(trip => ({
            label: trip?.VehicleNo,
            value: trip?._id
        }));
    }, [data]);
    const [searchModalConfig, setSearchModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        items: any[];
        onSelect: (item: any) => void;
        renderItem: (item: any) => React.ReactNode;
        keyExtractor: (item: any) => string;
    }>({
        isOpen: false,
        title: "",
        items: [],
        onSelect: () => { },
        renderItem: () => null,
        keyExtractor: () => "",
    });

    const resetForm = () => {
        setTripId("");
        setDriver("");
        setDriverMobile("");
        setStackHolder("");
        setTargetTime(getLocalDateTimeString() ? new Date(getLocalDateTimeString()) : undefined);
    }

    const handleDriverSelection = (driver: Driver) => {
        setSearchModalConfig((prev) => ({ ...prev, isOpen: false }));
        if (driver) {
            setDriver(driver.Name);
        }
        if (driver.MobileNo && driver.MobileNo.length > 0) {
            const lastUsedNumber = driver.MobileNo.find(num => num.LastUsed);
            const defaultNumber = driver.MobileNo.find(num => num.IsDefaultNumber);
            const firstNumber = driver.MobileNo[0];
            const mobileNumber = (lastUsedNumber || defaultNumber || firstNumber)?.MobileNo || '';

            setDriverMobile(mobileNumber);
        } else {
            setDriverMobile('');
        }
    }

    const searchDriver = async (idNumber: string) => {
        setLoading(true);
        try {
            const drivers = await searchItems<Driver>({
                url: `${BASE_URL}/searchDriver`,
                searchTerm: idNumber,
                errorMessage: 'No driver found with the given ID'
            });
            if (drivers.length > 0) {
                setSearchModalConfig({
                    isOpen: true,
                    title: "Select a Driver",
                    items: drivers,
                    onSelect: handleDriverSelection,
                    renderItem: (driver) => `${driver.Name}, ${driver.MobileNo.find((num: { LastUsed: boolean }) => num.LastUsed)?.MobileNo || "No Last Used Mobile No."}`,
                    keyExtractor: (driver) => driver.ITPLId || driver.Name,
                });
            }
        } catch (error) {
            console.error('Error searching for driver:', error);
        } finally {
            setLoading(false);
        }
    }

    const submit = async () => {
        const url = `${BASE_URL}/trans-app/trip-update/create-empty-trip`;
        const postData = {
            vehicleNo: data.find(trip => trip?._id === tripId)?.VehicleNo,
            driverName: Driver,
            driverMobile,
            stackHolder: stackHolders.find(holder => holder.value === stackHolder)?.label,
            targetTime: targetTime?.toISOString(),
            odometer,
            orderedBy,
            previousTripId: tripId,
            StartFrom: data.find(trip => trip?._id === tripId)?.EndTo,
            division: user?.Division || "",
            proposedDate
        }
        console.log("Submitting data:", postData);
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    postData
                }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Failed to submit trip update:", errorText);
                toast.error("Failed to submit trip update: " + errorText);
                return;
            }
            toast.success("Trip update submitted successfully!");
        } catch (error) {
            console.error("Error submitting trip update:", error);
            toast.error("An error occurred while submitting the trip update.");
        }
    }

    const fetchStackHolders = async () => {
        try {
            const response = await fetch(`${BASE_URL}/trans-app/stack-holders?params=${search}`);
            const data = await response.json();
            const formattedData: ComboboxOption[] = data.map((item: { _id: string, InstitutionName: string }) => ({
                value: item._id,
                label: item.InstitutionName
            }));
            setStackHolders(formattedData);
        } catch (error) {
            console.error('Error fetching fuel providers:', error);
        }
    }

    useEffect(() => {
        fetchStackHolders();
    }, [search]);

    useEffect(() => {
        setDriver(data.find(trip => trip?._id === tripId)?.StartDriver || "");
        setOdometer(data.find(trip => trip?._id === tripId)?.TallyLoadDetail.EndOdometer || 0);
        setDriverMobile(data.find(trip => trip?._id === tripId)?.StartDriverMobile || "")
    }, [data, tripId]);

    return (
        <>
            {loading && <Loading />}
            <Toaster />
            <div className="p-4 min-h-[80svh] flex flex-col justify-center">
                <div className="flex flex-col gap-4 md:flex-row items-center justify-center md:flex-shrink-0 w-full md:justify-around">
                    {tripId &&
                        <>
                            <div className="flex flex-col gap-2 md:gap-4 w-full md:w-auto justify-start">
                                <h4 className="text-lg font-semibold">Trip Details</h4>
                                <div className="flex">
                                    <strong>Started From: </strong>{data.find(trip => trip?._id === tripId)?.StartFrom || "N/A"}
                                </div>
                                <div className="flex">
                                    <strong>Loading Date: </strong>{formatDate(String(data.find(trip => trip?._id === tripId)?.StartDate))}
                                </div>
                                <div className="flex">
                                    <strong>Unloading Factory: </strong> {data.find(trip => trip?._id === tripId)?.TallyLoadDetail.Consignee || "N/A"}
                                </div>
                                <div className="flex">
                                    <strong>Ending Location: </strong> {data.find(trip => trip?._id === tripId)?.EndTo || "N/A"}
                                </div>
                                <div className="flex">
                                    <strong>Starat Driver: </strong> {data.find(trip => trip?._id === tripId)?.StartDriver || "N/A"}
                                </div>
                            </div>
                        </>
                    }
                </div>
                <Combobox
                    className="w-full md:w-auto"
                    options={vehicles}
                    value={tripId}
                    onChange={setTripId}
                    searchTerm={vehicleSearch}
                    onSearchTermChange={setVehicleSearch}
                    placeholder="Select Vehicle"
                />
                <div className={tripId == "" ? "hidden" : ""}>
                    <Label htmlFor="driver">Driver</Label>
                    <Input
                        id="driver"
                        value={Driver}
                        onChange={(e) => {
                            const value = e.target.value;
                            setDriver(value);
                            const nativeEvent = e.nativeEvent as InputEvent;
                            if (nativeEvent.inputType === "insertText" && e.currentTarget.value.length > 3) {
                                searchDriver(value);
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Backspace") {
                                return;
                            }
                            if (e.key === 'Enter' && Driver.length > 3) {
                                e.preventDefault();
                                searchDriver(Driver);
                            }
                        }}
                        required
                    />
                    <Label htmlFor="driver-mobile">Mobile No</Label>
                    <Input
                        id="driver-mobile"
                        value={driverMobile}
                        onChange={(e) => {
                            const value = e.target.value;
                            setDriverMobile(value);
                        }}
                        required
                    />
                    <Label htmlFor="location">Destination</Label>
                    <Combobox
                        className="w-full"
                        options={stackHolders}
                        value={stackHolder}
                        onChange={setStackHolder}
                        searchTerm={search}
                        onSearchTermChange={setSearch}
                        placeholder="Select Destination"
                    />
                    <Label htmlFor="dateTime">Proposed Departure Time</Label>
                    <Input
                        id="dateTime"
                        type="datetime-local"
                        placeholder="Current Time"
                        value={proposedDate ? format(proposedDate, "yyyy-MM-dd'T'HH:mm") : ""}
                        onChange={(e) => {
                            setProposedDate(e.target.value ? new Date(e.target.value) : undefined);
                        }}
                    />
                    <Label htmlFor="dateTime">Target Reaching Time</Label>
                    <Input
                        id="dateTime"
                        type="datetime-local"
                        placeholder="Current Time"
                        value={targetTime ? format(targetTime, "yyyy-MM-dd'T'HH:mm") : ""}
                        onChange={(e) => {
                            setTargetTime(e.target.value ? new Date(e.target.value) : undefined);
                        }}
                    />
                    <Label htmlFor="odometer">Odometer</Label>
                    <Input
                        id="odometer"
                        type="number"
                        value={odometer || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setOdometer(value ? parseFloat(value) : undefined);
                        }}
                    />
                    <Label>Ordered By</Label>
                    <Input
                        id="ordered-by"
                        type="text"
                        value={orderedBy}
                        onChange={(e) => {
                            const value = e.target.value;
                            setOrderedBy(value);
                        }}
                    />
                    <div className="flex gap-2 flex-row justify-between mt-2">
                        <Button className="w-full md:w-auto" variant="secondary" type="reset" onClick={() => resetForm()}>Reset</Button>
                        <Button className="w-full md:w-auto" type="button" onClick={() => submit()}>Submit</Button>
                    </div>
                </div>
            </div>

            <SearchModal
                isOpen={searchModalConfig.isOpen}
                onClose={() => setSearchModalConfig((prev) => ({ ...prev, isOpen: false }))}
                title={searchModalConfig.title}
                items={searchModalConfig.items}
                onSelect={searchModalConfig.onSelect}
                renderItem={searchModalConfig.renderItem}
                keyExtractor={searchModalConfig.keyExtractor}
            />
        </>
    )
}
