import { ProductsDataType } from '@/types';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default async function exportToExcel(
  data: ProductsDataType[],
  fileName: string,
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');
  // Assuming data is an array of objects where keys are column names
  if (data.length > 0) {
    const columns = Object.keys(data[0]).map((key) => ({ header: key, key }));
    worksheet.columns = columns;

    data.forEach((item) => {
      worksheet.addRow(item);
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  saveAs(blob, `${fileName}.xlsx`);
}
