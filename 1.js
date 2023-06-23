import jsPDF from "jspdf";
import "jspdf-autotable";
import Wellbeing from "./path/to/Wellbeing"; // Import the Wellbeing array

// Function to handle button click
const handleDownloadButtonClick = () => {
  // Create a new jsPDF instance
  const doc = new jsPDF();

  // Define the table data array with header row
  const tableData = [["Type", "Score"]];

  // Iterate over the Wellbeing array and populate the table data
  Wellbeing.forEach((item) => {
    const rowData = [item["Wellbeing -type"], item.Score];
    tableData.push(rowData);
  });

  // Set the table column widths (optional)
  const columnWidths = [40, 40];

  // Auto-generate the table based on the data
  doc.autoTable({
    head: tableData[0], // Table header
    body: tableData.slice(1), // Table body
    startY: 20, // Y position to start the table
    columnWidth: columnWidths, // Column widths
  });

  // Download the PDF file
  doc.save("wellbeing_report.pdf");
};


const tableData = [["Type", "Score"]]; // Initialize the tableData array with header row

// Loop through the Wellbeing array and add data rows to the tableData array
Wellbeing.forEach((item) => {
  const { Type, Score } = item;
  tableData.push([Type, Score]); // Add a row with Type and Score values
});
