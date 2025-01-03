"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffProfileMapper = exports.staffMapper = void 0;
const staffMapper = (staff) => ({
    id: staff.id,
    name: staff.name,
    phone: staff.phone,
    address: staff.address,
    storeId: staff.storeId,
});
exports.staffMapper = staffMapper;
const staffProfileMapper = (staffArray) => (staffArray.map(staff => ({
    id: staff.id,
    name: staff.name,
    phone: staff.phone,
    address: staff.address,
    storeId: staff.storeId,
})));
exports.staffProfileMapper = staffProfileMapper;
