// 08-excel.js - Comprehensive Excel formulas and functions
module.exports = function(add) {

// Lookup & Reference (8 entries)
add('excel_vlookup', `VLOOKUP: VLOOKUP(lookup_value,table_array,col_index,[range_lookup]). Example: =VLOOKUP(A2,Sheet2!A:D,3,FALSE) find value in column A, return column C. FALSE=exact match. TRUE=approximate (sorted). #N/A if not found. Wrap with IFERROR.`, 'excel');
add('excel_hlookup', `HLOOKUP: HLOOKUP(lookup_value,table_array,row_index,[range_lookup]). Same as VLOOKUP but horizontal. =HLOOKUP("Q1",A1:D3,2,FALSE) find in row 1, return row 2. Less common than VLOOKUP.`, 'excel');
add('excel_index', `INDEX-MATCH: =INDEX(return_range,MATCH(lookup_value,lookup_range,0)). More flexible than VLOOKUP. Can look left. =INDEX(C:C,MATCH(A2,A:A,0)). MATCH returns row number. 0=exact, 1=less than, -1=greater than.`, 'excel');
add('excel_xlookup', `XLOOKUP: =XLOOKUP(lookup_value,lookup_array,return_array,[not_found],[match_mode],[search_mode]). Modern replacement for VLOOKUP. Searches any direction. Handles errors built-in: ,0). Supports wildcards: match_mode 2.`, 'excel');
add('excel_indirect', `INDIRECT: =INDIRECT("A"&B1) dynamic reference. =INDIRECT("Sheet"&A1&"!B2"). Useful for dropdown that changes sheet reference. =INDIRECT("R1C1",FALSE) R1C1 notation. Volatile function (recalculates every time).`, 'excel');
add('excel_offset', `OFFSET: =OFFSET(start_row,start_cols,height,width). Dynamic range: =COUNTA(OFFSET(A1,0,0,COUNTA(A:A),1)) count non-empty. =SUM(OFFSET(A1,0,0,10,1)) sum first 10 rows. Volatile. Use in charts for dynamic data.`, 'excel');
add('excel_choose', `CHOOSE: =CHOOSE(index,val1,val2,val3). =CHOOSE(MONTH(A1),"Jan","Feb",...) month to name. =CHOOSE(RANDBETWEEN(1,3),"A","B","C") random pick. Like a switch statement. Index must be 1-254.`, 'excel');
add('excel_address', `ADDRESS & INDIRECT: =ADDRESS(3,2) returns "$B$3". =ADDRESS(3,2,4) relative "B3". =ADDRESS(3,2,1,FALSE,"Sheet2") "Sheet2!$B$3". Combine with INDIRECT for dynamic multi-sheet references.`, 'excel');

// Text Functions (10 entries)
add('excel_concat', `Text Join: =CONCATENATE(A1," ",B1) or =A1&" "&B1. =TEXTJOIN(", ",TRUE,A1:A10) join with delimiter, TRUE=ignore empty. =CONCAT(A1:A10) no delimiter. & is simplest for few cells. CONCATENATE is legacy.`, 'excel');
add('excel_left', `LEFT/RIGHT/MID: =LEFT(A1,3) first 3 chars. =RIGHT(A1,4) last 4 chars. =MID(A1,2,5) start at 2, length 5. =LEFT(A1,FIND("@",A1)-1) extract username from email. Combine with FIND/SEARCH for dynamic extraction.`, 'excel');
add('excel_find', `FIND/SEARCH: =FIND("@",A1) position of @. FIND is case-sensitive. =SEARCH("@",A1) case-insensitive. =SEARCH("?",A1) wildcard ? single char. Returns #VALUE! if not found. Use with IFERROR for safety.`, 'excel');
add('excel SUBSTITUTE', `SUBSTITUTE: =SUBSTITUTE(A1,"old","new") replace all. =SUBSTITUTE(A1,"old","new",1) replace first only. =SUBSTITUTE(A1," ","") remove spaces. =SUBSTITUTE(A1,".",",") replace dots with commas. Case-sensitive.`, 'excel');
add('excel_text', `TEXT: =TEXT(A1,"0.00") format number. =TEXT(A1,"#,##0") comma separator. =TEXT(A1,"0.0%") percentage. =TEXT(A1,"yyyy-mm-dd") date format. =TEXT(A1,"$#,##0.00") currency. Custom formatting codes.`, 'excel');
add('excel_trim', `TRIM & CLEAN: =TRIM(A1) remove extra spaces. =CLEAN(A1) remove non-printable characters. =SUBSTITUTE(TRIM(A1)," "," ") double spaces. Nested: =TRIM(CLEAN(SUBSTITUTE(A1,CHAR(160)," "))) full cleanup.`, 'excel');
add('excel_len', `LEN: =LEN(A1) character count. =LEN(TRIM(A1)) without spaces. =LEN(A1)-LEN(SUBSTITUTE(A1," ",""))+1 count words (by spaces). Useful for validation, data cleaning, text analysis.`, 'excel');
add('excel_proper', `Case Functions: =PROPER(A1) Title Case "hello world"→"Hello World". =UPPER(A1) ALL CAPS. =LOWER(a1) all lowercase. =EXACT(A1,B1) case-sensitive compare TRUE/FALSE. =T(A1) convert to text.`, 'excel');
add('excel_value', `VALUE & NUMBERVALUE: =VALUE(A1) text to number "123"→123. =NUMBERVALUE(A1) handles locale decimal. =A1*1 implicit conversion. =ISNUMBER(A1) check if number. =ISTEXT(A1) check if text.`, 'excel');
add('excel_rept', `REPT: =REPT("★",5) "★★★★★". =REPT(A1,3) repeat text 3 times. Data bars in cells: =REPT("█",A1/10). =REPT(" ",10-LEN(A1))&A1 right-align with padding.`, 'excel');

// Math & Statistics (10 entries)
add('excel_sumif', `SUMIF: =SUMIF(A:A,"Sales",B:B) sum B where A="Sales". =SUMIF(A:A,">"&100,B:B) sum B where A>100. SUMIFS multiple: =SUMIFS(B:B,A:A,"Sales",C:C,"Jan") sum B where A=Sales AND C=Jan. Criteria: <,>,<>,=.`, 'excel');
add('excel_countif', `COUNTIF: =COUNTIF(A:A,"Apple") count Apple. =COUNTIF(A:A,">"&100) count >100. =COUNTIF(A:A,"*") count non-empty. =COUNTIF(A:A,"<>") same. COUNTIFS: =COUNTIFS(A:A,"Sales",B:B,">"&1000). Multiple criteria.`, 'excel');
add('excel_averageif', `AVERAGEIF: =AVERAGEIF(A:A,"Sales",B:B) average B where A=Sales. AVERAGEIFS: =AVERAGEIFS(B:B,A:A,"Sales",C:C,">"&50). =AVERAGE(A1:A10) simple average. =AVERAGEIF(B:B,">"&0) average positive values.`, 'excel');
add('excel_if', `IF: =IF(A1>100,"High","Low"). Nested: =IF(A1>100,"High",IF(A1>50,"Medium","Low")). IFERROR: =IFERROR(A1/B1,0) handle errors. IFS: =IFS(A1>100,"High",A1>50,"Med",TRUE,"Low"). IF with AND/OR: =IF(AND(A1>0,B1>0),"Both +","").`, 'excel');
add('excel_round', `Rounding: =ROUND(A1,2) 2 decimal places. =ROUND(A1,-1) round to 10s. =ROUNDUP(A1,0) always up. =ROUNDDOWN(A1,0) always down. =MROUND(A1,5) round to multiple. =INT(A1) integer. =TRUNC(A1,2) truncate.`, 'excel');
add('excel_rand', `Random: =RAND() 0 to 1. =RANDBETWEEN(1,100) integer 1-100. Randomly assign: =INDEX({"A","B","C"},RANDBETWEEN(1,3)). Random sample: add RAND column, sort by it. Volatile, recalculates each change.`, 'excel');
add('excel_sumproduct', `SUMPRODUCT: =SUMPRODUCT(A1:A10,B1:B10) sum of products. =SUMPRODUCT((A1:A10="Sales")*B1:B10) conditional sum. =SUMPRODUCT((A1:A10>100)*(B1:B10="Jan")*C1:C10) multiple conditions. Powerful array-like.`, 'excel');
add('excel_subtotal', `SUBTOTAL: =SUBTOTAL(9,A1:A10) SUM ignoring filtered rows. Function numbers: 1=AVERAGE, 2=COUNT, 3=COUNTA, 4=MAX, 5=MIN, 6=PRODUCT, 7=STDEV, 8=STDEVP, 9=SUM, 10=VAR. Ignores other SUBTOTAL.`, 'excel');
add('excel_abs', `ABS: =ABS(A1) absolute value |A1|. =ABS(A1-B1) distance between values. =ABS(PI())=3.14159... Use in differences, tolerances, error calculations. Simple but frequently needed.`, 'excel');
add('excel_sumifs_advanced', `SUMIFS Advanced: Date ranges: =SUMIFS(B:B,A:A,">="&DATE(2024,1,1),A:A,"<"&DATE(2025,1,1)). Wildcard: =SUMIFS(B:B,A:A,"*App*") partial match. Multiple OR: =SUMPRODUCT((A:A="X")+(A:A="Y"))*B:B).`, 'excel');

// Date & Time (8 entries)
add('excel_date', `DATE Functions: =DATE(2024,1,15) create date. =TODAY() current date. =NOW() current datetime. =YEAR(A1) extract year. =MONTH(A1), =DAY(A1). =EDATE(A1,3) date + 3 months. =EOMONTH(A1,0) end of month. =DATEDIF(A1,B1,"D") days between.`, 'excel');
add('excel_networkdays', `NETWORKDAYS: =NETWORKDAYS(A1,B1) working days between. =NETWORKDAYS(A1,B1,A2:A10) excluding holidays. =WORKDAY(A1,10) date + 10 working days. Weekend: Saturday+Sunday by default.`, 'excel');
add('excel_weekday', `WEEKDAY: =WEEKDAY(A1) 1=Sun 7=Sat. =WEEKDAY(A1,2) 1=Mon 7=Sun (ISO). =WEEKNUM(A1) week number 1-52. =ISOWEEKNUM(A1) ISO week. Format: =TEXT(A1,"dddd") full day name.`, 'excel');
add('excel_datevalue', `DATEVALUE: =DATEVALUE("2024-01-15") text to date. =TIMEVALUE("14:30") text to time. Useful for importing dates from CSV. =YEAR(DATEVALUE(A1)) extract from text date. Handles common date formats.`, 'excel');
add('excel_time', `TIME Functions: =TIME(14,30,0) create 2:30 PM. =HOUR(A1), =MINUTE(A1), =SECOND(A1). =TIMEVALUE("14:30") text to decimal. Decimal time: 0.5=12:00 PM. =NOW()-TODAY() time portion only. Formatting: h:mm AM/PM.`, 'excel');
add('excel_datedif', `DATEDIF: =DATEDIF(A1,B1,"D") days. =DATEDIF(A1,B1,"M") months. =DATEDIF(A1,B1,"Y") years. =DATEDIF(A1,B1,"YM") months ignoring years. =DATEDIF(A1,B1,"YD") days ignoring years. Undocumented but useful.`, 'excel');
add('excel_days', `DAYS: =DAYS(B1,A1) days between (end,start). =YEARFRAC(A1,B1) fractional years. =DAYS360(A1,B1) 30/360 day count (financial). =MONTH(B1)-MONTH(A1) month difference. Year frac useful for interest calculations.`, 'excel');
add('excel_eodate', `EDATE & EOMONTH: =EDATE(A1,1) same day next month. =EDATE(A1,-3) 3 months ago. =EOMONTH(A1,0) last day this month. =EOMONTH(A1,1) last day next month. Excellent for deadline calculations.`, 'excel');

// Logical & Reference (6 entries)
add('excel_and_or', `AND/OR: =AND(A1>0,B1>0) TRUE if both true. =OR(A1="X",A1="Y") TRUE if either. Combined: =IF(AND(A1>0,B1>100,C1="Yes"),"Pass","Fail"). Nested: =IF(OR(AND(A1>10,B1="A"),C1>50),"OK","").`, 'excel');
add('excel_switch', `SWITCH: =SWITCH(A1,"A","Apple","B","Banana","C","Cherry","Unknown"). Compare one value to many. Cleaner than nested IF for equality checks. Default at end. =SWITCH(WEEKDAY(A1),1,"Sun",7,"Sat","Weekday").`, 'excel');
add('excel_true_false', `TRUE/FALSE: =A1>100 returns TRUE/FALSE. =NOT(A1>100) invert. Boolean arithmetic: TRUE=1, FALSE=0. =SUMPRODUCT((A1:A10>100)*(B1:B10="X")) count both conditions. Logical tests in IF, AND, OR.`, 'excel');
add('excel_array', `Array Formulas: =SUM(A1:A10*B1:B10) Ctrl+Shift+Enter (legacy). =SUMPRODUCT(A1:A10,B1:B10) no CSE needed. Dynamic arrays: =FILTER(A:B,B:B>100), =SORT(A1:B10,2,-1), =UNIQUE(A1:A10). Spill ranges.`, 'excel');
add('excel_n', `TYPE, N, T: =TYPE(A1) returns type number (1=number,2=text,4=logical,16=error). =N(A1) converts to number (text→0, TRUE→1). =T(A1) converts to text (numbers→empty). Useful for type checking in formulas.`, 'excel');
add('excel_error', `Error Handling: =IFERROR(formula,0) catch any error. =IFNA(formula,0) catch #N/A only. =ISERROR(A1) TRUE if error. =ISNA(A1) TRUE if #N/A. #REF!, #DIV/0!, #VALUE!, #NAME?, #NULL!, #N/A errors.`, 'excel');

// Data Manipulation (6 entries)
add('excel_filter', `FILTER: =FILTER(A2:C100,B2:B100="Sales") filter rows. Multiple: =FILTER(A:C,(B:B="Sales")*(C:C>1000)). No match: =FILTER(A:A,B:B="X","None found"). Dynamic, spills results. Sort filtered: =SORT(FILTER(...)).`, 'excel');
add('excel_sort', `SORT: =SORT(A1:D100,3,-1) sort by column 3 descending. =SORT(A1:D100,3,-1,2,1) multi-level: col3 desc, then col2 asc. Dynamic array function. Spills results. Combine with FILTER.`, 'excel');
add('excel_unique', `UNIQUE: =UNIQUE(A1:A100) distinct values. =UNIQUE(A1:B100) unique rows. =UNIQUE(A1:A100,,2) unique by 2nd column. Dynamic array. No legacy equivalent without array formulas.`, 'excel');
add('excel_sortby', `SORTBY: =SORTBY(A1:A10,B1:B10,-1) sort A by B descending. =SORTBY(A1:D10,C1:C10,1,B1:B10,-1) multi-level. Dynamic. Sort by calculated column without helper.`, 'excel');
add('excel_xmatch', `XMATCH: =XMATCH(A1,B:B) position in lookup array. -1: next larger. 1: next smaller. 2: wildcard. Dynamic version of MATCH. Combine with INDEX for flexible lookup.`, 'excel');
add('excel_let', `LET: =LET(x,A1+B1,y,C1+D1,x+y) assign variables. =LET(name,A1:A100,filtered,FILTER(name,LEN(name)>5),COUNTA(filtered)) readable complex formulas. Multiple assignments. Final expression is result.`, 'excel');

// Pivot & Charts (4 entries)
add('excel_pivot', `Pivot Tables: Select data→Insert→PivotTable. Rows: categories. Values: numbers (Sum, Count, Average). Columns: breakdown. Filters: slicers. Group by date (months/quarters). Calculated fields. Refresh data source.`, 'excel');
add('excel_charts', `Chart Types: Line: trends over time. Bar: compare categories. Pie: composition (≤6 slices). Scatter: correlation. Histogram: distribution. Combo: dual axis. Sparkline: =SPARKLINE(A1:A10). Format: Chart Design tab.`, 'excel');
add('excel_condformat', `Conditional Formatting: Home→Conditional Formatting. Data bars, color scales, icon sets. Custom formula: =A1>TODAY()+7 highlight future dates. Duplicate values. Top/bottom rules. Cell value, text, date conditions.`, 'excel');
add('excel_data_validation', `Data Validation: Data→Validation. List: =INDIRECT("Lists!"&$A$1) dynamic dropdown. Whole number, decimal, date, text length. Custom: =LEN(A1)<=50. Error alert: stop/warning/information. Input message tooltip.`, 'excel');

// Power Features (4 entries)
add('excel_power_query', `Power Query: Data→Get & Transform. Connect CSV, database, web. Clean: remove columns, filter rows, split columns. Merge queries (join). Append (union). Pivot/unpivot. Group by. Automated refresh. M language.`, 'excel');
add('excel_vba_basics', `VBA Basics: Sub MyMacro()...End Sub. Dim x As Integer. x=Range("A1").Value. For i=1 To 10: Next i. If x>10 Then...End If. MsgBox "Done". Application.ScreenUpdating=False speed up. With/End With.`, 'excel');
add('excel_names', `Named Ranges: =SUM(SalesData) instead of =SUM(A1:A100). Formulas→Name Manager. Scope: workbook or worksheet. Constants: =PI() named constant. Dynamic: =OFFSET(Sheet1!$A$1,0,0,COUNTA(Sheet1!$A:$A),1).`, 'excel');
add('excel_protect', `Protection: Review→Protect Sheet. Lock cells (Format Cells→Protection→Locked). Password protect. Protect workbook structure. Hide formulas: protect+hidden. Share workbook. Track changes. File encryption.`, 'excel');
};
