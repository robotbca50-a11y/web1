// 09-gsheets.js - Google Sheets specific functions and features
module.exports = function(add) {

// Sheets-specific Functions (10 entries)
add('sheets_query', `QUERY: =QUERY(A1:D100,"SELECT A,B WHERE C>1000 ORDER BY B DESC",1). SQL-like for sheets. Labels: =QUERY(A:D,"SELECT A, SUM(C) GROUP BY A LABEL SUM(C) 'Total'",1). Pivot: =QUERY(A:D,"SELECT A, SUM(C) PIVOT B",1). Very powerful.`, 'gsheets');
add('sheets_importhtml', `IMPORTHTML: =IMPORTHTML("https://en.wikipedia.org/wiki/HTML","table",1) import 1st table. =IMPORTHTML(url,"list",2) 2nd list. IMPORTXML: =IMPORTXML(url,"//div[@class='content']") XPath. IMPORTDATA: =IMPORTDATA(url) CSV/TSV. ImportFunction.`, 'gsheets');
add('sheets_importrange', `IMPORTRANGE: =IMPORTRANGE("spreadsheet_url","Sheet1!A1:D100") import from another sheet. First time needs permission grant. =IMPORTRANGE("url","SELECT A,B WHERE C>100") with QUERY. Cached: wrap in IF for control.`, 'gsheets');
add('sheets_filter', `FILTER: =FILTER(A:C,B:B="Sales",C:C>1000). Multiple conditions with AND (*). OR (+). No match: =FILTER(A:C,B:B="X","No data"). =FILTER(A:A,B:B<>"") remove blanks. Dynamic, spills. Combine with SORT.`, 'gsheets');
add('sheets_unique', `UNIQUE: =UNIQUE(A1:A100) distinct values. =UNIQUE(A1:C100) unique rows. =UNIQUE(A1:A100,,1) unique by first column only. =COUNTA(UNIQUE(A1:A100)) count distinct. Dynamic array.`, 'gsheets');
add('sheets_sort', `SORT: =SORT(A1:D100,3,-1) by column 3 desc. =SORT(A1:D100,2,1,4,-1) multi-level. =SORT(FILTER(A:D,B:B="Sales"),2,-1) combined. Dynamic. INDEX/MATCH alternative for one-cell lookups.`, 'gsheets');
add('sheets_formulas_text', `Sheets TEXT: =REGEXMATCH(A1,"\\d+") contains digits. =REGEXEXTRACT(A1,"(\\d+)-(\\d+)") capture groups. =REGEXREPLACE(A1,"\\s+"," ") normalize spaces. =SPLIT(A1,",") split to columns. =JOIN(",",A1:A10) join.`, 'gsheets');
add('sheets_google', `Google Functions: =GMAILPARSE(email) parse Gmail. =GOOGLEFINANCE("NASDAQ:GOOG") stock price. =GOOGLEFINANCE("USD","SGD") exchange rate. =GOOGLEFINANCE("TICKER","price",DATE(2024,1,1)) historical. =SPARKLINE(data) inline chart.`, 'gsheets');
add('sheets_array', `ARRAYFORMULA: =ARRAYFORMULA(A1:A10*B1:B10) apply to entire column. =ARRAYFORMULA(IF(A:A<>"",A:A*2,"")) conditional array. Enables single formula for entire column. No need to copy down. =ArrayFormula(VLOOKUP(A:A,Sheet2!A:B,2,FALSE)).`, 'gsheets');
add('sheets_indirect', `INDIRECT: =INDIRECT("A"&B1) dynamic. =INDIRECT("Sheet"&C1&"!A1") dynamic sheet. =INDIRECT("R"&ROW()&"C"&COLUMN(),FALSE) R1C1. Used with Data Validation for dependent dropdowns. Volatile.`, 'gsheets');

// Sheets Features (8 entries)
add('sheets_named_range', `Named Ranges: Data→Named ranges. =SUM(SalesColumn) readable. Scope: sheet or workbook. Dynamic: =OFFSET(Sheet1!$A$1,0,0,COUNTA(Sheet1!$A:$A),1). Use in formulas, validation, IMPORTRANGE. Manage via Data menu.`, 'gsheets');
add('sheets_data_validation', `Data Validation: Data→Data validation. List from range: =INDIRECT("dropdowns!A"&ROW()) dependent dropdowns. Custom formula: =LEN(A1)<=50. Date, number, checkbox. Show warning or reject input. Chip view for lists.`, 'gsheets');
add('sheets_condformat', `Conditional Formatting: Format→Conditional formatting. Color scales, data bars. Custom formula: =A1>TODAY() highlight dates. Is text contains, date before/after. Multiple rules with priority. Copy-paste formatting.`, 'gsheets');
add('sheets_pivot', `Insert→Pivot table. Rows: categories. Columns: breakdown. Values: SUM, COUNT, AVERAGE. Filters: slicers. Group dates by month/quarter/year. Calculated fields. Refresh on edit. Separate sheet or same sheet.`, 'gsheets');
add('sheets_scripts', `Google Apps Script: function onEdit(e) spreadsheet Trigger. SpreadsheetApp.getActive(). getSheetByName("Sheet1"). getRange("A1").setValue("Hello"). setFormulas(). showDialog(). createTextFile(). Automation and customization.`, 'gsheets');
add('sheets_importxml', `IMPORTXML: =IMPORTXML("url","//div[@class='content']"). XPath queries. Scrape specific elements. //tag for all, //tag[@attr='val'] filtered. Can be slow. IMPORTHTML for tables/lists. IMPORTDATA for raw CSV. Watch for rate limits.`, 'gsheets');
add('sheets_chart', `Insert→Chart. Line, bar, pie, scatter, area. Customize: titles, colors, series. Trendline: linear, exponential. Chart from existing data. Dashboard: multiple charts on one sheet. Publish chart to web.`, 'gsheets');
add('sheets_protection', `Protect Sheets: Data→Protect sheets and ranges. Protect range: specific cells. Protect sheet: entire sheet. Hide formulas. Allow editing only certain ranges. Sheet protection with password. Share with view-only.`, 'gsheets');
};
