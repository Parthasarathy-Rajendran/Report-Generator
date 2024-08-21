import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // For table generation in PDF

const ReportGenerator = () => {
  const [patientInfo, setPatientInfo] = useState({
    id: '',
    sex: '',
    age: '',
    name: ''
  });
  const [file, setFile] = useState(null);

  const handleInputChange = (e) => {
    setPatientInfo({
      ...patientInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Process jsonData and generate the report
        generateReport(jsonData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const generateReport = (data) => {
    const doc = new jsPDF();
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const startY = 20; // Initial vertical position

    // Add patient information
    doc.setFontSize(12);
    doc.text(`Patient ID: ${patientInfo.id}`, margin, startY);
    doc.text(`Name: ${patientInfo.name}`, margin, startY + 10);
    doc.text(`Sex: ${patientInfo.sex}`, margin, startY + 20);
    doc.text(`Age: ${patientInfo.age}`, margin, startY + 30);

    // Add a line separator
    doc.setLineWidth(0.5);
    doc.line(margin, startY + 35, pageWidth - margin, startY + 35);

    // Add data from the Excel file as a table
    if (data.length > 0) {
      const columns = Object.keys(data[0]).map(key => ({ header: key, dataKey: key }));
      const rows = data.map(item => ({ ...item }));

      doc.autoTable({
        startY: startY + 40, // Start after the patient information and separator
        columns,
        body: rows,
        margin: { left: margin, right: margin },
        styles: { fontSize: 10 },
        headStyles: { fillColor: [22, 160, 133] }, // Header background color
        alternateRowStyles: { fillColor: [240, 240, 240] }, // Alternating row background color
      });
    } else {
      doc.text('No data available in the Excel file.', margin, startY + 40);
    }

    // Save the PDF
    doc.save(`Report_${patientInfo.id}_${patientInfo.name}.pdf`);
  };

  return (
    <div className="report-generator">
      <h2>Generate Patient Report</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Patient ID:</label>
          <input
            type="text"
            name="id"
            value={patientInfo.id}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={patientInfo.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Sex:</label>
          <input
            type="text"
            name="sex"
            value={patientInfo.sex}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Age:</label>
          <input
            type="text"
            name="age"
            value={patientInfo.age}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Upload Excel File:</label>
          <input type="file" accept=".xlsx" onChange={handleFileChange} required />
        </div>
        <button type="submit">Generate Report</button>
      </form>
    </div>
  );
};

export default ReportGenerator;
