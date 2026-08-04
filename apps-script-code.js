/**
 * Google Apps Script for Client Reviews Database
 *
 * Setup Instructions:
 * 1. Open Google Sheets and create a new spreadsheet (or open an existing one).
 * 2. Rename the active sheet tab to 'Reviews'.
 * 3. Set the column headers in Row 1 as follows:
 *    - Column A: Token
 *    - Column B: Name
 *    - Column C: Company
 *    - Column D: Role
 *    - Column E: Rating
 *    - Column F: ReviewText
 *    - Column G: Date
 *    - Column H: Status
 * 4. Open Extensions -> Apps Script.
 * 5. Replace all code in Code.gs with the contents of this file.
 * 6. Click Deploy -> New deployment.
 * 7. Select type: Web app.
 * 8. Set 'Execute as': Me.
 * 9. Set 'Who has access': Anyone.
 * 10. Click Deploy, authorize permissions, and copy the Web App URL.
 *
 * Note on CORS:
 * Google Apps Script ContentService automatically returns Access-Control-Allow-Origin: *
 * for Web Apps configured with access 'Anyone'.
 */

// Constant defining the sheet name used for storing reviews
var SHEET_NAME = 'Reviews';

/**
 * Helper function to retrieve or initialize the 'Reviews' sheet.
 * Returns the Sheet object.
 */
function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Token', 'Name', 'Company', 'Role', 'Rating', 'ReviewText', 'Date', 'Status']);
  }
  return sheet;
}

/**
 * Helper function to construct a JSON ContentService response.
 * Google Apps Script automatically appends Access-Control-Allow-Origin: * headers.
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handles HTTP GET requests to the Web App.
 *
 * Supported Actions:
 * - action=getReviews:
 *   Returns JSON array of all review records where Status='approved'.
 *
 * - action=validateToken&token=YOUR_TOKEN:
 *   Checks if token exists in Column A and Status is empty (unused).
 *   Returns { valid: true } or { valid: false }.
 */
function doGet(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var action = params.action;

    if (action === 'getReviews') {
      return getApprovedReviews();
    } else if (action === 'validateToken' && params.token) {
      return validateTokenResponse(params.token);
    } else {
      return createJsonResponse({ error: 'Invalid action or missing parameters' });
    }
  } catch (err) {
    return createJsonResponse({ error: err.toString() });
  }
}

/**
 * Fetches all rows where Column H (Status) is 'approved'.
 * Returns array of review objects.
 */
function getApprovedReviews() {
  var sheet = getSheet();
  var data = sheet.getDataRange().getValues();
  var reviews = [];

  // Iterate starting from row index 1 to skip header row
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var token = row[0];
    var name = row[1];
    var company = row[2];
    var role = row[3];
    var rating = row[4];
    var reviewText = row[5];
    var date = row[6];
    var status = row[7];

    if (String(status).toLowerCase() === 'approved') {
      reviews.push({
        token: String(token),
        name: String(name),
        company: String(company),
        role: String(role),
        rating: Number(rating),
        review: String(reviewText),
        date: String(date)
      });
    }
  }

  return createJsonResponse(reviews);
}

/**
 * Validates whether a token exists in Column A and has not been used (Status is empty).
 */
function validateTokenResponse(token) {
  var isValid = checkTokenValid(token);
  return createJsonResponse({ valid: isValid });
}

/**
 * Core helper to verify token status.
 */
function checkTokenValid(token) {
  if (!token) return false;
  var sheet = getSheet();
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    var rowToken = String(data[i][0]).trim();
    var rowStatus = String(data[i][7]).trim();

    if (rowToken === String(token).trim()) {
      // Token is valid only if Status is blank/empty
      return rowStatus === '';
    }
  }
  return false;
}

/**
 * Handles HTTP POST requests to submit a client review.
 * Expects JSON payload with: token, name, company, role, rating, review.
 *
 * Behavior:
 * - Validates token exists in Column A and Status is empty.
 * - If valid: populates row data (B..H), sets Status='pending', returns { success: true }.
 * - If invalid or used: returns { success: false, error: 'Invalid or used token' }.
 */
function doPost(e) {
  try {
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    var token = payload.token;
    var name = payload.name;
    var company = payload.company;
    var role = payload.role;
    var rating = payload.rating;
    var review = payload.review;

    if (!token) {
      return createJsonResponse({ success: false, error: 'Token is required' });
    }

    var sheet = getSheet();
    var data = sheet.getDataRange().getValues();
    var targetRowIndex = -1;

    for (var i = 1; i < data.length; i++) {
      var rowToken = String(data[i][0]).trim();
      var rowStatus = String(data[i][7]).trim();

      if (rowToken === String(token).trim()) {
        if (rowStatus === '') {
          targetRowIndex = i + 1; // 1-based row index for sheet range operations
        }
        break;
      }
    }

    if (targetRowIndex === -1) {
      return createJsonResponse({ success: false, error: 'Invalid or used token' });
    }

    var currentDate = new Date().toISOString().split('T')[0];

    // Write values to target row: B=Name, C=Company, D=Role, E=Rating, F=ReviewText, G=Date, H=Status
    sheet.getRange(targetRowIndex, 2).setValue(name || '');
    sheet.getRange(targetRowIndex, 3).setValue(company || '');
    sheet.getRange(targetRowIndex, 4).setValue(role || '');
    sheet.getRange(targetRowIndex, 5).setValue(Number(rating) || 5);
    sheet.getRange(targetRowIndex, 6).setValue(review || '');
    sheet.getRange(targetRowIndex, 7).setValue(currentDate);
    sheet.getRange(targetRowIndex, 8).setValue('pending');

    return createJsonResponse({ success: true });
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}
