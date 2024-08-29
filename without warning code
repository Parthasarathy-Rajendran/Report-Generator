import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import logoImg from '../img/kyvor_logo.png'; // Adjust the path if necessary

const PharmacogenomicsTest = () => {
  const [patientDetails, setPatientDetails] = useState({
    patientID: '',
    name: '',
    age: '',
    sex: '',
  });
  const [physicianInfo, setPhysicianInfo] = useState('');
  const [specimen, setSpecimen] = useState({ type: '', date: '' });
  const [excelData, setExcelData] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');

  // Automatically set the report date to today's date
  const reportDate = new Date().toLocaleDateString();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails({ ...patientDetails, [name]: value });
  };

  const handlePhysicianChange = (e) => {
    setPhysicianInfo(e.target.value);
  };

  const handleSpecimenChange = (e) => {
    const { name, value } = e.target;
    setSpecimen({ ...specimen, [name]: value });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setExcelData(parsedData);
    };
    reader.readAsArrayBuffer(file);
  };

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const addHeader = () => {
      // Add logo
      doc.addImage(logoImg, 'PNG', 40, 14, 100, 60); // Adjust size and position as needed

      // Add MEDLYTx text
      doc.setFontSize(36);
      doc.setFont("helvetica", "bold");
      doc.setTextColor('#7c5dac');
      doc.text('MEDLY', 401, 70); // Adjust position as needed
      doc.setFont("helvetica", "bold");
      doc.setTextColor('#5f5f5e');
      doc.text('Tx', 530, 69); // Adjust position as needed

      // Draw horizontal line
      const lineY = 85;
      doc.setDrawColor('#000');
      doc.setLineWidth(0.2);
      doc.line(20, lineY, 580, lineY);
    };

    const addFooter = (pageNumber) => {
      if (pageNumber > 1) {
        const footerY = 841; // Y position for footer (adjust as needed)
        const footerHeight = 30; // Height of the footer

        // Background color
        doc.setFillColor('#e0dcdc');
        doc.rect(0, footerY - footerHeight, 600, footerHeight, 'F');

        // Text color
        doc.setFontSize(10.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor('#000');

        // Page number
        doc.text(`Page ${pageNumber}`, 20, footerY - 10);

        // Patient ID
        doc.text(`Patient ID: ${patientDetails.patientID}`, 210, footerY - 10);

        // Patient Name
        doc.text(`Patient Name: ${patientDetails.name}`, 410, footerY - 10);
      }
    };

    const addFirstPageContent = () => {
      doc.setFontSize(10);
      const backgroundColor = '#e0dcdc';
      const contentX = 30; // X position of the content area
      const contentWidth = 540; // Width of the content area
      const textHeight = 9; // Height for text areas (adjusted for smaller height)
      const borderRadius = 5; // Radius for border radius
      const margin = 10; // Margin for rectangle

      // Helper function to draw background with border radius
      const drawBackgroundRect = (yPosition, width, height) => {
        doc.setFillColor(backgroundColor);
        doc.roundedRect(contentX - margin, yPosition - margin, width + 2 * margin, height + 1.2 * margin, borderRadius, borderRadius, 'F');
      };

      // Helper function to draw a line connecting two points
      const drawConnectingLine = (x1, y1, x2, y2) => {
        doc.setDrawColor('#000');
        doc.setLineWidth(0.5);
        doc.line(x1, y1, x2, y2);
      };

      // Define text positions
      const patientInfoY = 115;
      const physicianInfoY = 140;
      const reportDateY = 140; // Align with Physician Information
      const specimenY = 165;
      const lineAfterSpecimenY = specimenY + textHeight + 10; // Position for the line after Specimen section

      // Draw background for Patient Information
      drawBackgroundRect(patientInfoY, contentWidth, textHeight);
      const patientInfo = `Patient information: ${patientDetails.patientID} | ${patientDetails.sex} | ${patientDetails.age} | ${patientDetails.name}`;
      doc.setTextColor('#000');
      doc.text(patientInfo, contentX, patientInfoY + textHeight / 3);

      // Draw background for Physician Information and Report Date
      const combinedWidth = contentWidth / 2; // Width for both texts
      const combinedHeight = textHeight; // Height for both texts
      drawBackgroundRect(physicianInfoY, combinedWidth + 100, combinedHeight); // Added 10 for spacing

      // Draw Physician Information
      const physicianInfoText = `Physician information: ${physicianInfo}`;
      doc.text(physicianInfoText, contentX, physicianInfoY + textHeight / 3);

      // Draw Report Date background with even height and border radius
      const reportDateWidth = 165; // Width of the background rectangle for Report Date
      const reportDateBackgroundY = reportDateY - 10; // Adjust Y position if needed
      const reportDateHeight = textHeight + 11; // Ensure even height
      doc.setFillColor('#d3d3d3'); // Light gray background color
      doc.roundedRect(contentX + combinedWidth + 115, reportDateBackgroundY, reportDateWidth, reportDateHeight, 5, 5, 'F'); // Added rounded borders

      // Draw Report Date text on top of background
      const reportDateText = `Report Date: ${reportDate}`;
      doc.setTextColor('#000');
      doc.text(reportDateText, contentX + combinedWidth + 137, reportDateY + textHeight / 3, { align: 'left' }); // Moved to the right

      // Draw a line connecting the Physician Information and Report Date
      drawConnectingLine(contentX + combinedWidth, physicianInfoY, contentX + combinedWidth + 10, reportDateY);

      // Draw background for Specimen
      drawBackgroundRect(specimenY, contentWidth, textHeight);
      const specimenText = `Specimen: Type - ${specimen.type} | ${specimen.date}`;
      doc.text(specimenText, contentX, specimenY + textHeight / 3);

      // Draw horizontal line after Specimen section
      doc.setDrawColor('#7c5dac'); // Line color
      doc.setLineWidth(3); // Line width
      doc.line(contentX / 1.5, lineAfterSpecimenY / .95, contentX / .7 + contentWidth, lineAfterSpecimenY / .95); // Draw line

      // Add paragraph after the horizontal line
      const paragraphY = lineAfterSpecimenY + 30; // Adjust position below the horizontal line
      const paragraph = `MEDLYTx is a molecular data analytics and simulation engine based pharmacogenomics test that explores the whole exome data of the patient’s DNA. This test demystifies the complex genomic anomalies unique to that patient and provides information about how the patient may respond to the tested drugs.`;
      doc.setFontSize(13.1);
      doc.setTextColor('#000');
      doc.setFont("helvetica", "normal")
      doc.text(paragraph, contentX / 1.5, paragraphY, { maxWidth: contentWidth / .96 }); // Added maxWidth to wrap text within the content area

      // Add content box after the paragraph
      const boxY = paragraphY + 50; // Position after paragraph
      const boxHeight = 530; // Adjust height to fit content

      // Draw rounded rectangle with border radius
      doc.setDrawColor('#000'); // Line color
      doc.setLineWidth(1);
      doc.roundedRect(contentX / 1.8, boxY, contentWidth / .95, boxHeight, 25, 25, 'S'); // Adjust coordinates and size

      // Add sample table if data is available
      if (excelData) {
        doc.autoTable({
          startY: boxY + 10,
          head: [['Drug', 'Drug Class', 'Icon', 'Type of Action', 'Recommendation']],
          body: excelData.map((row) => [
            row.drug,
            row.drug_class,
            row.icon,
            row.type_of_action,
            row.recommendation,
          ]),
          theme: 'striped',
          margin: { left: 30, right: 30 },
          styles: { fontSize: 10, cellPadding: 3 },
        });
      }
    };

    addHeader();
    addFirstPageContent();
    addFooter(1);

    // Add additional pages
    doc.addPage();
    addHeader();
    addFooter(2);

    const pdfOutput = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfOutput);
    setPdfUrl(pdfUrl);
  };

  return (
    <div>
      <h1>Pharmacogenomics Test</h1>
      <form>
        <div>
          <label>Patient ID:</label>
          <input
            type="text"
            name="patientID"
            value={patientDetails.patientID}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={patientDetails.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="text"
            name="age"
            value={patientDetails.age}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Sex:</label>
          <input
            type="text"
            name="sex"
            value={patientDetails.sex}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Physician Information:</label>
          <input
            type="text"
            value={physicianInfo}
            onChange={handlePhysicianChange}
          />
        </div>
        <div>
          <label>Specimen Type:</label>
          <input
            type="text"
            name="type"
            value={specimen.type}
            onChange={handleSpecimenChange}
          />
          <label>Specimen Date:</label>
          <input
            type="text"
            name="date"
            value={specimen.date}
            onChange={handleSpecimenChange}
          />
        </div>
        <div>
          <label>Upload Excel File:</label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
          />
        </div>
        <button type="button" onClick={generatePDF}>
          Generate PDF
        </button>
      </form>
      {pdfUrl && (
        <div>
          <h2>Preview</h2>
          <iframe
            src={pdfUrl}
            width="100%"
            height="800px"
            title="PDF Preview"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default PharmacogenomicsTest;
