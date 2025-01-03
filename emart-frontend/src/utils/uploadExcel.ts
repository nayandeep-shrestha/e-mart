import { ProductsDataType } from '@/types';
import { message } from 'antd';
import * as ExcelJS from 'exceljs';

async function readExcelFile(file: File): Promise<ProductsDataType[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event: ProgressEvent<FileReader>) => {
      try {
        if (event.target && event.target.result) {
          const buffer = event.target.result as ArrayBuffer;
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(buffer);

          // Assuming the data is in the first sheet
          const worksheet = workbook.getWorksheet(1);
          if (!worksheet) {
            throw new Error('Worksheet not found in Excel file.');
          }

          // Convert Excel data to JSON
          const newData: any[] = [];
          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
              // Skip header row
              newData.push({
                key: rowNumber.toString(),
                product: row.getCell(1).value?.toString() || '',
                category: row.getCell(2).value?.toString() || '',
                offers: row.getCell(3).value?.toString() || '',
                code: Number(row.getCell(4).value) || 0,
                tags: row.getCell(5).value?.toString() || '',
                piece: Number(row.getCell(6).value) || 0,
                bora: Number(row.getCell(7).value) || 0,
                carton: Number(row.getCell(8).value) || 0,
                weight: Number(row.getCell(9).value) || 0,
              });
            }
          });

          message.success('File uploaded successfully.');
          resolve(newData);
        }
      } catch (error) {
        message.error('Error uploading file. Please try again.');
        reject(error);
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

export default async function uploadExcelFile(
  file: File,
): Promise<ProductsDataType[]> {
  try {
    const data = await readExcelFile(file);
    return data;
  } catch (error) {
    message.error('Error processing file. Please try again.');
    return [];
  }
}
