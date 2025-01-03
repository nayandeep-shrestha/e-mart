import { StaffQueryResponse, StaffResponse } from "../models/staff.model";

export const staffMapper = (staff:StaffQueryResponse) : StaffResponse => ({
    id: staff.id,
    name: staff.name,
    phone: staff.phone,
    address: staff.address,
    storeId: staff.storeId,
})

export const staffProfileMapper = (staffArray: StaffQueryResponse[]) : StaffResponse[] => (
    staffArray.map(staff => ({
        id: staff.id,
        name: staff.name,
        phone: staff.phone,
        address: staff.address,
        storeId: staff.storeId,
    }))
)