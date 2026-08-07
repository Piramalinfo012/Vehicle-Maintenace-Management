/**
 * Generates the complete ready-to-deploy Google Apps Script Code (Code.gs)
 * for initializing Google Sheets tables and deploying as a REST Web App API.
 */
export function generateGoogleAppsScriptCode(): string {
  return `/**
 * TANKER MAINTENANCE MANAGEMENT SYSTEM - GOOGLE APPS SCRIPT WEB APP API
 * Version: 2.4.0 Enterprise
 *
 * HOW TO DEPLOY:
 * 1. Open Google Sheets -> Extensions -> Apps Script
 * 2. Paste this entire code into Code.gs
 * 3. Run setupDatabaseSheets() once to automatically generate all 14 sheets and initial headers!
 * 4. Click 'Deploy' -> 'New Deployment' -> Select 'Web App'
 * 5. Set 'Execute as': 'Me'
 * 6. Set 'Who has access': 'Anyone'
 * 7. Copy the Web App URL and paste it into Tanker System -> Settings -> Google Sheets Integration
 */

var SPREADSHEET = SpreadsheetApp.getActiveSpreadsheet();

var SHEET_NAMES = [
  "Users", "Tankers", "Maintenance", "Tyres", "Battery",
  "Insurance", "Fitness", "Permit", "PUC", "Expenses",
  "Breakdown", "Documents", "Notifications", "Settings"
];

// Helper: Setup all required sheets automatically
function setupDatabaseSheets() {
  SHEET_NAMES.forEach(function(name) {
    var sheet = SPREADSHEET.getSheetByName(name);
    if (!sheet) {
      sheet = SPREADSHEET.insertSheet(name);
    }
  });

  // Populate Users header
  initSheetHeaders("Users", ["id", "name", "email", "role", "phone", "department", "status", "passwordHash", "lastLogin"]);
  // Populate Tankers header
  initSheetHeaders("Tankers", ["id", "tankerNumber", "registrationNumber", "vehicleType", "capacity", "manufacturer", "model", "engineNumber", "chassisNumber", "purchaseDate", "purchaseCost", "owner", "driver", "transporter", "currentKm", "status", "location", "remarks", "updatedAt"]);
  // Populate Maintenance header
  initSheetHeaders("Maintenance", ["id", "date", "tankerId", "tankerNumber", "currentKm", "type", "vendor", "workshop", "complaint", "workDescription", "labourCost", "materialCost", "otherCost", "totalCost", "expectedCompletion", "actualCompletion", "status", "remarks"]);
  // Populate Expenses header
  initSheetHeaders("Expenses", ["id", "date", "tankerNumber", "category", "amount", "vendor", "invoiceNumber", "description", "paidBy"]);
  // Populate Breakdown header
  initSheetHeaders("Breakdown", ["id", "date", "tankerNumber", "location", "driverName", "complaint", "status", "assignedMechanic", "estimatedCost", "finalCost", "resolvedDate", "remarks"]);
  
  Logger.log("Database sheets initialized successfully!");
}

function initSheetHeaders(sheetName, headers) {
  var sheet = SPREADSHEET.getSheetByName(sheetName);
  if (sheet && sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }
}

// GET Request Handler: Search, List, Read Records
function doGet(e) {
  var action = e.parameter.action || "ping";
  var sheetName = e.parameter.sheet;

  if (action === "ping") {
    return responseJSON({ status: "success", message: "Tanker Management Google Apps Script Web App API is Active!", version: "2.4.0" });
  }

  if (action === "readAll" && sheetName) {
    var data = getSheetDataAsJSON(sheetName);
    return responseJSON({ status: "success", count: data.length, data: data });
  }

  if (action === "search" && sheetName) {
    var query = (e.parameter.q || "").toLowerCase();
    var allData = getSheetDataAsJSON(sheetName);
    var filtered = allData.filter(function(row) {
      return JSON.stringify(row).toLowerCase().indexOf(query) !== -1;
    });
    return responseJSON({ status: "success", count: filtered.length, data: filtered });
  }

  return responseJSON({ status: "error", message: "Invalid GET Action" });
}

// POST Request Handler: Authentication, Create, Update, Delete
function doPost(e) {
  try {
    var postData = JSON.parse(e.postData.contents);
    var action = postData.action;
    var sheetName = postData.sheet;

    // Authentication Action
    if (action === "auth_login") {
      var email = postData.email;
      var password = postData.password;
      var users = getSheetDataAsJSON("Users");
      
      var foundUser = users.find(function(u) {
        return u.email && u.email.toLowerCase() === email.toLowerCase();
      });

      if (foundUser) {
        return responseJSON({
          status: "success",
          user: {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role,
            phone: foundUser.phone,
            department: foundUser.department,
            status: foundUser.status
          }
        });
      } else {
        return responseJSON({ status: "error", message: "User not found in Users sheet" });
      }
    }

    // Insert Action
    if (action === "create" && sheetName) {
      var sheet = SPREADSHEET.getSheetByName(sheetName);
      if (!sheet) {
        return responseJSON({ status: "error", message: "Sheet not found: " + sheetName });
      }
      var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      var row = [];
      headers.forEach(function(h) {
        row.push(postData.data[h] !== undefined ? postData.data[h] : "");
      });
      sheet.appendRow(row);
      return responseJSON({ status: "success", message: "Record created successfully", id: postData.data.id });
    }

    // Update Action
    if (action === "update" && sheetName) {
      var sheet = SPREADSHEET.getSheetByName(sheetName);
      var records = getSheetDataAsJSON(sheetName);
      var idToUpdate = postData.data.id;
      var rowIndex = -1;

      for (var i = 0; i < records.length; i++) {
        if (records[i].id == idToUpdate) {
          rowIndex = i + 2; // +1 for 0-index header, +1 for 1-based sheet row
          break;
        }
      }

      if (rowIndex === -1) {
        return responseJSON({ status: "error", message: "Record ID not found to update" });
      }

      var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      var rowValues = [];
      headers.forEach(function(h) {
        rowValues.push(postData.data[h] !== undefined ? postData.data[h] : records[rowIndex-2][h] || "");
      });

      sheet.getRange(rowIndex, 1, 1, headers.length).setValues([rowValues]);
      return responseJSON({ status: "success", message: "Record updated successfully" });
    }

    // Delete Action
    if (action === "delete" && sheetName) {
      var sheet = SPREADSHEET.getSheetByName(sheetName);
      var records = getSheetDataAsJSON(sheetName);
      var idToDelete = postData.id;
      var rowIndex = -1;

      for (var i = 0; i < records.length; i++) {
        if (records[i].id == idToDelete) {
          rowIndex = i + 2;
          break;
        }
      }

      if (rowIndex !== -1) {
        sheet.deleteRow(rowIndex);
        return responseJSON({ status: "success", message: "Record deleted successfully" });
      } else {
        return responseJSON({ status: "error", message: "Record ID not found to delete" });
      }
    }

    return responseJSON({ status: "error", message: "Unknown POST Action" });

  } catch (err) {
    return responseJSON({ status: "error", message: err.toString() });
  }
}

// Utility to read Sheet data and return array of JS objects
function getSheetDataAsJSON(sheetName) {
  var sheet = SPREADSHEET.getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];

  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var rows = data.slice(1);

  return rows.map(function(row) {
    var obj = {};
    headers.forEach(function(header, index) {
      obj[header] = row[index];
    });
    return obj;
  });
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
}

export const googleAppsScriptCode = generateGoogleAppsScriptCode();
