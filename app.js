/* ============================================================
   QC Management System — Application Logic
   Single-file SPA. In-memory state only (no localStorage —
   this file runs inside a sandboxed artifact preview). Persist
   data across sessions using Export / Backup+Restore.
   Bilingual UI (Thai / English) via I18N + t().
   ============================================================ */
(function(){
"use strict";

/* ---------------- Icons (inline SVG, stroke=currentColor) ---------------- */
const ICONS = {
  dashboard:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
  records:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 3h6l3 3v15H6V3z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
  testers:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="18" cy="8" r="2.6"/><path d="M16.5 14.2c2.7.4 4.8 2.5 4.8 5.8"/></svg>',
  status:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12a8 8 0 1 1 8 8"/><path d="M4 12l3-3M4 12l3 3"/></svg>',
  systems:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l8 4-8 4-8-4 8-4z"/><path d="M4 11l8 4 8-4M4 15l8 4 8-4"/></svg>',
  reports:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5"/><path d="M8.5 17v-4M12 17v-6M15.5 17v-2.5"/></svg>',
  data:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg>',
  backup:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v12m0 0l-4-4m4 4l4-4"/><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></svg>',
  sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.4M12 19.6V22M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2 12h2.4M19.6 12H22M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7"/></svg>',
  moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12.8A9 9 0 1 1 11.2 3 7.2 7.2 0 0 0 21 12.8z"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
  edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>',
  mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  link:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',
  download:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v12m0 0l-4-4m4 4l4-4"/><path d="M4 21h16"/></svg>',
  upload:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21V9m0 0l-4 4m4-4l4 4"/><path d="M4 3h16"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/></svg>',
  menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  file:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>',
  chevronL:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>',
  chevronR:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>',
  copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  globe:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18"/></svg>',
};

/* ---------------- i18n ---------------- */
const I18N = {
  en:{
    appName:'QC Management', appTag:'INSPECTION CONSOLE',
    auth:{
      loginTitle:'Sign in', signupTitle:'Create account',
      email:'Email', password:'Password', emailPh:'you@example.com', passwordPh:'••••••••',
      loginBtn:'Sign in', signupBtn:'Create account', busy:'Please wait…',
      noAccount:'Need an account?', haveAccount:'Already have an account?',
      switchToSignup:'Sign up', switchToLogin:'Sign in',
      logout:'Sign out',
      genericError:'Something went wrong. Please try again.',
      signupDone:'Account created! Check your inbox and click the confirmation link in the email before signing in.',
      pendingTitle:'Waiting for approval', pendingBody:'Your account has been created but is not active yet. Please ask an admin to activate your access.',
      required:'Email and password are required.',
    },
    nav:{ groupOverview:'Overview', groupOps:'QC Operations', groupSystem:'System',
      dashboard:'Dashboard', records:'QC Records', testers:'Testers', statuses:'Program Statuses',
      systems:'Systems', reports:'QC Report', data:'Export / Import', backup:'Backup Database' },
    titles:{
      dashboard:['Dashboard','Live overview of QC activity by system, status and month'],
      records:['QC Records','Create, review and route quality-control records'],
      testers:['Tester Management','Manage the people who execute QC testing'],
      statuses:['Program Status Management','Configure the test-status vocabulary used across the app'],
      systems:['System Management','Manage main systems and their sub-systems'],
      reports:['QC Report','Generate a polished, multi-sheet Excel report for a period'],
      data:['Export / Import','Move data in and out of the QC system as Excel files'],
      backup:['Backup Database','Snapshot, download and restore the full dataset'],
    },
    common:{ allMonths:'All months', allSystems:'All systems', allStatuses:'All statuses', allTesters:'All testers',
      clearFilters:'Clear filters', save:'Save Changes', cancel:'Cancel', close:'Close', confirm:'Confirm',
      unassigned:'— Unassigned —', none:'None', selectEllipsis:'— Select —', search:'Search', actions:'Actions',
      active:'Active', inactive:'Inactive', notes:'Notes', never:'never', goTo:'Go to', edit:'Edit', delete:'Delete',
      addRecord:'Add Record', export:'Export', importLbl:'Import', reset:'Reset to defaults',
      autosaveOn:'Auto-save on', autosaveOff:'Auto-save off (this preview)',
      autosaveOnHint:'Changes save automatically in this browser and will still be here next time you open this file.',
      autosaveOffHint:'This preview cannot save to your browser. Download the file and open it directly to enable auto-save, or use Backup / Export to save your work manually.',
      syncOnline:'Live · shared with team', syncOnlineHint:'Connected to the shared database — everyone using this file sees the same data, updated live.',
      syncLocal:'Auto-save on (this device only)', syncLocalHint:'Not connected to the shared database right now — changes save to this browser only and won\u2019t be seen by teammates until the connection is back.',
      syncNone:'Not saved (this preview)', syncNoneHint:'This preview cannot save anywhere. Download the file and open it directly, or use Backup / Export to save your work manually.' },
    dash:{ total:'Total Records', ofAllTime:'across all months',
      statusDist:'Status Distribution', statusDistAll:'All months combined — count of records per status',
      bySystem:'Records by System', bySystemSub:'Broken down by status, stacked per system',
      trend:'Monthly Trend', trendSub:'Record volume across recent months, split by status',
      recent:'Recent Records', latest5:'Latest 5 records', noData:'No QC data for this month',
      noDataSub:'Pick a different month, or add a new QC record to see it reflected here.',
      col:{id:'ID', system:'System', program:'Program', status:'Status', tester:'Tester', date:'Test Date'} },
    records:{ searchPh:'Search ID, system, program, description, tester…', clear:'Clear filters',
      col:{id:'ID', system:'System / Sub-system', program:'Program / Version', issueType:'Issue Type',
        status:'Status', tester:'Tester', date:'Test Date / Month', actions:'Actions'},
      showing:(a,b,n)=>`Showing ${a}–${b} of ${n}`, perPage:'/ page', page:'Page', noMatch:'No records match your filters',
      noMatchSub:'Try clearing filters or search terms.', sendTester:'Send to tester', copyLink:'Copy link' },
    form:{ addTitle:'Add QC Record', editTitle:'Edit QC Record', newIdNote:'A new Problem ID will be generated automatically',
      problemId:'Problem ID', mainSystem:'Main System', subSystem:'Sub System', selectMainSystem:'— Select main system —',
      noSystemsYet:'No systems configured yet.', programName:'Program Name', version:'Version', versionPh:'e.g. v2.4',
      issueDesc:'Issue Description', issueType:'Issue Type', testStatus:'Test Status', tester:'Tester',
      testDate:'Test Date', responsible:'Responsible Person', relatedApps:'Related Applications', relatedAppsPh:'Comma-separated, e.g. Web App, API',
      reportedTime:'Time Reported', notes:'Notes', attachments:'Attachments', attachClick:'Click to attach photos or files',
      attachTooBig:(name,mb)=>`"${name}" is larger than ${mb}MB — please attach a smaller file.`,
      attachHintOnline:'Images upload to shared storage and are visible to your whole team.',
      attachHintLocal:'No shared connection right now — images save to this browser only.',
      create:'Create Record', required:'is required.', notInList:'not in system list' },
    detail:{ programName:'Program Name', version:'Version', issueType:'Issue Type', testDate:'Test Date', tester:'Tester',
      status:'Status', issueDesc:'Issue Description', responsible:'Responsible Person', relatedApps:'Related Applications',
      notes:'Notes', attachments:'Attachments', directLink:'Direct Link', none:'None' },
    send:{ title:'Send to Tester', preview:'email preview, bilingual (EN / TH)', recipient:'Recipient (Tester)',
      selectTester:'— Select tester —', language:'Language', subject:'Subject', previewLbl:'Preview',
      copyContent:'Copy Content', openMail:'Open in Email Client',
      format:'Format', formatHtml:'Rich HTML (table + photos)', formatPlain:'Plain text',
      copyFormatted:'Copy Formatted Email', htmlHint:'Paste (Ctrl+V) directly into a Gmail or Outlook compose window — the table, colors and any attached photos come through formatted.' },
    tester:{ addTitle:'Add Tester', editTitle:'Edit Tester', name:'Tester Name', username:'Username / Employee ID',
      email:'Email', role:'Role', department:'Department', status:'Status', addBtn:'Add Tester',
      accessRole:'Access Level', accessRoleAdmin:'Admin', accessRoleTester:'Tester',
      searchPh:'Search testers…', empty:'No testers found', emptySub:'Add a tester or adjust your search.',
      col:{name:'Name', username:'Username / Employee ID', email:'Email', role:'Role', dept:'Department', status:'Status', notes:'Notes', actions:'Actions'} },
    status:{ addTitle:'Add Status', editTitle:'Edit Status', label:'Label', desc:'Description', color:'Color',
      lockedColor:'This is a default status — its color is fixed for consistency across the app.', addBtn:'Add Status',
      banner:'These statuses appear throughout the app — in the QC Record form, table filters, and dashboard charts. Deleting a status in use will leave affected records showing a fallback tag.',
      col:{status:'Status', desc:'Description', usedBy:'Records using it', actions:'Actions'} },
    sys:{ addMain:'Add Main System', addSub:'+ Add sub-system', editMainTitle:'Edit Main System', addMainTitle:'Add Main System',
      editSubTitle:'Edit Sub-system', addSubTitle:'Add Sub-system', mainName:'Main System Name', subName:'Sub-system Name',
      parentSystem:'Under', recordsUsing:(n)=>`${n} record(s)`, subsCount:(n)=>`${n} sub-system(s)`,
      banner:'Main systems and their sub-systems populate the dropdowns in the QC Record form. Renaming a system updates existing records to match.',
      empty:'No systems configured yet', emptySub:'Add your first main system to start organizing QC records.' },
    report:{ period:'Report period', totalIn:'records in this period', exportBtn:'Export Report (.xlsx)', generating:'Generating report…',
      done:'Report downloaded.', noData:'No records for this period', noDataSub:'Pick a different month to generate a report.',
      preview:'Preview', previewSub:'What the report will include for this period',
      sheetSummary:'Summary', sheetBySystem:'By System', sheetByMonth:'Monthly Trend', sheetByTester:'By Tester', sheetDetail:'Record Detail',
      title:'QC Report', generatedOn:'Generated', periodLabel:'Period', totalRecords:'Total Records',
      statusBreakdown:'Status Breakdown', issueTypeBreakdown:'Issue Type Breakdown', status:'Status', count:'Count', percent:'%',
      systemTotal:'Total', monthlyNote:'Shows the last 12 months regardless of the period filter above, for trend context.',
      testerName:'Tester', testerTotal:'Total Assigned', testerActive:'Active' },
    data:{ exportTitle:'Export to Excel', exportSub:'Download your data as .xlsx — the same file can be re-imported below.',
      exportRecords:'Export QC Records (.xlsx)', exportTesters:'Export Testers (.xlsx)', exportStatuses:'Export Program Statuses (.xlsx)',
      importTitle:'Import from Excel', importSub:'Upload a .xlsx file exported from this app (or matching column headers).',
      importRecords:'Import QC Records', importTesters:'Import Testers', chooseFile:'Click to choose a .xlsx file',
      dangerTitle:'Clear All Data', dangerSub:'Permanently remove all QC records, testers and custom statuses from this session. This cannot be undone unless you have a backup.',
      resetImportedTitle:'Reset to Originally Imported Data', resetImportedSub:'Discard changes made in this browser and restore the 55 records originally imported from your Excel file.',
      clearBtn:'Clear All Data…' },
    backup:{ nowTitle:'Backup Now', nowSub:'Snapshot QC records, testers and statuses into a restorable backup.',
      lastBackup:'Last backup:', backupBtn:'Backup Now', downloadLatest:'Download Backup File',
      restoreTitle:'Restore from Backup', restoreSub:'Upload a previously downloaded backup .json file to restore the full dataset.',
      restoreClick:'Restore from file', chooseBackupFile:'Click to choose a backup .json file',
      historyTitle:'Backup History', historySub:(n)=>`${n} backup${n===1?'':'s'} this session`, empty:'No backups yet',
      emptySub:'Create your first backup to see it listed here.', download:'Download', restore:'Restore' },
    toast:{ recCreated:(id)=>`Record ${id} created.`, recUpdated:(id)=>`Record ${id} updated.`, recDeleted:(id)=>`Record ${id} deleted.`,
      linkCopied:(id)=>`Link copied for ${id}`, mailCopied:'Email content copied to clipboard.', mailOpened:'Opened in your email client.',
      mailHtmlCopied:'Formatted email copied — paste it into Gmail or Outlook.', mailHtmlCopyFailed:'Rich copy not supported here — copied plain text instead.',
      mailCopyBlocked:'Could not copy — this browser blocked clipboard access.',
      selectTesterFirst:'Please select a tester first.', testerUpdated:'Tester updated.', testerAdded:'Tester added.', testerRemoved:'Tester removed.',
      statusUpdated:'Status updated.', statusAdded:'Status added.', statusRemoved:'Status removed.', statusesReset:'Statuses reset to defaults.',
      systemAdded:'Main system added.', systemUpdated:'Main system updated.', systemRemoved:'Main system removed.',
      subAdded:'Sub-system added.', subUpdated:'Sub-system updated.', subRemoved:'Sub-system removed.',
      allCleared:'All data cleared.', typeDelete:'Type DELETE exactly to confirm.', exported:(f)=>`Exported ${f}`,
      resetToImported:'Restored the originally imported data.',
      excelFail:'Excel library failed to load — try again shortly.', importFail:'Could not read that file. Please upload a valid .xlsx.',
      importedRecords:(a,s)=>`Imported ${a} record(s)${s?', skipped '+s:''}.`, importedTesters:(a,s)=>`Imported ${a} tester(s)${s?', skipped '+s:''}.`,
      backupCreated:(n)=>`Backup created (${n} records).`, backupRestored:'Backup restored.', backupRestoredFile:'Backup restored from file.',
      invalidBackup:'That file is not a valid backup.', notFound:(id)=>`Record "${id}" was not found.`, chartFail:'This chart could not be drawn. Try a different month filter.',
      chartLibFail:'Chart library failed to load. Data is still available in the tables below.' },
    confirm:{ delRecordTitle:'Delete QC Record', delRecordBody:(id)=>`Delete record <b class="mono">${id}</b>? This cannot be undone.`,
      delTesterTitle:'Delete Tester', delTesterInUse:'This tester is referenced by existing QC records. Delete anyway? Records will show as unassigned.',
      delTesterOk:'Delete this tester?', delStatusTitle:'Delete Status', delStatusInUse:(n)=>`This status is used by ${n} record(s). Delete anyway? Those records will show a generic tag.`,
      delStatusOk:'Delete this status?', resetStatusTitle:'Reset Statuses', resetStatusBody:'Reset to the 7 default statuses? Custom statuses will be removed.',
      delSystemTitle:'Delete Main System', delSystemInUse:(n)=>`This main system is used by ${n} record(s). Delete anyway? Those records keep their existing text.`,
      delSystemOk:'Delete this main system and all its sub-systems?', delSubTitle:'Delete Sub-system', delSubOk:'Delete this sub-system?',
      clearAllTitle:'Clear All Data', clearAllBody:'This deletes <b>all</b> QC records, testers and custom statuses in this session. Consider exporting or backing up first.',
      typeToConfirm:(w)=>`Type "${w}" to confirm`, restoreBackupTitle:'Restore Backup', restoreBackupBody:(d)=>`Restore data from ${d}? This replaces all current records, testers and statuses.` },
  },
  th:{
    appName:'ระบบบริหารจัดการ QC', appTag:'ศูนย์ตรวจสอบคุณภาพ',
    auth:{
      loginTitle:'เข้าสู่ระบบ', signupTitle:'สมัครสมาชิก',
      email:'อีเมล', password:'รหัสผ่าน', emailPh:'you@example.com', passwordPh:'••••••••',
      loginBtn:'เข้าสู่ระบบ', signupBtn:'สมัครสมาชิก', busy:'กรุณารอสักครู่…',
      noAccount:'ยังไม่มีบัญชี?', haveAccount:'มีบัญชีอยู่แล้ว?',
      switchToSignup:'สมัครสมาชิก', switchToLogin:'เข้าสู่ระบบ',
      logout:'ออกจากระบบ',
      genericError:'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
      signupDone:'สร้างบัญชีสำเร็จ! กรุณาเข้าไปเช็คอีเมลของคุณ แล้วกดลิงก์ยืนยันในอีเมลก่อนเข้าสู่ระบบ',
      pendingTitle:'รอการอนุมัติ', pendingBody:'สร้างบัญชีของคุณแล้ว แต่ยังไม่เปิดใช้งาน กรุณาติดต่อผู้ดูแลระบบเพื่อเปิดสิทธิ์การใช้งาน',
      required:'กรุณากรอกอีเมลและรหัสผ่าน',
    },
    nav:{ groupOverview:'ภาพรวม', groupOps:'งาน QC', groupSystem:'ระบบ',
      dashboard:'แดชบอร์ด', records:'รายการ QC', testers:'ผู้ทดสอบ', statuses:'สถานะโปรแกรม',
      systems:'ระบบงาน', reports:'รายงาน QC', data:'นำเข้า / ส่งออก', backup:'สำรองข้อมูล' },
    titles:{
      dashboard:['แดชบอร์ด','ภาพรวมกิจกรรม QC แบบเรียลไทม์ ตามระบบ สถานะ และเดือน'],
      records:['รายการ QC','สร้าง ตรวจสอบ และส่งต่อรายการควบคุมคุณภาพ'],
      testers:['จัดการผู้ทดสอบ','จัดการรายชื่อผู้ทำหน้าที่ทดสอบ QC'],
      statuses:['จัดการสถานะโปรแกรม','กำหนดรายการสถานะการทดสอบที่ใช้ทั่วทั้งระบบ'],
      systems:['จัดการระบบงาน','จัดการชื่อระบบหลักและระบบย่อย'],
      reports:['รายงาน QC','สร้างรายงาน Excel หลายชีท จัดรูปแบบสวยงาม ตามช่วงเวลาที่เลือก'],
      data:['นำเข้า / ส่งออก','ย้ายข้อมูลเข้า-ออกจากระบบ QC ในรูปแบบไฟล์ Excel'],
      backup:['สำรองข้อมูล','สำรอง ดาวน์โหลด และกู้คืนข้อมูลทั้งหมด'],
    },
    common:{ allMonths:'ทุกเดือน', allSystems:'ทุกระบบ', allStatuses:'ทุกสถานะ', allTesters:'ผู้ทดสอบทั้งหมด',
      clearFilters:'ล้างตัวกรอง', save:'บันทึกการเปลี่ยนแปลง', cancel:'ยกเลิก', close:'ปิด', confirm:'ยืนยัน',
      unassigned:'— ยังไม่กำหนด —', none:'ไม่มี', selectEllipsis:'— เลือก —', search:'ค้นหา', actions:'การจัดการ',
      active:'ใช้งาน', inactive:'ไม่ใช้งาน', notes:'หมายเหตุ', never:'ยังไม่เคย', goTo:'ไปที่', edit:'แก้ไข', delete:'ลบ',
      addRecord:'เพิ่มรายการ', export:'ส่งออก', importLbl:'นำเข้า', reset:'คืนค่าเริ่มต้น',
      autosaveOn:'บันทึกอัตโนมัติ: เปิด', autosaveOff:'บันทึกอัตโนมัติ: ปิด (หน้าตัวอย่างนี้)',
      autosaveOnHint:'การเปลี่ยนแปลงจะถูกบันทึกอัตโนมัติในเบราว์เซอร์นี้ และจะยังอยู่เมื่อเปิดไฟล์นี้อีกครั้ง',
      autosaveOffHint:'หน้าตัวอย่างนี้ไม่สามารถบันทึกลงเบราว์เซอร์ได้ ดาวน์โหลดไฟล์แล้วเปิดโดยตรงเพื่อเปิดใช้งานบันทึกอัตโนมัติ หรือใช้สำรองข้อมูล/ส่งออกเพื่อบันทึกงานด้วยตนเอง',
      syncOnline:'ออนไลน์ · ใช้ร่วมกับทีม', syncOnlineHint:'เชื่อมต่อฐานข้อมูลกลางแล้ว — ทุกคนที่เปิดไฟล์นี้เห็นข้อมูลชุดเดียวกัน อัปเดตแบบเรียลไทม์',
      syncLocal:'บันทึกอัตโนมัติ (เครื่องนี้เท่านั้น)', syncLocalHint:'ตอนนี้ไม่ได้เชื่อมต่อฐานข้อมูลกลาง — การเปลี่ยนแปลงจะบันทึกไว้ในเบราว์เซอร์นี้เท่านั้น เพื่อนร่วมทีมจะยังไม่เห็นจนกว่าจะเชื่อมต่อได้อีกครั้ง',
      syncNone:'ไม่ได้บันทึก (หน้าตัวอย่างนี้)', syncNoneHint:'หน้าตัวอย่างนี้ไม่สามารถบันทึกที่ไหนได้เลย ดาวน์โหลดไฟล์แล้วเปิดโดยตรง หรือใช้สำรองข้อมูล/ส่งออกเพื่อบันทึกงานด้วยตนเอง' },
    dash:{ total:'จำนวนรายการทั้งหมด', ofAllTime:'ทุกเดือน',
      statusDist:'สัดส่วนตามสถานะ', statusDistAll:'รวมทุกเดือน — จำนวนรายการต่อสถานะ',
      bySystem:'รายการตามระบบ', bySystemSub:'แยกตามสถานะ ซ้อนตามระบบ',
      trend:'แนวโน้มรายเดือน', trendSub:'ปริมาณรายการในช่วงหลายเดือนที่ผ่านมา แยกตามสถานะ',
      recent:'รายการล่าสุด', latest5:'5 รายการล่าสุด', noData:'ไม่มีข้อมูล QC สำหรับเดือนนี้',
      noDataSub:'เลือกเดือนอื่น หรือเพิ่มรายการ QC ใหม่เพื่อแสดงผลที่นี่',
      col:{id:'รหัส', system:'ระบบ', program:'โปรแกรม', status:'สถานะ', tester:'ผู้ทดสอบ', date:'วันที่ทดสอบ'} },
    records:{ searchPh:'ค้นหารหัส ระบบ โปรแกรม รายละเอียด ผู้ทดสอบ…', clear:'ล้างตัวกรอง',
      col:{id:'รหัส', system:'ระบบ / ระบบย่อย', program:'โปรแกรม / เวอร์ชัน', issueType:'ประเภทใบแจ้งปัญหา',
        status:'สถานะ', tester:'ผู้ทดสอบ', date:'วันที่ทดสอบ / เดือน', actions:'การจัดการ'},
      showing:(a,b,n)=>`แสดง ${a}–${b} จาก ${n}`, perPage:'/ หน้า', page:'หน้า', noMatch:'ไม่พบรายการที่ตรงกับตัวกรอง',
      noMatchSub:'ลองล้างตัวกรองหรือคำค้นหา', sendTester:'ส่งให้ผู้ทดสอบ', copyLink:'คัดลอกลิงก์' },
    form:{ addTitle:'เพิ่มรายการ QC', editTitle:'แก้ไขรายการ QC', newIdNote:'ระบบจะสร้างรหัสปัญหาใหม่ให้อัตโนมัติ',
      problemId:'รหัสปัญหา', mainSystem:'ระบบหลัก', subSystem:'ระบบย่อย', selectMainSystem:'— เลือกระบบหลัก —',
      noSystemsYet:'ยังไม่มีระบบที่กำหนดไว้', programName:'ชื่อโปรแกรม', version:'เวอร์ชัน', versionPh:'เช่น v2.4',
      issueDesc:'รายละเอียดการแจ้งปัญหา', issueType:'ประเภทใบแจ้งปัญหา', testStatus:'สถานะการทดสอบ', tester:'ผู้ทดสอบ',
      testDate:'วันที่ทดสอบ', responsible:'ผู้รับผิดชอบ', relatedApps:'แอปพลิเคชันที่เกี่ยวข้อง', relatedAppsPh:'คั่นด้วยจุลภาค เช่น Web App, API',
      reportedTime:'เวลาที่แจ้ง', notes:'หมายเหตุ', attachments:'ไฟล์แนบ', attachClick:'คลิกเพื่อแนบรูปภาพหรือไฟล์',
      attachTooBig:(name,mb)=>`"${name}" มีขนาดเกิน ${mb}MB กรุณาแนบไฟล์ที่เล็กกว่านี้`,
      attachHintOnline:'รูปภาพจะอัปโหลดขึ้นพื้นที่จัดเก็บกลาง ทีมของคุณเห็นได้ทุกคน',
      attachHintLocal:'ตอนนี้ไม่ได้เชื่อมต่อพื้นที่จัดเก็บกลาง — รูปภาพจะบันทึกไว้ในเบราว์เซอร์นี้เท่านั้น',
      create:'สร้างรายการ', required:'จำเป็นต้องระบุ', notInList:'ไม่อยู่ในรายการระบบ' },
    detail:{ programName:'ชื่อโปรแกรม', version:'เวอร์ชัน', issueType:'ประเภทใบแจ้งปัญหา', testDate:'วันที่ทดสอบ', tester:'ผู้ทดสอบ',
      status:'สถานะ', issueDesc:'รายละเอียดการแจ้งปัญหา', responsible:'ผู้รับผิดชอบ', relatedApps:'แอปพลิเคชันที่เกี่ยวข้อง',
      notes:'หมายเหตุ', attachments:'ไฟล์แนบ', directLink:'ลิงก์โดยตรง', none:'ไม่มี' },
    send:{ title:'ส่งให้ผู้ทดสอบ', preview:'ตัวอย่างอีเมล รองรับสองภาษา (EN / TH)', recipient:'ผู้รับ (ผู้ทดสอบ)',
      selectTester:'— เลือกผู้ทดสอบ —', language:'ภาษา', subject:'หัวข้อ', previewLbl:'ตัวอย่าง',
      copyContent:'คัดลอกเนื้อหา', openMail:'เปิดในโปรแกรมอีเมล',
      format:'รูปแบบ', formatHtml:'HTML สวยงาม (ตาราง + รูปภาพ)', formatPlain:'ข้อความธรรมดา',
      copyFormatted:'คัดลอกอีเมลจัดรูปแบบแล้ว', htmlHint:'วาง (Ctrl+V) ลงในหน้าต่างเขียนอีเมลของ Gmail หรือ Outlook ได้เลย ตาราง สี และรูปภาพที่แนบจะติดไปด้วย' },
    tester:{ addTitle:'เพิ่มผู้ทดสอบ', editTitle:'แก้ไขผู้ทดสอบ', name:'ชื่อผู้ทดสอบ', username:'ชื่อผู้ใช้ / รหัสพนักงาน',
      email:'อีเมล', role:'บทบาท', accessRole:'ระดับสิทธิ์', accessRoleAdmin:'ผู้ดูแลระบบ', accessRoleTester:'ผู้ทดสอบ', department:'แผนก', status:'สถานะ', addBtn:'เพิ่มผู้ทดสอบ',
      searchPh:'ค้นหาผู้ทดสอบ…', empty:'ไม่พบผู้ทดสอบ', emptySub:'เพิ่มผู้ทดสอบ หรือปรับคำค้นหา',
      col:{name:'ชื่อ', username:'ชื่อผู้ใช้ / รหัสพนักงาน', email:'อีเมล', role:'บทบาท', dept:'แผนก', status:'สถานะ', notes:'หมายเหตุ', actions:'การจัดการ'} },
    status:{ addTitle:'เพิ่มสถานะ', editTitle:'แก้ไขสถานะ', label:'ชื่อสถานะ', desc:'คำอธิบาย', color:'สี',
      lockedColor:'นี่คือสถานะเริ่มต้น สีของสถานะนี้ถูกกำหนดไว้เพื่อความสอดคล้องกันทั้งระบบ', addBtn:'เพิ่มสถานะ',
      banner:'สถานะเหล่านี้ปรากฏทั่วทั้งแอป — ในแบบฟอร์มรายการ QC ตัวกรองตาราง และกราฟแดชบอร์ด การลบสถานะที่ถูกใช้งานอยู่จะทำให้รายการที่เกี่ยวข้องแสดงป้ายสำรอง',
      col:{status:'สถานะ', desc:'คำอธิบาย', usedBy:'จำนวนรายการที่ใช้', actions:'การจัดการ'} },
    sys:{ addMain:'เพิ่มระบบหลัก', addSub:'+ เพิ่มระบบย่อย', editMainTitle:'แก้ไขระบบหลัก', addMainTitle:'เพิ่มระบบหลัก',
      editSubTitle:'แก้ไขระบบย่อย', addSubTitle:'เพิ่มระบบย่อย', mainName:'ชื่อระบบหลัก', subName:'ชื่อระบบย่อย',
      parentSystem:'ภายใต้', recordsUsing:(n)=>`${n} รายการ`, subsCount:(n)=>`${n} ระบบย่อย`,
      banner:'ระบบหลักและระบบย่อยจะแสดงเป็นตัวเลือกในแบบฟอร์มรายการ QC การเปลี่ยนชื่อระบบจะปรับปรุงรายการเดิมให้ตรงกันโดยอัตโนมัติ',
      empty:'ยังไม่มีระบบที่กำหนดไว้', emptySub:'เพิ่มระบบหลักแรกของคุณเพื่อเริ่มจัดระเบียบรายการ QC' },
    report:{ period:'ช่วงเวลารายงาน', totalIn:'รายการในช่วงนี้', exportBtn:'ส่งออกรายงาน (.xlsx)', generating:'กำลังสร้างรายงาน…',
      done:'ดาวน์โหลดรายงานแล้ว', noData:'ไม่มีรายการในช่วงเวลานี้', noDataSub:'เลือกเดือนอื่นเพื่อสร้างรายงาน',
      preview:'ตัวอย่าง', previewSub:'สิ่งที่รายงานจะประกอบด้วยสำหรับช่วงเวลานี้',
      sheetSummary:'สรุปภาพรวม', sheetBySystem:'ตามระบบ', sheetByMonth:'แนวโน้มรายเดือน', sheetByTester:'ตามผู้ทดสอบ', sheetDetail:'รายละเอียดรายการ',
      title:'รายงานการควบคุมคุณภาพ (QC Report)', generatedOn:'สร้างเมื่อ', periodLabel:'ช่วงเวลา', totalRecords:'จำนวนรายการทั้งหมด',
      statusBreakdown:'สัดส่วนตามสถานะ', issueTypeBreakdown:'สัดส่วนตามประเภทใบแจ้งปัญหา', status:'สถานะ', count:'จำนวน', percent:'%',
      systemTotal:'รวม', monthlyNote:'แสดง 12 เดือนล่าสุดเสมอ ไม่ขึ้นกับตัวกรองช่วงเวลาด้านบน เพื่อให้เห็นแนวโน้ม',
      testerName:'ผู้ทดสอบ', testerTotal:'จำนวนที่ได้รับมอบหมาย', testerActive:'สถานะ' },
    data:{ exportTitle:'ส่งออกเป็น Excel', exportSub:'ดาวน์โหลดข้อมูลเป็น .xlsx — ไฟล์เดียวกันนี้นำเข้ากลับได้ในส่วนด้านล่าง',
      exportRecords:'ส่งออกรายการ QC (.xlsx)', exportTesters:'ส่งออกผู้ทดสอบ (.xlsx)', exportStatuses:'ส่งออกสถานะโปรแกรม (.xlsx)',
      importTitle:'นำเข้าจาก Excel', importSub:'อัปโหลดไฟล์ .xlsx ที่ส่งออกจากแอปนี้ (หรือมีหัวคอลัมน์ตรงกัน)',
      importRecords:'นำเข้ารายการ QC', importTesters:'นำเข้าผู้ทดสอบ', chooseFile:'คลิกเพื่อเลือกไฟล์ .xlsx',
      dangerTitle:'ล้างข้อมูลทั้งหมด', dangerSub:'ลบรายการ QC ผู้ทดสอบ และสถานะที่กำหนดเองทั้งหมดในเซสชันนี้อย่างถาวร ไม่สามารถย้อนกลับได้เว้นแต่มีข้อมูลสำรอง',
      resetImportedTitle:'คืนค่ากลับเป็นข้อมูลที่นำเข้าครั้งแรก', resetImportedSub:'ยกเลิกการเปลี่ยนแปลงในเบราว์เซอร์นี้ และคืนค่ากลับเป็น 55 รายการที่นำเข้าจากไฟล์ Excel ครั้งแรก',
      clearBtn:'ล้างข้อมูลทั้งหมด…' },
    backup:{ nowTitle:'สำรองข้อมูลตอนนี้', nowSub:'สร้างชุดสำรองของรายการ QC ผู้ทดสอบ และสถานะ เพื่อกู้คืนได้ในอนาคต',
      lastBackup:'สำรองล่าสุด:', backupBtn:'สำรองข้อมูลตอนนี้', downloadLatest:'ดาวน์โหลดไฟล์สำรอง',
      restoreTitle:'กู้คืนจากข้อมูลสำรอง', restoreSub:'อัปโหลดไฟล์สำรอง .json ที่ดาวน์โหลดไว้ก่อนหน้าเพื่อกู้คืนข้อมูลทั้งหมด',
      restoreClick:'กู้คืนจากไฟล์', chooseBackupFile:'คลิกเพื่อเลือกไฟล์สำรอง .json',
      historyTitle:'ประวัติการสำรองข้อมูล', historySub:(n)=>`${n} ครั้งในเซสชันนี้`, empty:'ยังไม่มีการสำรองข้อมูล',
      emptySub:'สร้างการสำรองข้อมูลครั้งแรกเพื่อดูรายการที่นี่', download:'ดาวน์โหลด', restore:'กู้คืน' },
    toast:{ recCreated:(id)=>`สร้างรายการ ${id} แล้ว`, recUpdated:(id)=>`อัปเดตรายการ ${id} แล้ว`, recDeleted:(id)=>`ลบรายการ ${id} แล้ว`,
      linkCopied:(id)=>`คัดลอกลิงก์สำหรับ ${id} แล้ว`, mailCopied:'คัดลอกเนื้อหาอีเมลแล้ว', mailOpened:'เปิดในโปรแกรมอีเมลของคุณแล้ว',
      mailHtmlCopied:'คัดลอกอีเมลจัดรูปแบบแล้ว — วางลงใน Gmail หรือ Outlook ได้เลย', mailHtmlCopyFailed:'เบราว์เซอร์นี้ไม่รองรับการคัดลอกแบบจัดรูปแบบ — คัดลอกเป็นข้อความธรรมดาแทน',
      mailCopyBlocked:'คัดลอกไม่สำเร็จ — เบราว์เซอร์นี้บล็อกการเข้าถึงคลิปบอร์ด',
      selectTesterFirst:'กรุณาเลือกผู้ทดสอบก่อน', testerUpdated:'อัปเดตผู้ทดสอบแล้ว', testerAdded:'เพิ่มผู้ทดสอบแล้ว', testerRemoved:'ลบผู้ทดสอบแล้ว',
      statusUpdated:'อัปเดตสถานะแล้ว', statusAdded:'เพิ่มสถานะแล้ว', statusRemoved:'ลบสถานะแล้ว', statusesReset:'คืนค่าสถานะเป็นค่าเริ่มต้นแล้ว',
      systemAdded:'เพิ่มระบบหลักแล้ว', systemUpdated:'อัปเดตระบบหลักแล้ว', systemRemoved:'ลบระบบหลักแล้ว',
      subAdded:'เพิ่มระบบย่อยแล้ว', subUpdated:'อัปเดตระบบย่อยแล้ว', subRemoved:'ลบระบบย่อยแล้ว',
      allCleared:'ล้างข้อมูลทั้งหมดแล้ว', typeDelete:'กรุณาพิมพ์ DELETE ให้ตรงกันเพื่อยืนยัน', exported:(f)=>`ส่งออก ${f} แล้ว`,
      resetToImported:'คืนค่ากลับเป็นข้อมูลที่นำเข้าครั้งแรกแล้ว',
      excelFail:'โหลดไลบรารี Excel ไม่สำเร็จ กรุณาลองใหม่', importFail:'ไม่สามารถอ่านไฟล์นี้ได้ กรุณาอัปโหลดไฟล์ .xlsx ที่ถูกต้อง',
      importedRecords:(a,s)=>`นำเข้า ${a} รายการ${s?', ข้าม '+s+' รายการ':''}`, importedTesters:(a,s)=>`นำเข้าผู้ทดสอบ ${a} คน${s?', ข้าม '+s+' คน':''}`,
      backupCreated:(n)=>`สำรองข้อมูลแล้ว (${n} รายการ)`, backupRestored:'กู้คืนข้อมูลสำรองแล้ว', backupRestoredFile:'กู้คืนข้อมูลจากไฟล์แล้ว',
      invalidBackup:'ไฟล์นี้ไม่ใช่ไฟล์สำรองที่ถูกต้อง', notFound:(id)=>`ไม่พบรายการ "${id}"`, chartFail:'ไม่สามารถแสดงกราฟนี้ได้ ลองเปลี่ยนตัวกรองเดือน',
      chartLibFail:'โหลดไลบรารีกราฟไม่สำเร็จ ข้อมูลยังดูได้จากตารางด้านล่าง' },
    confirm:{ delRecordTitle:'ลบรายการ QC', delRecordBody:(id)=>`ลบรายการ <b class="mono">${id}</b> หรือไม่? ไม่สามารถย้อนกลับได้`,
      delTesterTitle:'ลบผู้ทดสอบ', delTesterInUse:'ผู้ทดสอบนี้ถูกอ้างอิงในรายการ QC ที่มีอยู่ ต้องการลบต่อหรือไม่? รายการจะแสดงเป็นยังไม่กำหนด',
      delTesterOk:'ลบผู้ทดสอบนี้หรือไม่?', delStatusTitle:'ลบสถานะ', delStatusInUse:(n)=>`สถานะนี้ถูกใช้ใน ${n} รายการ ต้องการลบต่อหรือไม่? รายการเหล่านั้นจะแสดงป้ายทั่วไป`,
      delStatusOk:'ลบสถานะนี้หรือไม่?', resetStatusTitle:'คืนค่าสถานะเริ่มต้น', resetStatusBody:'คืนค่าเป็น 7 สถานะเริ่มต้นหรือไม่? สถานะที่กำหนดเองจะถูกลบ',
      delSystemTitle:'ลบระบบหลัก', delSystemInUse:(n)=>`ระบบหลักนี้ถูกใช้ใน ${n} รายการ ต้องการลบต่อหรือไม่? รายการเหล่านั้นจะยังคงข้อความเดิมไว้`,
      delSystemOk:'ลบระบบหลักนี้พร้อมระบบย่อยทั้งหมดหรือไม่?', delSubTitle:'ลบระบบย่อย', delSubOk:'ลบระบบย่อยนี้หรือไม่?',
      clearAllTitle:'ล้างข้อมูลทั้งหมด', clearAllBody:'การทำเช่นนี้จะลบรายการ QC ผู้ทดสอบ และสถานะที่กำหนดเอง<b>ทั้งหมด</b>ในเซสชันนี้ ควรส่งออกหรือสำรองข้อมูลก่อน',
      typeToConfirm:(w)=>`พิมพ์ "${w}" เพื่อยืนยัน`, restoreBackupTitle:'กู้คืนข้อมูลสำรอง', restoreBackupBody:(d)=>`กู้คืนข้อมูลจาก ${d} หรือไม่? การกระทำนี้จะแทนที่รายการ ผู้ทดสอบ และสถานะทั้งหมดในปัจจุบัน` },
  },
};
function t(path){
  const dict = I18N[state.lang] || I18N.en;
  const val = path.split('.').reduce((o,k)=> (o && o[k]!==undefined) ? o[k] : undefined, dict);
  if(val===undefined){
    const fallback = path.split('.').reduce((o,k)=> (o && o[k]!==undefined) ? o[k] : undefined, I18N.en);
    return fallback!==undefined? fallback : path;
  }
  return val;
}

/* ---------------- Utilities ---------------- */
function uid(prefix){ return prefix+'_'+Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-4); }
function pad4(n){ return String(n).padStart(4,'0'); }
function esc(s){ if(s===undefined||s===null) return ''; return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function monthKeyOf(dateStr){ if(!dateStr) return null; return String(dateStr).slice(0,7); }
const MONTH_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH_TH = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
function monthLabel(mk){
  if(!mk) return '—';
  const [y,m] = mk.split('-');
  const idx = parseInt(m,10)-1;
  if(state.lang==='th'){
    const beYear = parseInt(y,10)+543;
    return (MONTH_TH[idx]||m)+' '+beYear;
  }
  return (MONTH_EN[idx]||m)+' '+y;
}
function fmtDate(d){
  if(!d) return '—';
  try{
    const dt=new Date(d+'T00:00:00');
    if(state.lang==='th'){
      const day=String(dt.getDate()).padStart(2,'0');
      return day+' '+MONTH_TH[dt.getMonth()]+' '+(dt.getFullYear()+543);
    }
    return dt.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
  }catch(e){ return d; }
}
function fmtDateTime(ts){
  try{
    const dt = new Date(ts);
    if(state.lang==='th'){
      const day=String(dt.getDate()).padStart(2,'0');
      const hh=String(dt.getHours()).padStart(2,'0'), mm=String(dt.getMinutes()).padStart(2,'0');
      return day+' '+MONTH_TH[dt.getMonth()]+' '+(dt.getFullYear()+543)+' '+hh+':'+mm;
    }
    return dt.toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
  }catch(e){ return ts; }
}
function todayISO(){ return new Date().toISOString().slice(0,10); }
function download(filename, blob){
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=url; a.download=filename; document.body.appendChild(a); a.click();
  setTimeout(()=>{ document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
}
function downloadJSON(filename,obj){ download(filename, new Blob([JSON.stringify(obj,null,2)],{type:'application/json'})); }
function deepLinkFor(id){ return location.origin+location.pathname+'#/records/'+encodeURIComponent(id); }
function copyToClipboard(text){
  if(navigator.clipboard && navigator.clipboard.writeText){
    return navigator.clipboard.writeText(text);
  }
  const ta=document.createElement('textarea'); ta.value=text; ta.style.position='fixed'; ta.style.opacity='0';
  document.body.appendChild(ta); ta.select();
  try{ document.execCommand('copy'); }catch(e){}
  document.body.removeChild(ta);
  return Promise.resolve();
}

/* ---------------- Persistence (IndexedDB, with localStorage fallback) ----------------
   This preview may run inside a sandboxed iframe (e.g. Claude's artifact preview)
   where storage APIs throw or are unavailable — in that case everything below
   silently no-ops and the app stays in-memory-only for the session (use Backup /
   Export to save work). If this file is downloaded and opened directly in a real
   browser tab, storage is reachable and changes auto-save there automatically,
   surviving closing and reopening the browser.
   IndexedDB is preferred (async, much higher storage quota, no size pressure as
   records grow); localStorage is used only if IndexedDB itself is unavailable. */
const IDB_NAME = 'qc_management_system_db';
const IDB_STORE = 'app_state';
const IDB_KEY = 'state';
const LS_KEY = 'qc_management_system_v1';

let idbHandle = null;
let storageMode = null; // 'idb' | 'ls' | 'none'

function openIDB(){
  return new Promise((resolve, reject)=>{
    if(typeof indexedDB === 'undefined'){ reject(new Error('no indexedDB')); return; }
    let req;
    try{ req = indexedDB.open(IDB_NAME, 1); }catch(e){ reject(e); return; }
    req.onupgradeneeded = ()=>{
      const db = req.result;
      if(!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
    };
    req.onsuccess = ()=> resolve(req.result);
    req.onerror = ()=> reject(req.error || new Error('IndexedDB open failed'));
    req.onblocked = ()=> reject(new Error('IndexedDB blocked'));
  });
}
function lsAvailable(){
  try{
    const k='__qc_ls_test__';
    window.localStorage.setItem(k,'1');
    window.localStorage.removeItem(k);
    return true;
  }catch(e){ return false; }
}
async function detectStorageMode(){
  if(storageMode!==null) return storageMode;
  try{
    idbHandle = await openIDB();
    storageMode = 'idb';
  }catch(e){
    storageMode = lsAvailable() ? 'ls' : 'none';
  }
  return storageMode;
}
function idbPut(payload){
  return new Promise((resolve,reject)=>{
    try{
      const tx = idbHandle.transaction(IDB_STORE,'readwrite');
      tx.objectStore(IDB_STORE).put(payload, IDB_KEY);
      tx.oncomplete = ()=>resolve();
      tx.onerror = ()=>reject(tx.error);
    }catch(e){ reject(e); }
  });
}
function idbGet(){
  return new Promise((resolve,reject)=>{
    try{
      const tx = idbHandle.transaction(IDB_STORE,'readonly');
      const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
      req.onsuccess = ()=>resolve(req.result||null);
      req.onerror = ()=>reject(req.error);
    }catch(e){ reject(e); }
  });
}
function idbDelete(){
  return new Promise((resolve,reject)=>{
    try{
      const tx = idbHandle.transaction(IDB_STORE,'readwrite');
      tx.objectStore(IDB_STORE).delete(IDB_KEY);
      tx.oncomplete = ()=>resolve();
      tx.onerror = ()=>reject(tx.error);
    }catch(e){ reject(e); }
  });
}
let autosaveTimer = null;
function scheduleAutosave(){
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(()=>{ saveToStorage(); }, 300);
}
async function saveToStorage(){
  const mode = await detectStorageMode();
  if(mode==='none') return;
  const payload = {
    v:1, savedAt:Date.now(),
    records: state.records, testers: state.testers, statuses: state.statuses, systems: state.systems,
    theme: state.theme, lang: state.lang, lastBackupAt: state.lastBackupAt, nextSeq: state.nextSeq,
  };
  try{
    if(mode==='idb') await idbPut(payload);
    else window.localStorage.setItem(LS_KEY, JSON.stringify(payload));
  }catch(e){ /* quota exceeded or similar — fail silently, Backup/Export remain available */ }
}
async function loadFromStorage(){
  const mode = await detectStorageMode();
  if(mode==='none') return null;
  try{
    let payload;
    if(mode==='idb') payload = await idbGet();
    else { const raw = window.localStorage.getItem(LS_KEY); payload = raw? JSON.parse(raw) : null; }
    if(!payload || !Array.isArray(payload.records)) return null;
    return payload;
  }catch(e){ return null; }
}
async function clearStorage(){
  const mode = await detectStorageMode();
  if(mode==='none') return;
  try{
    if(mode==='idb') await idbDelete();
    else window.localStorage.removeItem(LS_KEY);
  }catch(e){}
}

/* ---------------- Supabase (shared team database) ----------------
   When reachable, Supabase is the source of truth for shared data
   (records, testers, statuses, systems/sub-systems) — everyone who opens
   this file with network access sees the same live data, with realtime
   updates. Personal preferences (theme, language) never sync — those stay
   local per device via the IndexedDB/localStorage layer above.
   If Supabase can't be reached (no internet, project unreachable, etc.)
   everything below fails safe: the app falls back to local-only storage,
   exactly as before. */
const SUPABASE_URL = 'https://kgrvykdivjvmzuwofotl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtncnZ5a2Rpdmp2bXp1d29mb3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0OTA5NjAsImV4cCI6MjEwMTA2Njk2MH0.kA5bZpcVEx42kKudRuh5d2IiPPrdmvvGbw2KjifJoL0';
let supa = null;
let realtimeChannel = null;
let lastPushedSnapshot = null;
let supaPushTimer = null;

function initSupabaseClient(){
  try{
    if(typeof window.supabase === 'undefined' || !window.supabase.createClient) return null;
    return window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }catch(e){ return null; }
}

/* ---------------- Auth (Supabase Auth: email/password) ----------------
   Two access levels, resolved by matching the signed-in auth user's email
   against the `testers` table: 'admin' (accessRole==='admin' && active),
   'tester' (any other active tester row), or 'pending' (no matching row,
   or a matching row that isn't active yet — awaiting admin approval). */
function resolveAccessForSession(session){
  if(!session || !session.user){ state.currentTester=null; state.accessRole=null; return; }
  const email = (session.user.email||'').toLowerCase();
  const match = state.testers.find(x=>x.email && x.email.toLowerCase()===email);
  state.currentTester = match || null;
  if(!match || !match.active) state.accessRole = 'pending';
  else state.accessRole = match.accessRole==='admin' ? 'admin' : 'tester';
}
async function ensureTesterStubExists(session){
  if(!session || !session.user || !supa) return;
  const email = (session.user.email||'').toLowerCase();
  if(state.testers.some(x=>x.email && x.email.toLowerCase()===email)) return;
  const id = 'T'+String(state.testers.length+1).padStart(3,'0')+Math.random().toString(36).slice(2,4);
  const stub = { id, name:'', username:session.user.email||'', email:session.user.email||'', role:'', accessRole:'tester', department:'', active:false, notes:'' };
  state.testers.push(stub);
  try{ await supa.from('testers').insert(testerToRow(stub)); }
  catch(e){ console.warn('Could not register tester stub:', e && e.message); }
  resolveAccessForSession(session);
}
async function pushTesterStatusUpdate(recordId, status){
  if(!supa) return { error:new Error('offline') };
  try{ const { error } = await supa.from('qc_records').update({status}).eq('id', recordId); return { error }; }
  catch(e){ return { error:e }; }
}

function authShellHTML(){
  const mode = state.authMode;
  const isSignup = mode==='signup';
  return `
  <div class="auth-shell" style="width:100%;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;background:var(--bg)">
    <div class="card card-pad" style="width:100%;max-width:380px">
      <div class="brand" style="border-bottom:none;padding:0 0 18px">
        <div class="brand-mark">QC</div>
        <div class="brand-text"><b>${esc(t('appName'))}</b><span>${esc(t('appTag'))}</span></div>
      </div>
      <h2 style="margin:0 0 4px">${esc(isSignup? t('auth.signupTitle') : t('auth.loginTitle'))}</h2>
      <div id="auth-form" style="margin-top:14px">
        ${state.authNotice? `<div class="helper-banner">${ICONS.mail}<div>${esc(state.authNotice)}</div></div>` : ''}
        <div class="form-grid">
          <div class="form-field full"><label>${esc(t('auth.email'))}</label><input type="email" name="email" id="auth-email" placeholder="${esc(t('auth.emailPh'))}" value="${esc(state.authEmail||'')}"></div>
          <div class="form-field full"><label>${esc(t('auth.password'))}</label><input type="password" name="password" id="auth-password" placeholder="${esc(t('auth.passwordPh'))}"></div>
        </div>
        ${state.authError? `<div class="form-hint" style="color:var(--danger);margin-top:6px">${esc(state.authError)}</div>` : ''}
        <button type="button" class="btn btn-primary btn-block" style="margin-top:14px" data-action="${isSignup?'submit-signup':'submit-login'}" ${state.authBusy?'disabled':''}>
          ${state.authBusy? esc(t('auth.busy')) : esc(isSignup? t('auth.signupBtn') : t('auth.loginBtn'))}
        </button>
        <div style="margin-top:14px;text-align:center;font-size:13px;color:var(--text-muted)">
          ${esc(isSignup? t('auth.haveAccount') : t('auth.noAccount'))}
          <a href="#" data-action="toggle-auth-mode" style="margin-left:4px">${esc(isSignup? t('auth.switchToLogin') : t('auth.switchToSignup'))}</a>
        </div>
      </div>
    </div>
    <div class="toast-stack" id="toast-stack"></div>
  </div>`;
}

function pendingApprovalHTML(){
  return `
  <div class="auth-shell" style="width:100%;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;background:var(--bg)">
    <div class="card card-pad" style="width:100%;max-width:380px;text-align:center">
      <div class="brand" style="border-bottom:none;padding:0 0 18px;justify-content:center">
        <div class="brand-mark">QC</div>
        <div class="brand-text"><b>${esc(t('appName'))}</b><span>${esc(t('appTag'))}</span></div>
      </div>
      <h2 style="margin:0 0 8px">${esc(t('auth.pendingTitle'))}</h2>
      <p style="color:var(--text-muted);font-size:13.5px;margin:0 0 18px">${esc(t('auth.pendingBody'))}</p>
      <button type="button" class="btn btn-block" data-action="logout">${esc(t('auth.logout'))}</button>
    </div>
    <div class="toast-stack" id="toast-stack"></div>
  </div>`;
}

/* ---- row <-> app-state shape transforms ---- */
function recordToRow(r){
  return {
    id:r.id, main_system:r.mainSystem||null, sub_system:r.subSystem||null, program_name:r.programName||null,
    version:r.version||null, issue_description:r.issueDescription||null, issue_type:r.issueType||null,
    status:r.status||null, tester_id:r.tester||null, test_date:r.testDate||null,
    responsible:r.responsible||null, related_apps:r.relatedApps||null, notes:r.notes||null,
    attachments: r.attachments||[],
  };
}
function rowToRecord(row){
  return {
    id:row.id, mainSystem:row.main_system||'', subSystem:row.sub_system||'', programName:row.program_name||'',
    version:row.version||'', issueDescription:row.issue_description||'', issueType:row.issue_type||'edit',
    status:row.status||'pending_test', tester:row.tester_id||'', testDate:row.test_date||'',
    responsible:row.responsible||'', relatedApps:row.related_apps||'', notes:row.notes||'',
    attachments:row.attachments||[], createdAt: row.created_at? Date.parse(row.created_at) : Date.now(),
  };
}
function testerToRow(t){
  return { id:t.id, name:t.name||null, username:t.username||null, email:t.email||null, role:t.role||null, access_role:t.accessRole||'tester', department:t.department||null, active: !!t.active, notes:t.notes||null };
}
function rowToTester(row){
  return { id:row.id, name:row.name||'', username:row.username||'', email:row.email||'', role:row.role||'', accessRole:row.access_role||'tester', department:row.department||'', active: !!row.active, notes:row.notes||'' };
}
function statusToRow(s, idx){
  return { id:s.id, label:s.label||null, label_th:s.th||null, description:s.desc||null, description_th:s.descTh||null, color:s.color||null, custom_color:s.customColor||null, sort_order: idx };
}
function rowToStatus(row){
  return { id:row.id, label:row.label||row.id, th:row.label_th||row.label||row.id, desc:row.description||'', descTh:row.description_th||'', color:row.color||'custom', customColor:row.custom_color||undefined };
}
function systemToRow(s){ return { id:s.id, name:s.name||'' }; }
function subToRow(sysId, sub){ return { id:sub.id, system_id:sysId, name:sub.name||'' }; }

/* ---- pull ---- */
async function supaPullAll(){
  const [rec, test, stat, sys, subs] = await Promise.all([
    supa.from('qc_records').select('*'),
    supa.from('testers').select('*'),
    supa.from('statuses').select('*').order('sort_order', {ascending:true}),
    supa.from('systems').select('*'),
    supa.from('sub_systems').select('*'),
  ]);
  if(rec.error) throw rec.error;
  if(test.error) throw test.error;
  if(stat.error) throw stat.error;
  if(sys.error) throw sys.error;
  if(subs.error) throw subs.error;

  const systems = (sys.data||[]).map(s=>({
    id:s.id, name:s.name,
    subs:(subs.data||[]).filter(x=>x.system_id===s.id).map(x=>({id:x.id, name:x.name})),
  }));
  return {
    records: (rec.data||[]).map(rowToRecord),
    testers: (test.data||[]).map(rowToTester),
    statuses: (stat.data||[]).map(rowToStatus),
    systems,
  };
}

/* ---- seed (first-ever connection: push the bundled dataset up) ---- */
async function supaSeedIfEmpty(){
  const { count, error } = await supa.from('qc_records').select('id', {count:'exact', head:true});
  if(error) throw error;
  if(count && count>0) return false; // already has data — don't overwrite
  const systemRows = state.systems.map(systemToRow);
  const subRows = state.systems.flatMap(s=>s.subs.map(sub=>subToRow(s.id, sub)));
  const testerRows = state.testers.map(testerToRow);
  const statusRows = state.statuses.map((s,i)=>statusToRow(s,i));
  const recordRows = state.records.map(recordToRow);
  if(systemRows.length) await supa.from('systems').upsert(systemRows);
  if(subRows.length) await supa.from('sub_systems').upsert(subRows);
  if(testerRows.length) await supa.from('testers').upsert(testerRows);
  if(statusRows.length) await supa.from('statuses').upsert(statusRows);
  if(recordRows.length) await supa.from('qc_records').upsert(recordRows);
  return true;
}

/* ---- push (diffed against last-known-synced ids, so deletes propagate too) ---- */
let lastSyncedIds = { qc_records:new Set(), testers:new Set(), statuses:new Set(), systems:new Set(), sub_systems:new Set() };
function snapshotOfSharedState(){
  return JSON.stringify({ r:state.records, t:state.testers, s:state.statuses, sy:state.systems });
}
async function syncTable(table, rows, idKey){
  const currentIds = new Set(rows.map(r=>r[idKey]));
  const prevIds = lastSyncedIds[table] || new Set();
  const toDelete = [...prevIds].filter(id=>!currentIds.has(id));
  if(rows.length) { const {error} = await supa.from(table).upsert(rows); if(error) throw error; }
  if(toDelete.length) { const {error} = await supa.from(table).delete().in(idKey, toDelete); if(error) throw error; }
  lastSyncedIds[table] = currentIds;
}
async function pushFullStateToSupabase(){
  if(!supa) return;
  const snap = snapshotOfSharedState();
  if(snap===lastPushedSnapshot) return; // nothing shared changed — skip the network round trip
  try{
    const systemRows = state.systems.map(systemToRow);
    const subRows = state.systems.flatMap(s=>s.subs.map(sub=>subToRow(s.id, sub)));
    await syncTable('systems', systemRows, 'id');
    await syncTable('sub_systems', subRows, 'id');
    await syncTable('testers', state.testers.map(testerToRow), 'id');
    await syncTable('statuses', state.statuses.map((s,i)=>statusToRow(s,i)), 'id');
    await syncTable('qc_records', state.records.map(recordToRow), 'id');
    lastPushedSnapshot = snap;
  }catch(e){ console.warn('Supabase sync failed (will retry on next change):', e && e.message); }
}
function scheduleSupaSync(){
  if(!supa) return;
  clearTimeout(supaPushTimer);
  supaPushTimer = setTimeout(pushFullStateToSupabase, 800);
}

/* ---- realtime: reflect other people's changes live ---- */
function subscribeRealtime(){
  if(!supa || realtimeChannel) return;
  realtimeChannel = supa.channel('qc-shared-changes')
    .on('postgres_changes', {event:'*', schema:'public', table:'qc_records'}, handleRealtimeRecords)
    .on('postgres_changes', {event:'*', schema:'public', table:'testers'}, handleRealtimeTesters)
    .on('postgres_changes', {event:'*', schema:'public', table:'statuses'}, handleRealtimeStatuses)
    .on('postgres_changes', {event:'*', schema:'public', table:'systems'}, handleRealtimeSystems)
    .on('postgres_changes', {event:'*', schema:'public', table:'sub_systems'}, handleRealtimeSubSystems)
    .subscribe();
}

/* ---- pull shared data once a session is established; scoped automatically
   by RLS (admins see everything, testers see only their own records). ---- */
async function loadSharedDataForCurrentSession(){
  if(!supa || !state.session) return;
  try{
    if(state.accessRole==='admin') await supaSeedIfEmpty();
    const remote = await supaPullAll();
    state.records = remote.records;
    state.testers = remote.testers;
    state.statuses = remote.statuses.length ? remote.statuses : state.statuses;
    state.systems = remote.systems;
    resolveAccessForSession(state.session);
    state.nextSeq = Math.max(state.nextSeq, computeNextSeq(state.records));
    lastSyncedIds.qc_records = new Set(state.records.map(r=>r.id));
    lastSyncedIds.testers = new Set(state.testers.map(t=>t.id));
    lastSyncedIds.statuses = new Set(state.statuses.map(s=>s.id));
    lastSyncedIds.systems = new Set(state.systems.map(s=>s.id));
    lastSyncedIds.sub_systems = new Set(state.systems.flatMap(s=>s.subs.map(x=>x.id)));
    lastPushedSnapshot = snapshotOfSharedState();
    state.syncMode = 'online';
    subscribeRealtime();
  }catch(e){
    console.warn('Supabase data load failed (staying on last-known data):', e && e.message);
  }
}
function markInSyncAndRender(){
  lastPushedSnapshot = snapshotOfSharedState(); // this state now matches the server — don't echo it back
  render();
}
function handleRealtimeRecords(payload){
  if(payload.eventType==='DELETE'){ state.records = state.records.filter(r=>r.id!==payload.old.id); }
  else{
    const rec = rowToRecord(payload.new);
    const idx = state.records.findIndex(r=>r.id===rec.id);
    if(idx>=0) state.records[idx] = Object.assign({}, state.records[idx], rec);
    else state.records.unshift(rec);
  }
  state.nextSeq = Math.max(state.nextSeq, computeNextSeq(state.records));
  markInSyncAndRender();
}
function handleRealtimeTesters(payload){
  if(payload.eventType==='DELETE'){ state.testers = state.testers.filter(t=>t.id!==payload.old.id); }
  else{
    const t = rowToTester(payload.new);
    const idx = state.testers.findIndex(x=>x.id===t.id);
    if(idx>=0) state.testers[idx] = t; else state.testers.push(t);
  }
  markInSyncAndRender();
}
function handleRealtimeStatuses(payload){
  if(payload.eventType==='DELETE'){ state.statuses = state.statuses.filter(s=>s.id!==payload.old.id); }
  else{
    const s = rowToStatus(payload.new);
    const idx = state.statuses.findIndex(x=>x.id===s.id);
    if(idx>=0) state.statuses[idx] = Object.assign({}, state.statuses[idx], s); else state.statuses.push(s);
  }
  markInSyncAndRender();
}
function handleRealtimeSystems(payload){
  if(payload.eventType==='DELETE'){ state.systems = state.systems.filter(s=>s.id!==payload.old.id); }
  else{
    const idx = state.systems.findIndex(x=>x.id===payload.new.id);
    if(idx>=0) state.systems[idx].name = payload.new.name;
    else state.systems.push({id:payload.new.id, name:payload.new.name, subs:[]});
  }
  markInSyncAndRender();
}
function handleRealtimeSubSystems(payload){
  if(payload.eventType==='DELETE'){
    state.systems.forEach(s=>{ s.subs = s.subs.filter(x=>x.id!==payload.old.id); });
  } else {
    const sys = state.systems.find(s=>s.id===payload.new.system_id);
    if(sys){
      const idx = sys.subs.findIndex(x=>x.id===payload.new.id);
      if(idx>=0) sys.subs[idx].name = payload.new.name;
      else sys.subs.push({id:payload.new.id, name:payload.new.name});
    }
  }
  markInSyncAndRender();
}

/* ---------------- Attachments (real file storage) ----------------
   Online: uploaded to a Supabase Storage bucket ("attachments") and
   referenced by public URL — persistent and shared with the team, viewable
   from any device. Offline: read as a base64 data URL and stored inline with
   the record — still a real, viewable image, just local to this browser
   until the record syncs. Either way, images render as real thumbnails
   rather than just a filename. */
const MAX_ATTACHMENT_MB = 5;
const ATTACHMENT_BUCKET = 'attachments';

async function handleAttachmentFiles(files){
  if(!state.modal || !state.modal.data || !state.modal.data.record) return;
  const rec = state.modal.data.record;
  rec.attachments = rec.attachments || [];
  for(const f of files){
    if(f.size > MAX_ATTACHMENT_MB*1024*1024){
      toast(t('form.attachTooBig')(f.name, MAX_ATTACHMENT_MB), 'error');
      continue;
    }
    const isImage = !!(f.type && f.type.startsWith('image/'));
    if(supa){
      try{
        const ext = (f.name.split('.').pop()||'').toLowerCase().replace(/[^a-z0-9]/g,'');
        const path = uid('att')+(ext?'.'+ext:'');
        const { error } = await supa.storage.from(ATTACHMENT_BUCKET).upload(path, f, {cacheControl:'3600', upsert:false});
        if(error) throw error;
        const { data: pub } = supa.storage.from(ATTACHMENT_BUCKET).getPublicUrl(path);
        rec.attachments.push({name:f.name, size:f.size, type:f.type||'', url:pub.publicUrl, path});
      }catch(e){
        console.warn('Attachment upload failed, saving locally instead:', e && e.message);
        await addAttachmentLocally(rec, f, isImage);
      }
    } else {
      await addAttachmentLocally(rec, f, isImage);
    }
    render();
  }
}
function addAttachmentLocally(rec, f, isImage){
  return new Promise(resolve=>{
    if(!isImage){ rec.attachments.push({name:f.name, size:f.size, type:f.type||''}); resolve(); return; }
    const reader = new FileReader();
    reader.onload = ()=>{ rec.attachments.push({name:f.name, size:f.size, type:f.type||'', dataUrl:reader.result}); resolve(); };
    reader.onerror = ()=>{ rec.attachments.push({name:f.name, size:f.size, type:f.type||''}); resolve(); };
    reader.readAsDataURL(f);
  });
}
function attachmentImageSrc(att){ return att.url || att.dataUrl || null; }
function isImageAttachment(att){ return !!(att.type && att.type.startsWith('image/')) || !!(att.url || att.dataUrl); }
function deleteAttachmentFromStorage(att){
  if(supa && att && att.path){
    supa.storage.from(ATTACHMENT_BUCKET).remove([att.path]).catch(()=>{});
  }
}
function attachmentChipHTML(f, idx){
  const src = attachmentImageSrc(f);
  if(src && isImageAttachment(f)){
    return `<div class="file-chip file-chip-image">
      <a href="${esc(src)}" target="_blank" rel="noopener"><img src="${esc(src)}" alt="${esc(f.name)}"></a>
      <span class="file-chip-name">${esc(f.name)}</span>
      <button type="button" class="btn btn-ghost btn-sm" data-action="remove-attachment" data-idx="${idx}">${ICONS.x}</button>
    </div>`;
  }
  return `<div class="file-chip"><span>${esc(f.name)}</span><button type="button" class="btn btn-ghost btn-sm" data-action="remove-attachment" data-idx="${idx}">${ICONS.x}</button></div>`;
}
function attachmentGalleryItemHTML(f){
  const src = attachmentImageSrc(f);
  if(src && isImageAttachment(f)){
    return `<a class="gallery-thumb" href="${esc(src)}" target="_blank" rel="noopener" title="${esc(f.name)}"><img src="${esc(src)}" alt="${esc(f.name)}"></a>`;
  }
  return `<span class="badge-soft" style="background:var(--surface-alt)">${ICONS.file} ${esc(f.name)}</span>`;
}


/* ---------------- Reference data ---------------- */
const DEFAULT_STATUSES = [
  {id:'passed', label:'Passed', th:'ผ่านแล้ว (ยังไม่ติดตั้ง)', desc:'Passed but not yet installed', descTh:'ผ่านการทดสอบแล้ว แต่ยังไม่ได้ติดตั้งใช้งาน', color:'passed'},
  {id:'installed', label:'Installed', th:'ติดตั้งแล้ว', desc:'Passed and installed to production', descTh:'ผ่านการทดสอบและติดตั้งใช้งานจริงแล้ว', color:'installed'},
  {id:'failed', label:'Failed', th:'ไม่ผ่าน', desc:'Did not pass testing', descTh:'ไม่ผ่านการทดสอบ', color:'failed'},
  {id:'under_revision', label:'Under Revision', th:'อยู่ระหว่างแก้ไข', desc:'Being revised after issues found', descTh:'กำลังแก้ไขหลังพบปัญหา', color:'under_revision'},
  {id:'pending_test', label:'Pending Test', th:'รอทดสอบ', desc:'Waiting to be tested', descTh:'รอการทดสอบ', color:'pending_test'},
  {id:'cancelled', label:'Cancelled', th:'ยกเลิก', desc:'No longer being pursued', descTh:'ยกเลิกไม่ดำเนินการต่อ', color:'cancelled'},
  {id:'testing', label:'Testing', th:'กำลังทดสอบ', desc:'Currently under test', descTh:'อยู่ระหว่างการทดสอบ', color:'testing'},
];
const ISSUE_TYPES = [
  {id:'edit', en:'Edit Existing Software', th:'แก้ไขซอฟต์แวร์เดิม'},
  {id:'new_feature', en:'Add New Feature', th:'เพิ่มฟีเจอร์ใหม่'},
  {id:'improve_display', en:'Improve Display / UI', th:'ปรับปรุงการแสดงผล'},
];
function issueTypeLabel(id){ const it = ISSUE_TYPES.find(x=>x.id===id); if(!it) return id; return state.lang==='th'? it.th : it.en; }
function statusLabel(s){ return state.lang==='th' ? (s.th||s.label) : s.label; }
function statusDesc(s){ return state.lang==='th' ? (s.descTh||s.desc||'') : (s.desc||''); }

const DEFAULT_RECORDS = [{"id": "QC-2026-0055", "mainSystem": "ระบบฌาปนกิจสงเคราะห์กำนันผู้ใหญ่บ้าน", "subSystem": "รายงานแดชบอร์ด", "programName": "web-ckn-dashboard", "version": "1.0.22", "issueDescription": "รายงานแดชบอร์ด เพิ่มการ์ดแสดงข้อมูลจำนวนสมาชิก ณ ปัจจุบัน", "issueType": "new_feature", "status": "installed", "relatedApps": "Web Ckn Dashboard, API Dashboard", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-07-17", "reportedTime": "08:26", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0054", "mainSystem": "ระบบฌาปนกิจสงเคราะห์กำนันผู้ใหญ่บ้าน", "subSystem": "ระบบจัดการสมาชิก", "programName": "web-ckn-manage", "version": "1.0.74", "issueDescription": "หน้าผู้รับผลประโยชน์ เพิ่มการแสดงแจ้งเตือนกรณีไม่มีสิทธิ์ linkage", "issueType": "new_feature", "status": "installed", "relatedApps": "Web Ckn Manage", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-07-17", "reportedTime": "08:24", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0053", "mainSystem": "ระบบกำนันผู้ใหญ่บ้าน", "subSystem": "ระบบเครื่องราชฯ", "programName": "api-insignia", "version": "1.0.41", "issueDescription": "แก้ไข รายงานถอดถอนชื่อ ความผิดอาญา ไม่แสดงพฤติการณ์", "issueType": "edit", "status": "installed", "relatedApps": "API Insignia", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-07-16", "reportedTime": "11:33", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0052", "mainSystem": "ระบบกำนันผู้ใหญ่บ้าน", "subSystem": "ระบบเครื่องราชฯ", "programName": "web-insignia", "version": "1.0.41", "issueDescription": "แก้ไข list ปี ระบบเครื่องราชฯ", "issueType": "edit", "status": "installed", "relatedApps": "Web Insignia", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-07-15", "reportedTime": "16:19", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0051", "mainSystem": "ระบบฌาปนกิจสงเคราะห์กำนันผู้ใหญ่บ้าน", "subSystem": "ระบบจัดการสมาชิก", "programName": "web-ckn-manage", "version": "1.0.73", "issueDescription": "ระบบตรวจสอบสถานะการเป็นสมาชิก แสดงข้อมูลหลังกดปุ่มกลับ", "issueType": "edit", "status": "installed", "relatedApps": "Web Ckn Manage", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-07-15", "reportedTime": "16:14", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0050", "mainSystem": "ระบบกำนันผู้ใหญ่บ้าน", "subSystem": "ระบบเครื่องราชฯ", "programName": "web-insignia", "version": "1.0.40", "issueDescription": "แก้ไขโปรแกรม ขอถอดถอนรายชื่อ ผู้ได้รับเครื่องราชฯ", "issueType": "edit", "status": "installed", "relatedApps": "Web Insignia", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-07-15", "reportedTime": "12:58", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0049", "mainSystem": "ระบบกำนันผู้ใหญ่บ้าน", "subSystem": "ระบบพิมพ์บัตร", "programName": "web-printcard", "version": "1.2.11", "issueDescription": "พิมพ์ซ่อมบัตรเจ้าหน้าที่ แก้ไขวันที่พิมพ์ให้ได้ล่วงหน้า 7 วัน", "issueType": "new_feature", "status": "installed", "relatedApps": "Web Printcard", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-07-14", "reportedTime": "09:41", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0048", "mainSystem": "ระบบฌาปนกิจสงเคราะห์กำนันผู้ใหญ่บ้าน", "subSystem": "ระบบสมัครสมาชิกออนไลน์", "programName": "web-ckn-signup", "version": "1.0.18", "issueDescription": "ลบการอัปโหลดเอกสารการชำระเงินสงเคราะห์ล่วงหน้า", "issueType": "edit", "status": "installed", "relatedApps": "Web Ckn Signup", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-07-14", "reportedTime": "09:40", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0047", "mainSystem": "ระบบกำนันผู้ใหญ่บ้าน", "subSystem": "บันทึกข้อมูลคณะกรรมการหมู่บ้าน", "programName": "web-committee", "version": "1.0.15", "issueDescription": "แก้ไขวันที่ครบวาระไม่แสดง", "issueType": "edit", "status": "installed", "relatedApps": "Web Committee", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-07-10", "reportedTime": "08:48", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0046", "mainSystem": "ระบบฌาปนกิจสงเคราะห์กำนันผู้ใหญ่บ้าน", "subSystem": "บันทึกข้อมูลคณะกรรมการหมู่บ้าน", "programName": "web-committee", "version": "1.0.15", "issueDescription": "แก้ไขวันที่ครบวาระไม่แสดง [ผิดระบบ]", "issueType": "edit", "status": "cancelled", "relatedApps": "Web Committee", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-07-10", "reportedTime": "08:41", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0045", "mainSystem": "ระบบกำนันผู้ใหญ่บ้าน", "subSystem": "บันทึกข้อมูลคณะกรรมการหมู่บ้าน", "programName": "web-committee", "version": "1.0.15", "issueDescription": "แก้ไขวันที่ครบวาระไม่แสดง [ซ้ำ]", "issueType": "edit", "status": "cancelled", "relatedApps": "Web Committee", "responsible": "003338", "tester": "T001", "testDate": "2026-07-10", "reportedTime": "08:41", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0044", "mainSystem": "ระบบฌาปนกิจสงเคราะห์กำนันผู้ใหญ่บ้าน", "subSystem": "ระบบสมัครสมาชิกออนไลน์", "programName": "web-ckn-manage", "version": "1.0.72", "issueDescription": "ปรับการแสดงผลแถบเลือกเมนูในโทรศัพท์มือถือ (จำลองสำหรับเจ้าหน้าที่)", "issueType": "improve_display", "status": "installed", "relatedApps": "Web Ckn Manage", "responsible": "ชรินทร์", "tester": "T002", "testDate": "2026-07-10", "reportedTime": "08:14", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0043", "mainSystem": "ระบบฌาปนกิจสงเคราะห์กำนันผู้ใหญ่บ้าน", "subSystem": "ระบบสมัครสมาชิกออนไลน์", "programName": "web-ckn-signup", "version": "1.0.17", "issueDescription": "ปรับการแสดงผลแถบเลือกเมนูในโทรศัพท์มือถือ", "issueType": "improve_display", "status": "installed", "relatedApps": "Web Ckn Signup", "responsible": "ชรินทร์", "tester": "T002", "testDate": "2026-07-10", "reportedTime": "08:13", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0042", "mainSystem": "ระบบเศรษฐกิจชุมชน", "subSystem": "ข้อมูลบัญชี", "programName": "web-economic", "version": "1.3.1", "issueDescription": "ระบบเศรษฐกิจชุมชน: เพิ่มบัญชีรองรับสูงสุด 2 บัญชี, ปรับปล่อยกู้เลือกบัญชี", "issueType": "new_feature", "status": "installed", "relatedApps": "Web Economic, API Economic", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-07-09", "reportedTime": "09:30", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0041", "mainSystem": "ระบบเศรษฐกิจชุมชน", "subSystem": "รายงานสถิติ", "programName": "รายงานและสถิตแสดงรายละเอียดบัญชีคงเหลือ", "version": "1.0.0", "issueDescription": "ปรับ รายงานและสถิตแสดงรายละเอียดบัญชีคงเหลือ [เปิดซ้ำ]", "issueType": "improve_display", "status": "failed", "relatedApps": "Web Economic", "responsible": "รัตนะ", "tester": "T001", "testDate": "2026-07-09", "reportedTime": "09:23", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0040", "mainSystem": "ระบบเศรษฐกิจชุมชน", "subSystem": "ระบบงานการเงิน", "programName": "จัดการข้อมูลการเงิน > เงินปล่อยกู้", "version": "1.0.0", "issueDescription": "ปรับปล่อยกู้เลือกบัญชีสำหรับกู้เงิน [เปิดซ้ำ]", "issueType": "edit", "status": "testing", "relatedApps": "Web Economic", "responsible": "รัตนะ", "tester": "T001", "testDate": "2026-07-09", "reportedTime": "09:23", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0039", "mainSystem": "ระบบเศรษฐกิจชุมชน", "subSystem": "ข้อมูลบัญชี", "programName": "ข้อมูลบัญชี เพิ่มบัญชีรองรับสูงสุด 2 บัญชี", "version": "1.0.0", "issueDescription": "เพิ่มบัญชีรองรับสูงสุด 2 บัญชี [หมายเหตุ: เปิดซ้ำ]", "issueType": "new_feature", "status": "testing", "relatedApps": "Web Economic", "responsible": "รัตนะ", "tester": "T001", "testDate": "2026-07-09", "reportedTime": "09:22", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0038", "mainSystem": "ระบบฌาปนกิจสงเคราะห์กำนันผู้ใหญ่บ้าน", "subSystem": "รายงานสถิติ", "programName": "รายงานสมาชิกค้างชำระเงินสงเคราะห์", "version": "1.0.0", "issueDescription": "เปิดเมนู รายงานสมาชิกค้างชำระเงินสงเคราะห์", "issueType": "edit", "status": "installed", "relatedApps": "Web Ckn Manage", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-07-08", "reportedTime": "13:23", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0037", "mainSystem": "ระบบกำนันผู้ใหญ่บ้าน", "subSystem": "บันทึกข้อมูลประกาศราชกิจจาฯ", "programName": "โปรแกรม บันทึกข้อมูลประกาศราชกิจจาฯ แก้ไข การเรียงลำดับรายชื่อ", "version": "1.0.0", "issueDescription": "แก้ไข การเรียงลำดับรายชื่อให้คล้ายกับ พิมพ์ ทถ.2", "issueType": "edit", "status": "installed", "relatedApps": "Web Committee", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-07-08", "reportedTime": "10:38", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0036", "mainSystem": "ระบบฌาปนกิจสงเคราะห์กำนันผู้ใหญ่บ้าน", "subSystem": "ระบบจัดการเอกสาร", "programName": "สมัครสมาชิกสำหรับเจ้าหน้าที่ แก้ไขปุ่มสแกน", "version": "1.0.0", "issueDescription": "แก้ไขไม่สามารถกดปุ่มสแกนเอกสารได้", "issueType": "edit", "status": "installed", "relatedApps": "Web Ckn Manage", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-07-08", "reportedTime": "08:55", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0035", "mainSystem": "ระบบฌาปนกิจสงเคราะห์กำนันผู้ใหญ่บ้าน", "subSystem": "ระบบจัดการเอกสาร", "programName": "สมัครสมาชิกสำหรับเจ้าหน้าที่ และจัดเก็บเอกสารเพิ่มเติม", "version": "1.0.0", "issueDescription": "แก้ไขกรณีบันทึกข้อมูลแล้วไม่สามารถเชื่อมต่อ linkage ได้", "issueType": "new_feature", "status": "installed", "relatedApps": "Web Ckn Manage", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-07-07", "reportedTime": "14:00", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0034", "mainSystem": "ระบบกำนันผู้ใหญ่บ้าน", "subSystem": "ระบบพิมพ์บัตร", "programName": "พิมพ์บัตรประจำตัวกำนันผู้ใหญ่บ้าน", "version": "1.0.0", "issueDescription": "บันทึกใบคำขอมีบัตร เจ้าหน้าที่กดปุ่มบันทึกไม่ได้", "issueType": "edit", "status": "installed", "relatedApps": "Web Printcard", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-07-07", "reportedTime": "13:59", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0033", "mainSystem": "ระบบฌาปนกิจสงเคราะห์กำนันผู้ใหญ่บ้าน", "subSystem": "ระบบจัดการสมาชิก", "programName": "เพิ่มเติมรายชื่อธนาคารของผู้รับผลประโยชน์", "version": "1.0.0", "issueDescription": "เพิ่มเติมรายชื่อธนาคารของผู้รับผลประโยชน์ ให้ครบที่มีอยู่ในประเทศ", "issueType": "new_feature", "status": "installed", "relatedApps": "Web Ckn Manage", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-07-07", "reportedTime": "10:41", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0032", "mainSystem": "ระบบฌาปนกิจสงเคราะห์กำนันผู้ใหญ่บ้าน", "subSystem": "ระบบจัดการเอกสาร", "programName": "แก้ไขสลับเมนู พิมพ์ใบชำระกับอัปโหลดเอกสาร ระบบ ฌกน.", "version": "1.0.0", "issueDescription": "แก้ไขสลับเมนู พิมพ์ใบชำระ กับ อัปโหลดเอกสาร", "issueType": "edit", "status": "installed", "relatedApps": "Web Ckn Manage", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-07-03", "reportedTime": "08:57", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0031", "mainSystem": "ระบบเศรษฐกิจชุมชน", "subSystem": "ข้อมูลบัญชี", "programName": "ปรับแก้ไขสิทธิ์การแก้ไขและเพิ่มอัปโหลดเอกสาร", "version": "1.0.0", "issueDescription": "ปรับสิทธิ์การแก้ไข เพิ่มอัปโหลดไฟล์เอกสาร", "issueType": "new_feature", "status": "installed", "relatedApps": "Web Economic", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-07-03", "reportedTime": "08:53", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0030", "mainSystem": "ระบบฌาปนกิจสงเคราะห์กำนันผู้ใหญ่บ้าน", "subSystem": "ระบบจัดการสมาชิก", "programName": "เปลี่ยนชื่อและลายเซ็น ใบต้อนรับสมาชิกในส่วนของหน้าเจ้าหน้าที่", "version": "1.0.0", "issueDescription": "เปลี่ยนชื่อและลายเซ็น ใบต้อนรับสมาชิกในส่วนของหน้าเจ้าหน้าที่", "issueType": "edit", "status": "installed", "relatedApps": "Web Ckn Manage", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-07-02", "reportedTime": "14:33", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0029", "mainSystem": "ระบบฌาปนกิจสงเคราะห์กำนันผู้ใหญ่บ้าน", "subSystem": "ระบบจัดการสมาชิก", "programName": "เปลี่ยนชื่อและลายเซ็น ใบต้อนรับสมาชิก เพิ่ม Link Line", "version": "1.0.0", "issueDescription": "เปลี่ยนชื่อและลายเซ็น ใบต้อนรับสมาชิก, เพิ่ม Link Line", "issueType": "new_feature", "status": "installed", "relatedApps": "Web Ckn Signup", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-07-01", "reportedTime": "16:18", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0028", "mainSystem": "ระบบฌาปนกิจสงเคราะห์กำนันผู้ใหญ่บ้าน", "subSystem": "ระบบสมัครสมาชิกออนไลน์", "programName": "เพิ่มเติมการแสดงใบแจ้งชำระเงิน จากระบบสมัครสมาชิก", "version": "1.0.0", "issueDescription": "เพิ่มเติมการแสดงใบแจ้งชำระเงิน จากระบบสมัครสมาชิก และ ชำระเงินสงเคราะห์รายเดือน", "issueType": "new_feature", "status": "installed", "relatedApps": "Web Ckn Signup", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-06-30", "reportedTime": "16:25", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0027", "mainSystem": "ระบบกำนันผู้ใหญ่บ้าน", "subSystem": "รายงานอัตรากำลัง", "programName": "รายงานอัตรากำลัง เพิ่มปุ่ม พิมพ์ excel", "version": "1.0.0", "issueDescription": "รายงานอัตรากำลัง เพิ่มปุ่ม พิมพ์ excel", "issueType": "new_feature", "status": "installed", "relatedApps": "Web Committee", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-06-25", "reportedTime": "15:07", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0026", "mainSystem": "ระบบฌาปนกิจสงเคราะห์กำนันผู้ใหญ่บ้าน", "subSystem": "เอกสารดาวน์โหลด", "programName": "เพิ่มแบบฟอร์มดาวน์โหลด คำร้องขอคืนสภาพสมาชิกแบบ pdf", "version": "1.0.0", "issueDescription": "เพิ่มแบบฟอร์มดาวน์โหลด คำร้องขอคืนสภาพสมาชิกแบบ pdf", "issueType": "new_feature", "status": "installed", "relatedApps": "Web Ckn Manage", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-06-23", "reportedTime": "15:27", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0025", "mainSystem": "ระบบกำนันผู้ใหญ่บ้าน", "subSystem": "ระบบพิมพ์บัตร", "programName": "แก้ไขวันหมดอายุบัตร ตำแหน่งสารวัติกำนัน", "version": "1.0.0", "issueDescription": "แก้ไขวันหมดอายุบัตร ตำแหน่งสารวัติกำนัน", "issueType": "edit", "status": "installed", "relatedApps": "Web Printcard", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-06-23", "reportedTime": "15:27", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0024", "mainSystem": "ระบบกำนันผู้ใหญ่บ้าน", "subSystem": "ระบบพิมพ์บัตร,ระบบกิจกรรมรณรงค์", "programName": "ระบบพิมพ์บัตร,ระบบกิจกรรมรณรงค์,lib menu มือถือ", "version": "1.0.0", "issueDescription": "ระบบพิมพ์บัตร ปรับให้ตำแหน่ง กำนัน แพทย์ สารวัติกำนัน ไม่แสดงหมู่บ้าน", "issueType": "new_feature", "status": "installed", "relatedApps": "Web Printcard", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-06-18", "reportedTime": "12:59", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0023", "mainSystem": "ระบบเศรษฐกิจชุมชน", "subSystem": "ระบบงานทั่วไป", "programName": "ปรับระบบการใช้งาน เพิ่ม/แก้ไข เฉพาะหน่วยงานตัวเองเท่านั้น", "version": "1.0.0", "issueDescription": "ปรับระบบการใช้งาน เพิ่ม/แก้ไข เฉพาะหน่วยงานตัวเองเท่านั้น", "issueType": "new_feature", "status": "installed", "relatedApps": "Web Economic", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-06-16", "reportedTime": "14:36", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0022", "mainSystem": "ระบบฌาปนกิจสงเคราะห์กำนันผู้ใหญ่บ้าน", "subSystem": "ระบบสมัครสมาชิกออนไลน์", "programName": "ปรับหน้าจอ ระบบสมัครสมาชิก ด้วยตนเอง", "version": "1.0.0", "issueDescription": "ปรับหน้าจอ ระบบสมัครสมาชิก ด้วยตนเอง", "issueType": "improve_display", "status": "installed", "relatedApps": "Web Ckn Signup", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-06-16", "reportedTime": "14:36", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0021", "mainSystem": "ระบบกำนันผู้ใหญ่บ้าน", "subSystem": "ระบบกิจกรรมรณรงค์", "programName": "ระบบกิจกรรมรณรงค์ เพิ่มตัวเลือกปีปัจจุบัน", "version": "1.0.0", "issueDescription": "ระบบกิจกรรมรณรงค์ เพิ่มตัวเลือกปีปัจจุบัน", "issueType": "new_feature", "status": "installed", "relatedApps": "Web Committee", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-06-16", "reportedTime": "14:35", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0020", "mainSystem": "ระบบฌาปนกิจสงเคราะห์กำนันผู้ใหญ่บ้าน", "subSystem": "ระบบสมัครสมาชิกออนไลน์", "programName": "แก้ไขหน้าจอสมัครสมาชิก ระบบ ฌกน.", "version": "1.0.0", "issueDescription": "แก้ไขหน้าจอสมัครสมาชิกเพิ่มหน้าจอผู้รับผลประโยชน์", "issueType": "new_feature", "status": "installed", "relatedApps": "Web Ckn Signup", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-06-12", "reportedTime": "14:37", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0019", "mainSystem": "ระบบฌาปนกิจสงเคราะห์กำนันผู้ใหญ่บ้าน", "subSystem": "ระบบการเงิน", "programName": "แก้ไขที่อยู่เอกสาร พิมพ์ใบแจ้งยอดค้างชำระ ระบบ ฌกน.", "version": "1.0.0", "issueDescription": "แก้ไขที่อยู่เอกสาร พิมพ์ใบแจ้งยอดค้างชำระ", "issueType": "edit", "status": "installed", "relatedApps": "Web Ckn Manage", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-06-11", "reportedTime": "09:59", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0018", "mainSystem": "ระบบฌาปนกิจสงเคราะห์กำนันผู้ใหญ่บ้าน", "subSystem": "ระบบสมัครสมาชิกออนไลน์", "programName": "แก้ไขโปรแกรมสมัครสมาชิกไม่สามารถบันทึกได้", "version": "1.0.0", "issueDescription": "แก้ไขโปรแกรมสมัครสมาชิกไม่สามารถบันทึกได้", "issueType": "edit", "status": "installed", "relatedApps": "Web Ckn Signup", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-06-10", "reportedTime": "14:28", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0017", "mainSystem": "ระบบกำนันผู้ใหญ่บ้าน", "subSystem": "ระบบประเมิน 4 ปี", "programName": "ประเมินผลผู้ใหญ่บ้านแบบ 4 ปี แก้ไขใบพิมพ์ ปผญ1 ตกหน้า2", "version": "1.0.0", "issueDescription": "แก้ไขใบพิมพ์ ปผญ1 ตกหน้า2", "issueType": "edit", "status": "installed", "relatedApps": "Web Committee", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-06-08", "reportedTime": "09:34", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0016", "mainSystem": "ระบบกำนันผู้ใหญ่บ้าน", "subSystem": "ระบบประเมิน 4 ปี", "programName": "การประเมินผลผู้ใหญ่บ้านแบบ 4 ปี แก้ไขโปรแกรมพิมพ์ ปผญ 1 และ 2", "version": "1.0.0", "issueDescription": "แก้ไขโปรแกรมพิมพ์ ปผญ 1 และ 2 ไม่สามารถพิมพ์ได้", "issueType": "edit", "status": "installed", "relatedApps": "Web Committee", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-06-01", "reportedTime": "16:14", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0015", "mainSystem": "ระบบเศรษฐกิจชุมชน", "subSystem": "ระบบงานการเงิน", "programName": "ปรับแก้ไขข้อความและ เพิ่มชื่อผู้กู้ เบอร์โทร ระบบปล่อยเงินกู้", "version": "1.0.0", "issueDescription": "ระบบเศรษฐกิจชุมชน ปรับแก้ไขข้อความและ เพิ่มชื่อผู้กู้ เบอร์โทร ระบบปล่อยเงินกู้", "issueType": "new_feature", "status": "installed", "relatedApps": "Web Economic", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-05-29", "reportedTime": "11:00", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0014", "mainSystem": "ระบบฌาปนกิจสงเคราะห์กำนันผู้ใหญ่บ้าน", "subSystem": "ระบบสมัครสมาชิกออนไลน์", "programName": "เพิ่มหน้าจอสมัครสมาชิกด้วยตนเอง ให้กรอกข้อมูลผู้รับผลประโยชน์ได้", "version": "1.0.0", "issueDescription": "เพิ่มหน้าจอสมัครสมาชิกด้วยตนเอง ให้กรอกข้อมูลผู้รับผลประโยชน์ได้", "issueType": "new_feature", "status": "installed", "relatedApps": "Web Ckn Signup", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-05-26", "reportedTime": "13:43", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0013", "mainSystem": "ระบบกำนันผู้ใหญ่บ้าน", "subSystem": "ระบบพิมพ์บัตร", "programName": "แก้ไข lib ติดต่อเครื่องพิมพ์บัตร", "version": "1.0.0", "issueDescription": "ระบบพิมพ์บัตร แก้ไข lib ติดต่อเครื่องพิมพ์บัตร", "issueType": "edit", "status": "installed", "relatedApps": "Web Printcard", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-05-25", "reportedTime": "11:05", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0012", "mainSystem": "ระบบกำนันผู้ใหญ่บ้าน", "subSystem": "ระบบงานพิมพ์", "programName": "สน13-19", "version": "1.0.0", "issueDescription": "แก้ไขพิมพ์แบบฟอร์ม สน13-19 ตำแหน่งตกบรรทัด", "issueType": "edit", "status": "installed", "relatedApps": "Web Printcard", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-05-22", "reportedTime": "14:43", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0011", "mainSystem": "ระบบฌาปนกิจสงเคราะห์กำนันผู้ใหญ่บ้าน", "subSystem": "รายงานสถิติ", "programName": "แก้ไขรายงาน บัญชีการเสียชีวิต/พ้นสถาพของสมาชิก แสดงอายุผิด", "version": "1.0.0", "issueDescription": "แก้ไขรายงาน บัญชีการเสียชีวิต/พ้นสถาพของสมาชิก แสดงอายุผิด", "issueType": "edit", "status": "installed", "relatedApps": "Web Ckn Dashboard", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-05-21", "reportedTime": "08:29", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0010", "mainSystem": "ระบบกำนันผู้ใหญ่บ้าน", "subSystem": "ระบบพิมพ์บัตร", "programName": "แก้ไข api กรณีรับรหัสผู้ลงลายมือชื่อ เกิน 3 หลัก", "version": "1.0.0", "issueDescription": "แก้ไข api กรณีรับรหัสผู้ลงลายมือชื่อ เกิน 3 หลัก", "issueType": "edit", "status": "installed", "relatedApps": "Web Printcard", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-05-18", "reportedTime": "11:33", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0009", "mainSystem": "ระบบฌาปนกิจสงเคราะห์กำนันผู้ใหญ่บ้าน", "subSystem": "ระบบจัดการสมาชิก", "programName": "เพิ่มข้อมูล เบอร์โทร เลขที่บัญชี สำหรับผู้รับผลรับโยชน์", "version": "1.0.0", "issueDescription": "เพิ่มข้อมูล เบอร์โทร เลขที่บัญชี สำหรับผู้รับผลรับโยชน์", "issueType": "new_feature", "status": "installed", "relatedApps": "Web Ckn Manage", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-05-15", "reportedTime": "15:30", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0008", "mainSystem": "ระบบกำนันผู้ใหญ่บ้าน", "subSystem": "ระบบประเมิน 4 ปี", "programName": "ปรับปรุง ระบบประเมิน 4 ปี แบบพิมพ์ ปผญ.5", "version": "1.0.0", "issueDescription": "แก้ไขข้อความกรณี ถ้าผ่านการประเมิน และ ไม่ผ่านการประเมิน", "issueType": "edit", "status": "installed", "relatedApps": "Web Committee", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-05-12", "reportedTime": "15:57", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0007", "mainSystem": "ระบบกำนันผู้ใหญ่บ้าน", "subSystem": "ระบบงานพิมพ์", "programName": "แก้ไขโปรแกรมพิมพ์ สน.12 สาเหตุการตาย ขึ้นเป็นเลข 0", "version": "1.0.0", "issueDescription": "แก้ไขโปรแกรมพิมพ์ สน12 สาเหตุการตาย ขึ้นเลข ๐", "issueType": "edit", "status": "installed", "relatedApps": "Web Printcard", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-05-11", "reportedTime": "16:46", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0006", "mainSystem": "ระบบกำนันผู้ใหญ่บ้าน", "subSystem": "รายงานและสถิติ", "programName": "เพิ่มรายงานรายงานผู้เข้าอบรมหลักสูตรกำนันผู้ใหญ่บ้านฯ", "version": "1.0.0", "issueDescription": "เพิ่มรายงานรายงานผู้เข้าอบรมหลักสูตรกำนันผู้ใหญ่บ้านฯ", "issueType": "new_feature", "status": "installed", "relatedApps": "Web Committee", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-05-11", "reportedTime": "15:38", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0005", "mainSystem": "ระบบกำนันผู้ใหญ่บ้าน", "subSystem": "ตรวจสอบข้อมูลทะเบียนประวัติ", "programName": "ข้อมูลผู้ที่ปฏิบัติหน้าที่ เพิ่มเมนู ตรวจสอบข้อมูลทะเบียนประวัติ", "version": "1.0.0", "issueDescription": "เพิ่มเมนู ตรวจสอบข้อมูลทะเบียนประวัติ ระบบกำนัน", "issueType": "new_feature", "status": "installed", "relatedApps": "Web Committee", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-05-08", "reportedTime": "17:43", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0004", "mainSystem": "ระบบกำนันผู้ใหญ่บ้าน", "subSystem": "ระบบเครื่องราชอิสริยาภรณ์", "programName": "โปรแกรมตรวจสอบรายชื่อผู้ที่เคยรับเครื่องราช", "version": "1.0.0", "issueDescription": "แก้ไขรายงานไม่ให้แสดงรายชื่อที่ถูกถอดถอน", "issueType": "edit", "status": "installed", "relatedApps": "Web Insignia", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-05-07", "reportedTime": "15:30", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0003", "mainSystem": "ระบบฌาปนกิจสงเคราะห์กำนันผู้ใหญ่บ้าน", "subSystem": "จัดการข้อมูลเสียชีวิต", "programName": "ระบบฌาปนกิจสงเคราะห์ เมนูจัดการข้อมู้เสียชีวิต จัดเตรียมใบประกาศ", "version": "1.0.0", "issueDescription": "แก้ไข เลขที่ประกาศ ไม่ให้บวกเลขเพิ่ม", "issueType": "new_feature", "status": "installed", "relatedApps": "Web Ckn Manage", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-05-07", "reportedTime": "12:14", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0002", "mainSystem": "ระบบกำนันผู้ใหญ่บ้าน", "subSystem": "บันทึกข้อมูล กม.", "programName": "web-committee", "version": "1.0.15", "issueDescription": "ปรับเพิ่มเงื่อนไขกรณีที่เลือกเป็น ผู้นำ/ผู้แทนกลุ่ม ให้กำหนดค่าวันที่ครบวาระเป็น 12/12/9999", "issueType": "new_feature", "status": "installed", "relatedApps": "Web Committee", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-05-06", "reportedTime": "10:36", "notes": "", "attachments": [], "createdAt": null}, {"id": "QC-2026-0001", "mainSystem": "ระบบกำนันผู้ใหญ่บ้าน", "subSystem": "ระบบเครื่องราชอิสริยาภรณ์", "programName": "โปรแกรมถอนชื่อจากการเสนอ ขอเพิ่มปี พ.ศ. ที่เลือกขอพระราชทานเครื่องราชฯ", "version": "1.0.0", "issueDescription": "ขอเพิ่มปี พ.ศ. ที่เลือกขอพระราชทานเครื่องราชฯ ตั้งแต่ปี 2565 ถึง ปีล่าสุดที่มีการขอเครื่องราชฯ", "issueType": "new_feature", "status": "installed", "relatedApps": "Web Insignia", "responsible": "ชรินทร์", "tester": "T001", "testDate": "2026-05-05", "reportedTime": "16:43", "notes": "", "attachments": [], "createdAt": null}];
const DEFAULT_TESTERS = [{"id": "T001", "name": "รัตนะ", "username": "tester01", "email": "", "role": "QC Tester", "accessRole": "tester", "department": "Quality Assurance", "active": true, "notes": "Imported from QC_Tracking file — please complete username/email."}, {"id": "T002", "name": "เสววลักษณ์", "username": "tester02", "email": "", "role": "QC Tester", "accessRole": "tester", "department": "Quality Assurance", "active": true, "notes": "Imported from QC_Tracking file — please complete username/email."}];
const DEFAULT_SYSTEMS = [{"id": "SYS01", "name": "ระบบฌาปนกิจสงเคราะห์กำนันผู้ใหญ่บ้าน", "subs": [{"id": "SYS01-1", "name": "รายงานแดชบอร์ด"}, {"id": "SYS01-2", "name": "ระบบจัดการสมาชิก"}, {"id": "SYS01-3", "name": "ระบบสมัครสมาชิกออนไลน์"}, {"id": "SYS01-4", "name": "บันทึกข้อมูลคณะกรรมการหมู่บ้าน"}, {"id": "SYS01-5", "name": "รายงานสถิติ"}, {"id": "SYS01-6", "name": "ระบบจัดการเอกสาร"}, {"id": "SYS01-7", "name": "เอกสารดาวน์โหลด"}, {"id": "SYS01-8", "name": "ระบบการเงิน"}, {"id": "SYS01-9", "name": "จัดการข้อมูลเสียชีวิต"}]}, {"id": "SYS02", "name": "ระบบกำนันผู้ใหญ่บ้าน", "subs": [{"id": "SYS02-1", "name": "ระบบเครื่องราชฯ"}, {"id": "SYS02-2", "name": "ระบบพิมพ์บัตร"}, {"id": "SYS02-3", "name": "บันทึกข้อมูลคณะกรรมการหมู่บ้าน"}, {"id": "SYS02-4", "name": "บันทึกข้อมูลประกาศราชกิจจาฯ"}, {"id": "SYS02-5", "name": "รายงานอัตรากำลัง"}, {"id": "SYS02-6", "name": "ระบบพิมพ์บัตร,ระบบกิจกรรมรณรงค์"}, {"id": "SYS02-7", "name": "ระบบกิจกรรมรณรงค์"}, {"id": "SYS02-8", "name": "ระบบประเมิน 4 ปี"}, {"id": "SYS02-9", "name": "ระบบงานพิมพ์"}, {"id": "SYS02-10", "name": "รายงานและสถิติ"}, {"id": "SYS02-11", "name": "ตรวจสอบข้อมูลทะเบียนประวัติ"}, {"id": "SYS02-12", "name": "ระบบเครื่องราชอิสริยาภรณ์"}, {"id": "SYS02-13", "name": "บันทึกข้อมูล กม."}]}, {"id": "SYS03", "name": "ระบบเศรษฐกิจชุมชน", "subs": [{"id": "SYS03-1", "name": "ข้อมูลบัญชี"}, {"id": "SYS03-2", "name": "รายงานสถิติ"}, {"id": "SYS03-3", "name": "ระบบงานการเงิน"}, {"id": "SYS03-4", "name": "ระบบงานทั่วไป"}]}];

function computeNextSeq(records){
  let max=0;
  records.forEach(r=>{ const m=/(\d+)\s*$/.exec(r.id); if(m) max=Math.max(max, parseInt(m[1],10)); });
  return max+1;
}

/* ---------------- State ---------------- */
const state = {
  theme:'light',
  lang:'th',
  route:{ name:'dashboard', param:null },
  sidebarOpen:false,
  session:null,
  accessRole:null,
  currentTester:null,
  authMode:'login',
  authEmail:'',
  authError:'',
  authNotice:'',
  authBusy:false,
  statuses: JSON.parse(JSON.stringify(DEFAULT_STATUSES)),
  testers: JSON.parse(JSON.stringify(DEFAULT_TESTERS)),
  systems: JSON.parse(JSON.stringify(DEFAULT_SYSTEMS)),
  records: JSON.parse(JSON.stringify(DEFAULT_RECORDS)).map(r=>Object.assign({}, r, {
    createdAt: Date.parse(r.testDate)||Date.now(),
    notes: r.notes||'', attachments: r.attachments||[],
    responsible: r.responsible||'', relatedApps: r.relatedApps||'', reportedTime: r.reportedTime||'',
  })),
  backups: [],
  lastBackupAt: null,
  toasts: [],
  modal: null,
  ui:{
    dashboardMonth:'all',
    reportMonth:'all',
    records:{ search:'', system:'all', month:'all', status:'all', tester:'all', date:'', sortKey:'id', sortDir:'desc', page:1, pageSize:10 },
    testers:{ search:'' },
  },
  charts:{},
};
state.nextSeq = computeNextSeq(state.records);

/* ---------------- Toasts ---------------- */
function toast(msg, kind){
  const id=uid('toast');
  state.toasts.push({id, msg, kind: kind||'default'});
  renderToasts();
  setTimeout(()=>{ state.toasts = state.toasts.filter(t=>t.id!==id); renderToasts(); }, 3600);
}
function renderToasts(){
  const el=document.getElementById('toast-stack');
  if(!el) return;
  el.innerHTML = state.toasts.map(tt=>
    `<div class="toast ${esc(tt.kind)}">${esc(tt.msg)}</div>`
  ).join('');
}

/* ---------------- Derived data helpers ---------------- */
function getStatus(id){ return state.statuses.find(s=>s.id===id) || {id, label:id, th:id, color:'cancelled'}; }
function getTester(id){ return state.testers.find(x=>x.id===id); }
function getSystem(id){ return state.systems.find(s=>s.id===id); }
function findSystemByName(name){ return state.systems.find(s=>s.name===name); }
function subsForMainName(name){ const s=findSystemByName(name); return s? s.subs.map(x=>x.name) : []; }
function allMonths(){
  const set=new Set();
  state.records.forEach(r=>{ const mk=monthKeyOf(r.testDate); if(mk) set.add(mk); });
  return Array.from(set).sort().reverse();
}
function allSystemNamesInUse(){ return Array.from(new Set(state.records.map(r=>r.mainSystem))).filter(Boolean).sort(); }
function recordsForMonth(mk){
  if(!mk || mk==='all') return state.records.slice();
  return state.records.filter(r=>monthKeyOf(r.testDate)===mk);
}

/* ---------------- Router ---------------- */
// Supabase email links (confirm signup, magic link, password recovery) redirect
// back here with auth tokens stuffed into the URL hash — which collides with
// this app's own hash-based routing. Strip those before our router (or the
// user) ever sees them.
function cleanAuthHashFromUrl(){
  if(/access_token=|refresh_token=|type=(signup|recovery|invite|magiclink)/.test(location.hash)){
    try{ history.replaceState(null, '', location.pathname + location.search); }catch(e){}
  }
}
function parseHash(){
  const h = location.hash.replace(/^#\/?/, '');
  const parts = h.split('/').filter(Boolean);
  if(parts.length===0) return {name:'dashboard', param:null};
  if(parts[0]==='records' && parts[1]) return {name:'record-detail', param:decodeURIComponent(parts[1])};
  return {name: parts[0]||'dashboard', param:null};
}
window.addEventListener('hashchange', ()=>{
  state.route = parseHash();
  if(state.route.name==='record-detail'){
    const rec = state.records.find(r=>r.id===state.route.param);
    if(rec){ state.modal = {type:'recordDetail', data:rec}; state.route = {name:'records', param:null}; }
    else { toast(t('toast.notFound')(state.route.param), 'error'); state.route={name:'records',param:null}; }
  }
  render();
});

/* ============================================================
   RENDER
   ============================================================ */
function render(){
  try{
    const app = document.getElementById('app');
    if(!state.session){
      app.innerHTML = authShellHTML();
      attachGlobalEvents();
      renderToasts();
      return;
    }
    if(state.accessRole==='pending'){
      app.innerHTML = pendingApprovalHTML();
      attachGlobalEvents();
      renderToasts();
      return;
    }
    app.innerHTML = shellHTML();
    mountTopChrome();
    renderPage();
    renderModal();
    renderToasts();
    attachGlobalEvents();
    scheduleAutosave();
    if(state.accessRole==='admin') scheduleSupaSync();
  }catch(err){
    console.error(err);
    document.getElementById('app').innerHTML =
      '<div class="overlay-fallback" style="padding:80px 20px"><h2>Something needs attention</h2>'+
      '<p>The dashboard could not render this view. Try switching pages, or reload.</p>'+
      '<pre style="text-align:left;max-width:640px;margin:16px auto;white-space:pre-wrap;font-size:11px;color:var(--text-faint)">'+esc(err.message)+'</pre></div>';
  }
}

function navGroups(){
  if(state.accessRole!=='admin'){
    return [
      {group:t('nav.groupOverview'), items:[ {id:'dashboard', label:t('nav.dashboard'), icon:'dashboard'} ]},
      {group:t('nav.groupOps'), items:[ {id:'records', label:t('nav.records'), icon:'records'} ]},
    ];
  }
  return [
    {group:t('nav.groupOverview'), items:[ {id:'dashboard', label:t('nav.dashboard'), icon:'dashboard'} ]},
    {group:t('nav.groupOps'), items:[
      {id:'records', label:t('nav.records'), icon:'records'},
      {id:'testers', label:t('nav.testers'), icon:'testers'},
      {id:'statuses', label:t('nav.statuses'), icon:'status'},
      {id:'systems', label:t('nav.systems'), icon:'systems'},
      {id:'reports', label:t('nav.reports'), icon:'reports'},
    ]},
    {group:t('nav.groupSystem'), items:[
      {id:'data', label:t('nav.data'), icon:'data'},
      {id:'backup', label:t('nav.backup'), icon:'backup'},
    ]},
  ];
}

function shellHTML(){
  const navHTML = navGroups().map(g=>
    '<div class="nav-group-label">'+esc(g.group)+'</div>'+
    g.items.map(it=>
      `<div class="nav-item ${state.route.name===it.id?'active':''}" data-action="nav" data-route="${it.id}">${ICONS[it.icon]}<span>${esc(it.label)}</span></div>`
    ).join('')
  ).join('');

  return `
  <div class="sidebar ${state.sidebarOpen?'open':''}" id="sidebar">
    <div class="brand">
      <div class="brand-mark">QC</div>
      <div class="brand-text"><b>${esc(t('appName'))}</b><span>${esc(t('appTag'))}</span></div>
    </div>
    <nav class="nav">${navHTML}</nav>
    <div class="sidebar-foot" style="display:flex;flex-direction:column;gap:8px">
      <div class="lang-toggle" style="width:100%">
        <button type="button" class="${state.lang==='en'?'active':''}" data-action="set-lang" data-lang="en" style="flex:1">EN</button>
        <button type="button" class="${state.lang==='th'?'active':''}" data-action="set-lang" data-lang="th" style="flex:1">ไทย</button>
      </div>
      <button class="theme-toggle" data-action="toggle-theme">
        <span style="display:flex;align-items:center;gap:8px;font-weight:600;font-size:12.5px">${ICONS[state.theme==='dark'?'moon':'sun']} ${state.theme==='dark'?(state.lang==='th'?'มืด':'Dark mode'):(state.lang==='th'?'สว่าง':'Light mode')}</span>
        <span class="mono" style="font-size:11px;color:var(--text-faint)">toggle</span>
      </button>
      ${syncIndicatorHTML()}
      <button class="theme-toggle" data-action="logout" title="${esc(t('auth.logout'))}">
        <span style="display:flex;align-items:center;gap:8px;font-weight:600;font-size:12.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc((state.currentTester&&(state.currentTester.name||state.currentTester.email))||'')}</span>
        <span class="mono" style="font-size:11px;color:var(--text-faint)">${esc(t('auth.logout'))}</span>
      </button>
    </div>
  </div>
  <div class="sidebar-scrim ${state.sidebarOpen?'show':''}" data-action="close-sidebar"></div>
  <div class="main">
    <div class="topbar">
      <div class="topbar-left">
        <button class="hamburger" data-action="open-sidebar">${ICONS.menu}</button>
        <div>
          <div class="page-title" id="page-title"></div>
          <div class="page-sub" id="page-sub"></div>
        </div>
      </div>
      <div class="topbar-right" id="topbar-right"></div>
    </div>
    <div class="content" id="content"></div>
  </div>
  <div id="modal-root"></div>
  <input type="file" id="file-import-records" accept=".xlsx,.xls" style="display:none">
  <input type="file" id="file-import-testers" accept=".xlsx,.xls" style="display:none">
  <input type="file" id="file-restore" accept="application/json,.json" style="display:none">
  <div class="toast-stack" id="toast-stack"></div>
  `;
}

function mountTopChrome(){
  const tt = t('titles.'+state.route.name) || t('titles.dashboard');
  document.getElementById('page-title').textContent = Array.isArray(tt)? tt[0] : state.route.name;
  document.getElementById('page-sub').textContent = Array.isArray(tt)? tt[1] : '';

  let right = '';
  if(state.route.name==='dashboard'){
    right += monthSelectHTML(state.ui.dashboardMonth, 'dashboard-month', true);
  }
  document.getElementById('topbar-right').innerHTML = right;
}

function syncIndicatorHTML(){
  const mode = state.syncMode || 'none';
  const cls = mode==='online' ? 'online' : mode==='local' ? 'on' : 'off';
  const label = t('common.sync'+mode.charAt(0).toUpperCase()+mode.slice(1));
  const hint = t('common.sync'+mode.charAt(0).toUpperCase()+mode.slice(1)+'Hint');
  const extra = mode==='local' && state.storageMode ? ' · '+(state.storageMode==='idb'?'IndexedDB':'localStorage') : '';
  return `<div class="autosave-indicator ${cls}" data-action="nav" data-route="backup" title="${esc(hint)}">
    <span class="dot"></span>
    <span>${esc(label)}${extra}</span>
  </div>`;
}
function monthSelectHTML(value, action, includeAll){
  const months = allMonths();
  let opts = includeAll? `<option value="all" ${value==='all'?'selected':''}>${esc(t('common.allMonths'))}</option>`:'';
  opts += months.map(mk=>`<option value="${mk}" ${value===mk?'selected':''}>${esc(monthLabel(mk))}</option>`).join('');
  return `<select class="select-field" data-action="${action}">${opts}</select>`;
}

function renderPage(){
  if(state.accessRole!=='admin' && !['dashboard','records'].includes(state.route.name)){
    state.route = {name:'dashboard', param:null};
  }
  const c = document.getElementById('content');
  switch(state.route.name){
    case 'records': c.innerHTML = recordsPage(); afterRecordsRender(); break;
    case 'testers': c.innerHTML = testersPage(); break;
    case 'statuses': c.innerHTML = statusesPage(); break;
    case 'systems': c.innerHTML = systemsPage(); break;
    case 'reports': c.innerHTML = reportsPage(); break;
    case 'data': c.innerHTML = dataPage(); break;
    case 'backup': c.innerHTML = backupPage(); break;
    default: c.innerHTML = dashboardPage(); afterDashboardRender(); break;
  }
}

/* ============================================================
   DASHBOARD
   ============================================================ */
function dashboardPage(){
  const mk = state.ui.dashboardMonth;
  // Cancelled records are excluded from the Dashboard entirely — they don't
  // represent real QC throughput. They're still fully visible/manageable on
  // the Records page, Reports, and Program Statuses.
  const recs = recordsForMonth(mk).filter(r=>r.status!=='cancelled');
  const dashStatuses = state.statuses.filter(s=>s.id!=='cancelled');
  const total = recs.length;

  const kpiCards = dashStatuses.map(s=>{
    const n = recs.filter(r=>r.status===s.id).length;
    const pct = total? Math.round(n/total*100):0;
    return `<div class="kpi-card">
      <div class="stripe" style="background:var(--c-${cssColorKey(s)})"></div>
      <div class="kpi-label">${esc(statusLabel(s))}</div>
      <div class="kpi-value">${n}</div>
      <div class="kpi-sub">${pct}% / ${total}</div>
    </div>`;
  }).join('');

  if(total===0){
    return `
    <div class="kpi-grid">
      <div class="kpi-card"><div class="stripe" style="background:var(--primary)"></div><div class="kpi-label">${esc(t('dash.total'))}</div><div class="kpi-value">0</div><div class="kpi-sub">${mk==='all'?esc(t('dash.ofAllTime')):esc(monthLabel(mk))}</div></div>
    </div>
    ${emptyState(t('dash.noData'), t('dash.noDataSub'),'records')}
    `;
  }

  return `
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="stripe" style="background:var(--primary)"></div>
        <div class="kpi-label">${esc(t('dash.total'))}</div>
        <div class="kpi-value">${total}</div>
        <div class="kpi-sub">${mk==='all'?esc(t('dash.ofAllTime')):esc(monthLabel(mk))}</div>
      </div>
      ${kpiCards}
    </div>

    <div class="grid-charts">
      <div class="card card-pad">
        <div class="section-title">${esc(t('dash.statusDist'))}</div>
        <div class="section-sub">${mk==='all'? esc(t('dash.statusDistAll')) : esc(monthLabel(mk))}</div>
        <div class="chart-wrap"><canvas id="chart-status"></canvas></div>
      </div>
      <div class="card card-pad">
        <div class="section-title">${esc(t('dash.bySystem'))}</div>
        <div class="section-sub">${esc(t('dash.bySystemSub'))}</div>
        <div class="chart-wrap"><canvas id="chart-system"></canvas></div>
      </div>
    </div>

    <div class="card card-pad" style="margin-bottom:16px">
      <div class="section-title">${esc(t('dash.trend'))}</div>
      <div class="section-sub">${esc(t('dash.trendSub'))}</div>
      <div class="chart-wrap tall"><canvas id="chart-trend"></canvas></div>
    </div>

    <div class="card card-pad">
      <div class="section-title">${esc(t('dash.recent'))}</div>
      <div class="section-sub">${esc(t('dash.latest5'))}${mk==='all'?'':' — '+esc(monthLabel(mk))}</div>
      ${recentRecordsTable(recs)}
    </div>
  `;
}

function cssColorKey(status){
  const known = ['passed','installed','failed','under_revision','pending_test','cancelled','testing'];
  return known.includes(status.id) ? status.id : 'cancelled';
}

function recentRecordsTable(recs){
  const sorted = recs.slice().sort((a,b)=> a.id<b.id?1:-1).slice(0,5);
  if(!sorted.length) return emptyState('dash.noData','dash.noDataSub','records');
  return `<div class="table-scroll"><table><thead><tr>
    <th>${esc(t('dash.col.id'))}</th><th>${esc(t('dash.col.system'))}</th><th>${esc(t('dash.col.program'))}</th><th>${esc(t('dash.col.status'))}</th><th>${esc(t('dash.col.tester'))}</th><th>${esc(t('dash.col.date'))}</th>
  </tr></thead><tbody>
  ${sorted.map(r=>`<tr data-action="open-detail" data-id="${esc(r.id)}">
    <td class="cell-id">${esc(r.id)}</td>
    <td>${esc(r.mainSystem)}<div class="cell-muted">${esc(r.subSystem||'')}</div></td>
    <td>${esc(r.programName)} <span class="cell-muted">${esc(r.version)}</span></td>
    <td>${statusStamp(r.status)}</td>
    <td>${esc(getTester(r.tester)?.name || t('common.unassigned'))}</td>
    <td>${fmtDate(r.testDate)}</td>
  </tr>`).join('')}
  </tbody></table></div>`;
}

function statusStamp(statusId){
  const s = getStatus(statusId);
  const cls = ['passed','installed','failed','under_revision','pending_test','cancelled','testing'].includes(s.id) ? s.id : '';
  const style = cls ? '' : `style="color:${esc(s.customColor||'#6B7280')};background:${esc(s.customColor||'#6B7280')}22"`;
  return `<span class="stamp ${cls}" ${style}><span class="dot"></span>${esc(statusLabel(s))}</span>`;
}

function emptyState(titleKey, subKey, gotoRoute){
  const title = titleKey.includes('.')? t(titleKey) : titleKey;
  const sub = subKey.includes('.')? t(subKey) : subKey;
  return `<div class="empty-state">
    ${ICONS.info}
    <h3>${esc(title)}</h3>
    <p>${esc(sub)}</p>
    ${gotoRoute? `<div style="margin-top:14px"><button class="btn btn-primary" data-action="nav" data-route="${gotoRoute}">${ICONS.plus} ${esc(t('nav.'+gotoRoute))}</button></div>`:''}
  </div>`;
}

function destroyCharts(){
  Object.values(state.charts).forEach(ch=>{ try{ch.destroy();}catch(e){} });
  state.charts = {};
}

function afterDashboardRender(){
  destroyCharts();
  if(typeof Chart === 'undefined'){
    ['chart-status','chart-system','chart-trend'].forEach(id=>{
      const el=document.getElementById(id);
      if(el) el.parentElement.innerHTML = '<div class="overlay-fallback">'+esc(t('toast.chartLibFail'))+'</div>';
    });
    return;
  }
  const mk = state.ui.dashboardMonth;
  const recs = recordsForMonth(mk).filter(r=>r.status!=='cancelled');
  const dashStatuses = state.statuses.filter(s=>s.id!=='cancelled');
  if(!recs.length) return;

  const isDark = state.theme==='dark';
  const gridColor = isDark? 'rgba(255,255,255,.08)':'rgba(20,30,50,.08)';
  const textColor = isDark? '#9AABC9':'#5B6779';
  if(Chart.defaults){
    Chart.defaults.color = textColor;
    if(Chart.defaults.font) Chart.defaults.font.family = "'Inter','Noto Sans Thai',sans-serif";
  }

  const statusColors = {};
  dashStatuses.forEach(s=>{ statusColors[s.id] = getComputedStyle(document.documentElement).getPropertyValue('--c-'+cssColorKey(s)).trim() || '#888'; });

  try{
    const statusCounts = dashStatuses.map(s=>recs.filter(r=>r.status===s.id).length);
    state.charts.status = new Chart(document.getElementById('chart-status'), {
      type:'doughnut',
      data:{ labels: dashStatuses.map(s=>statusLabel(s)), datasets:[{ data:statusCounts, backgroundColor: dashStatuses.map(s=>statusColors[s.id]), borderWidth:2, borderColor: isDark?'#111B2E':'#fff' }]},
      options:{ maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{boxWidth:10,padding:12,font:{size:11}} } }, cutout:'62%' }
    });
  }catch(e){ chartFallback('chart-status'); }

  try{
    const systems = allSystemNamesInUse().filter(sys=>recs.some(r=>r.mainSystem===sys));
    const datasets = dashStatuses.map(s=>({
      label:statusLabel(s), backgroundColor: statusColors[s.id],
      data: systems.map(sys=> recs.filter(r=>r.mainSystem===sys && r.status===s.id).length),
      stack:'a'
    }));
    state.charts.system = new Chart(document.getElementById('chart-system'), {
      type:'bar',
      data:{ labels: systems, datasets },
      options:{ maintainAspectRatio:false, scales:{ x:{stacked:true, grid:{color:gridColor}}, y:{stacked:true, beginAtZero:true, ticks:{precision:0}, grid:{color:gridColor}} },
        plugins:{ legend:{ display:false } } }
    });
  }catch(e){ chartFallback('chart-system'); }

  try{
    const months = allMonths().slice(0,12).reverse();
    const datasets = dashStatuses.map(s=>({
      label:statusLabel(s), borderColor: statusColors[s.id], backgroundColor: statusColors[s.id]+'33',
      data: months.map(m=> state.records.filter(r=>monthKeyOf(r.testDate)===m && r.status===s.id).length),
      tension:.35, fill:false, pointRadius:3
    }));
    state.charts.trend = new Chart(document.getElementById('chart-trend'), {
      type:'line',
      data:{ labels: months.map(monthLabel), datasets },
      options:{ maintainAspectRatio:false, scales:{ x:{grid:{color:gridColor}}, y:{beginAtZero:true, ticks:{precision:0}, grid:{color:gridColor}} },
        plugins:{ legend:{ position:'bottom', labels:{boxWidth:10,padding:10,font:{size:11}} } } }
    });
  }catch(e){ chartFallback('chart-trend'); }
}
function chartFallback(id){
  const el=document.getElementById(id);
  if(el) el.parentElement.innerHTML = '<div class="overlay-fallback">'+esc(t('toast.chartFail'))+'</div>';
}

/* ============================================================
   QC RECORDS PAGE
   ============================================================ */
function filteredSortedRecords(){
  const u = state.ui.records;
  let list = state.records.slice();
  if(u.search.trim()){
    const q = u.search.trim().toLowerCase();
    list = list.filter(r=>
      r.id.toLowerCase().includes(q) ||
      (r.mainSystem||'').toLowerCase().includes(q) ||
      (r.subSystem||'').toLowerCase().includes(q) ||
      (r.programName||'').toLowerCase().includes(q) ||
      (r.issueDescription||'').toLowerCase().includes(q) ||
      (r.responsible||'').toLowerCase().includes(q) ||
      (getTester(r.tester)?.name||'').toLowerCase().includes(q)
    );
  }
  if(u.system!=='all') list = list.filter(r=>r.mainSystem===u.system);
  if(u.month!=='all') list = list.filter(r=>monthKeyOf(r.testDate)===u.month);
  if(u.status!=='all') list = list.filter(r=>r.status===u.status);
  if(u.tester!=='all') list = list.filter(r=>r.tester===u.tester);
  if(u.date) list = list.filter(r=>r.testDate===u.date);

  list.sort((a,b)=>{
    let av=a[u.sortKey], bv=b[u.sortKey];
    if(u.sortKey==='tester'){ av=getTester(a.tester)?.name||''; bv=getTester(b.tester)?.name||''; }
    if(u.sortKey==='status'){ av=statusLabel(getStatus(a.status)); bv=statusLabel(getStatus(b.status)); }
    av=(av||'').toString(); bv=(bv||'').toString();
    if(av<bv) return u.sortDir==='asc'?-1:1;
    if(av>bv) return u.sortDir==='asc'?1:-1;
    return 0;
  });
  return list;
}

function recordsPage(){
  const u = state.ui.records;
  const all = filteredSortedRecords();
  const totalPages = Math.max(1, Math.ceil(all.length/u.pageSize));
  if(u.page>totalPages) u.page=totalPages;
  const pageItems = all.slice((u.page-1)*u.pageSize, (u.page-1)*u.pageSize + u.pageSize);

  const systems = state.systems.map(s=>s.name);
  const months = allMonths();

  function sortArrow(key){
    if(u.sortKey!==key) return '';
    return `<span class="sort-arrow">${u.sortDir==='asc'?'▲':'▼'}</span>`;
  }

  return `
  <div class="table-toolbar">
    <div class="search-box">${ICONS.search}<input type="text" placeholder="${esc(t('records.searchPh'))}" value="${esc(u.search)}" data-bind="records.search"></div>
    <div style="flex:1"></div>
    ${state.accessRole==='admin' ? `<button class="btn btn-primary" data-action="add-record">${ICONS.plus} ${esc(t('common.addRecord'))}</button>` : ''}
  </div>

  <div class="filter-bar">
    <select class="select-field" data-bind="records.system">
      <option value="all">${esc(t('common.allSystems'))}</option>
      ${systems.map(s=>`<option value="${esc(s)}" ${u.system===s?'selected':''}>${esc(s)}</option>`).join('')}
    </select>
    <select class="select-field" data-bind="records.month">
      <option value="all">${esc(t('common.allMonths'))}</option>
      ${months.map(m=>`<option value="${m}" ${u.month===m?'selected':''}>${esc(monthLabel(m))}</option>`).join('')}
    </select>
    <select class="select-field" data-bind="records.status">
      <option value="all">${esc(t('common.allStatuses'))}</option>
      ${state.statuses.map(s=>`<option value="${esc(s.id)}" ${u.status===s.id?'selected':''}>${esc(statusLabel(s))}</option>`).join('')}
    </select>
    <select class="select-field" data-bind="records.tester">
      <option value="all">${esc(t('common.allTesters'))}</option>
      ${state.testers.map(x=>`<option value="${esc(x.id)}" ${u.tester===x.id?'selected':''}>${esc(x.name)}</option>`).join('')}
    </select>
    <input type="date" class="input-field" data-bind="records.date" value="${esc(u.date)}">
    ${(u.system!=='all'||u.month!=='all'||u.status!=='all'||u.tester!=='all'||u.date||u.search)?
      `<button class="btn btn-ghost btn-sm" data-action="clear-record-filters">${ICONS.x} ${esc(t('records.clear'))}</button>`:''}
  </div>

  ${!pageItems.length ? emptyState('records.noMatch','records.noMatchSub', null) : `
  <div class="table-scroll"><table><thead><tr>
    <th data-action="sort-records" data-key="id">${esc(t('records.col.id'))}${sortArrow('id')}</th>
    <th data-action="sort-records" data-key="mainSystem">${esc(t('records.col.system'))}${sortArrow('mainSystem')}</th>
    <th data-action="sort-records" data-key="programName">${esc(t('records.col.program'))}${sortArrow('programName')}</th>
    <th data-action="sort-records" data-key="issueType">${esc(t('records.col.issueType'))}${sortArrow('issueType')}</th>
    <th data-action="sort-records" data-key="status">${esc(t('records.col.status'))}${sortArrow('status')}</th>
    <th data-action="sort-records" data-key="tester">${esc(t('records.col.tester'))}${sortArrow('tester')}</th>
    <th data-action="sort-records" data-key="testDate">${esc(t('records.col.date'))}${sortArrow('testDate')}</th>
    <th>${esc(t('records.col.actions'))}</th>
  </tr></thead><tbody>
  ${pageItems.map(r=>`<tr data-action="open-detail" data-id="${esc(r.id)}">
    <td class="cell-id">${esc(r.id)}</td>
    <td>${esc(r.mainSystem)}<div class="cell-muted">${esc(r.subSystem||'—')}</div></td>
    <td>${esc(r.programName)}<div class="cell-muted">${esc(r.version)}</div></td>
    <td class="cell-muted">${esc(issueTypeLabel(r.issueType))}</td>
    <td>${statusStamp(r.status)}</td>
    <td>${esc(getTester(r.tester)?.name || t('common.unassigned'))}</td>
    <td>${fmtDate(r.testDate)}<div><span class="month-tag" style="${monthTagStyle(monthKeyOf(r.testDate))}">${esc(monthLabel(monthKeyOf(r.testDate)))}</span></div></td>
    <td>
      <div class="row-actions">
        <button class="btn btn-ghost icon-btn" title="${esc(t('records.sendTester'))}" data-action="send-tester" data-id="${esc(r.id)}">${ICONS.mail}</button>
        <button class="btn btn-ghost icon-btn" title="${esc(t('records.copyLink'))}" data-action="copy-link" data-id="${esc(r.id)}">${ICONS.link}</button>
      </div>
    </td>
  </tr>`).join('')}
  </tbody></table></div>
  <div class="pagination">
    <div style="display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--text-muted)">
      ${esc(t('records.showing')(all.length? ((u.page-1)*u.pageSize+1):0, Math.min(u.page*u.pageSize,all.length), all.length))}
      <select class="select-field" data-bind="records.pageSize" style="margin-left:6px">
        ${[10,20,50,100].map(n=>`<option value="${n}" ${u.pageSize===n?'selected':''}>${n} ${esc(t('records.perPage'))}</option>`).join('')}
      </select>
    </div>
    <div class="pages">
      <button class="page-btn" data-action="page" data-dir="prev" ${u.page<=1?'disabled':''}>${ICONS.chevronL}</button>
      <span class="mono" style="font-size:12px;padding:0 8px">${esc(t('records.page'))} ${u.page} / ${totalPages}</span>
      <button class="page-btn" data-action="page" data-dir="next" ${u.page>=totalPages?'disabled':''}>${ICONS.chevronR}</button>
    </div>
  </div>
  `}
  `;
}
function monthTagStyle(mk){
  if(!mk) return '';
  const m = parseInt(mk.split('-')[1],10);
  const hue = (m*47)%360;
  return `background:hsl(${hue} 70% ${state.theme==='dark'?'18%':'93%'});color:hsl(${hue} 55% ${state.theme==='dark'?'70%':'32%'});border-color:hsl(${hue} 50% ${state.theme==='dark'?'30%':'80%'})`;
}
function afterRecordsRender(){ /* no charts on this page */ }

/* ============================================================
   TESTERS PAGE
   ============================================================ */
function testersPage(){
  const q = state.ui.testers.search.trim().toLowerCase();
  let list = state.testers.slice();
  if(q) list = list.filter(x=> [x.name,x.username,x.email,x.role,x.department].join(' ').toLowerCase().includes(q));

  return `
  <div class="table-toolbar">
    <div class="search-box">${ICONS.search}<input type="text" placeholder="${esc(t('tester.searchPh'))}" value="${esc(state.ui.testers.search)}" data-bind="testers.search"></div>
    <div style="flex:1"></div>
    <button class="btn btn-ghost" data-action="export-testers-xlsx">${ICONS.download} ${esc(t('common.export'))}</button>
    <button class="btn btn-ghost" data-action="pick-import-testers">${ICONS.upload} ${esc(t('common.importLbl'))}</button>
    <button class="btn btn-primary" data-action="add-tester">${ICONS.plus} ${esc(t('tester.addBtn'))}</button>
  </div>
  ${!list.length? emptyState('tester.empty','tester.emptySub', null): `
  <div class="table-scroll"><table><thead><tr>
    <th>${esc(t('tester.col.name'))}</th><th>${esc(t('tester.col.username'))}</th><th>${esc(t('tester.col.email'))}</th><th>${esc(t('tester.col.role'))}</th><th>${esc(t('tester.col.dept'))}</th><th>${esc(t('tester.col.status'))}</th><th>${esc(t('tester.col.notes'))}</th><th>${esc(t('tester.col.actions'))}</th>
  </tr></thead><tbody>
  ${list.map(x=>`<tr>
    <td><b>${esc(x.name)}</b></td>
    <td class="mono cell-muted">${esc(x.username)}</td>
    <td class="cell-muted">${esc(x.email)||'—'}</td>
    <td>${esc(x.role)}</td>
    <td>${esc(x.department)}</td>
    <td><span class="badge-soft ${x.active?'badge-active':'badge-inactive'}">${x.active?esc(t('common.active')):esc(t('common.inactive'))}</span></td>
    <td class="cell-muted">${esc(x.notes||'—')}</td>
    <td><div class="row-actions">
      <button class="btn btn-ghost icon-btn" data-action="edit-tester" data-id="${esc(x.id)}">${ICONS.edit}</button>
      <button class="btn btn-ghost icon-btn" data-action="delete-tester" data-id="${esc(x.id)}">${ICONS.trash}</button>
    </div></td>
  </tr>`).join('')}
  </tbody></table></div>`}
  `;
}

/* ============================================================
   STATUS MANAGEMENT PAGE
   ============================================================ */
function statusesPage(){
  return `
  <div class="helper-banner">${ICONS.info}<div>${esc(t('status.banner'))}</div></div>
  <div class="table-toolbar">
    <div style="flex:1"></div>
    <button class="btn btn-ghost" data-action="reset-statuses">${esc(t('common.reset'))}</button>
    <button class="btn btn-primary" data-action="add-status">${ICONS.plus} ${esc(t('status.addBtn'))}</button>
  </div>
  <div class="table-scroll"><table><thead><tr>
    <th>${esc(t('status.col.status'))}</th><th>${esc(t('status.col.desc'))}</th><th>${esc(t('status.col.usedBy'))}</th><th>${esc(t('status.col.actions'))}</th>
  </tr></thead><tbody>
  ${state.statuses.map(s=>`<tr>
    <td>${statusStamp(s.id)}</td>
    <td class="cell-muted">${esc(statusDesc(s))||'—'}</td>
    <td>${state.records.filter(r=>r.status===s.id).length}</td>
    <td><div class="row-actions">
      <button class="btn btn-ghost icon-btn" data-action="edit-status" data-id="${esc(s.id)}">${ICONS.edit}</button>
      <button class="btn btn-ghost icon-btn" data-action="delete-status" data-id="${esc(s.id)}">${ICONS.trash}</button>
    </div></td>
  </tr>`).join('')}
  </tbody></table></div>
  `;
}

/* ============================================================
   SYSTEM MANAGEMENT PAGE (Main System / Sub System)
   ============================================================ */
function systemsPage(){
  if(!state.systems.length){
    return `
    <div class="table-toolbar"><div style="flex:1"></div><button class="btn btn-primary" data-action="add-system">${ICONS.plus} ${esc(t('sys.addMain'))}</button></div>
    ${emptyState('sys.empty','sys.emptySub', null)}
    `;
  }
  return `
  <div class="helper-banner">${ICONS.info}<div>${esc(t('sys.banner'))}</div></div>
  <div class="table-toolbar"><div style="flex:1"></div><button class="btn btn-primary" data-action="add-system">${ICONS.plus} ${esc(t('sys.addMain'))}</button></div>
  <div style="display:flex;flex-direction:column;gap:14px">
  ${state.systems.map(sys=>{
    const recCount = state.records.filter(r=>r.mainSystem===sys.name).length;
    return `<div class="card card-pad">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:12px;flex-wrap:wrap">
        <div><div style="font-weight:700;font-size:15px;font-family:var(--font-display)">${esc(sys.name)}</div>
          <div class="cell-muted">${esc(t('sys.recordsUsing')(recCount))} · ${esc(t('sys.subsCount')(sys.subs.length))}</div></div>
        <div class="row-actions">
          <button class="btn btn-ghost icon-btn" data-action="edit-system" data-id="${esc(sys.id)}">${ICONS.edit}</button>
          <button class="btn btn-ghost icon-btn" data-action="delete-system" data-id="${esc(sys.id)}">${ICONS.trash}</button>
        </div>
      </div>
      <div class="chip-row">
        ${sys.subs.map(sub=>`<span class="sub-chip"><span>${esc(sub.name)}</span>
          <button type="button" data-action="edit-subsystem" data-sysid="${esc(sys.id)}" data-subid="${esc(sub.id)}">${ICONS.edit}</button>
          <button type="button" data-action="delete-subsystem" data-sysid="${esc(sys.id)}" data-subid="${esc(sub.id)}">${ICONS.x}</button>
        </span>`).join('')}
        <button class="btn btn-ghost btn-sm" data-action="add-subsystem" data-sysid="${esc(sys.id)}">${esc(t('sys.addSub'))}</button>
      </div>
    </div>`;
  }).join('')}
  </div>
  `;
}

/* ============================================================
   QC REPORT (styled multi-sheet Excel export)
   ============================================================ */
function reportsPage(){
  const mk = state.ui.reportMonth;
  const recs = recordsForMonth(mk);
  const total = recs.length;

  const monthPicker = monthSelectHTML(mk, 'report-month', true);

  if(!total){
    return `
    <div class="card card-pad" style="margin-bottom:16px">
      <div class="section-title">${esc(t('report.period'))}</div>
      <div style="margin-top:8px">${monthPicker}</div>
    </div>
    ${emptyState('report.noData','report.noDataSub', null)}
    `;
  }

  const kpiCards = state.statuses.map(s=>{
    const n = recs.filter(r=>r.status===s.id).length;
    const pct = total? Math.round(n/total*100):0;
    return `<div class="kpi-card">
      <div class="stripe" style="background:var(--c-${cssColorKey(s)})"></div>
      <div class="kpi-label">${esc(statusLabel(s))}</div>
      <div class="kpi-value">${n}</div>
      <div class="kpi-sub">${pct}%</div>
    </div>`;
  }).join('');

  return `
  <div class="card card-pad" style="margin-bottom:16px">
    <div class="section-title">${esc(t('report.period'))}</div>
    <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:8px">
      ${monthPicker}
      <span class="cell-muted">${total} ${esc(t('report.totalIn'))}</span>
    </div>
  </div>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="stripe" style="background:var(--primary)"></div>
      <div class="kpi-label">${esc(t('dash.total'))}</div>
      <div class="kpi-value">${total}</div>
      <div class="kpi-sub">${mk==='all'?esc(t('dash.ofAllTime')):esc(monthLabel(mk))}</div>
    </div>
    ${kpiCards}
  </div>

  <div class="card card-pad" style="margin-bottom:16px">
    <div class="section-title">${esc(t('report.preview'))}</div>
    <div class="section-sub">${esc(t('report.previewSub'))}</div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-top:6px">
      ${[ 'sheetSummary','sheetBySystem','sheetByMonth','sheetByTester','sheetDetail' ].map((k,i)=>`
        <div style="display:flex;align-items:center;gap:10px;font-size:13px">
          <span class="mono" style="color:var(--text-faint);width:18px">${i+1}.</span>
          <b>${esc(t('report.'+k))}</b>
        </div>
      `).join('')}
    </div>
  </div>

  <button class="btn btn-primary btn-block" data-action="export-report">${ICONS.download} ${esc(t('report.exportBtn'))}</button>
  `;
}

const REPORT_COLORS = {
  brand:'0F6E6E', brandDark:'0B4F4F', headerText:'FFFFFF', bandLight:'F5F7FA', border:'D9DEE6',
  passed:{fg:'0E9F6E', soft:'DFF5EC'}, installed:{fg:'0B6E4F', soft:'D9EEE4'}, failed:{fg:'D0362A', soft:'FBE3E1'},
  under_revision:{fg:'C9781F', soft:'FBEBD6'}, pending_test:{fg:'5B5BD6', soft:'E7E7FA'},
  cancelled:{fg:'6B7280', soft:'E7E9ED'}, testing:{fg:'1E88C7', soft:'DFEEFA'}, custom:{fg:'6B7280', soft:'E7E9ED'},
};
function reportStatusColor(statusId){
  return REPORT_COLORS[statusId] || REPORT_COLORS.custom;
}

function styleHeaderRow(row, argbFg, argbText){
  row.eachCell(cell=>{
    cell.font = { bold:true, color:{argb:'FF'+(argbText||REPORT_COLORS.headerText)} };
    cell.fill = { type:'pattern', pattern:'solid', fgColor:{argb:'FF'+(argbFg||REPORT_COLORS.brand)} };
    cell.alignment = { vertical:'middle', horizontal:'center', wrapText:true };
    cell.border = { bottom:{style:'thin', color:{argb:'FF'+REPORT_COLORS.border}} };
  });
}
function addTitleBlock(ws, colSpan, titleText, subLines){
  ws.mergeCells(1,1,1,colSpan);
  const titleCell = ws.getCell(1,1);
  titleCell.value = titleText;
  titleCell.font = { bold:true, size:16, color:{argb:'FF'+REPORT_COLORS.brandDark} };
  titleCell.alignment = { vertical:'middle' };
  ws.getRow(1).height = 26;
  let r = 2;
  subLines.forEach(line=>{
    ws.mergeCells(r,1,r,colSpan);
    const c = ws.getCell(r,1);
    c.value = line;
    c.font = { italic:true, size:10, color:{argb:'FF667085'} };
    r++;
  });
  return r+1; // next free row
}

async function generateReportWorkbook(monthFilter){
  const ExcelJSLib = window.ExcelJS;
  const wb = new ExcelJSLib.Workbook();
  wb.creator = 'QC Management System';
  wb.created = new Date();

  const recs = recordsForMonth(monthFilter);
  const periodLabel = monthFilter==='all' ? t('common.allMonths') : monthLabel(monthFilter);
  const genLine = `${t('report.generatedOn')}: ${fmtDateTime(Date.now())}`;
  const periodLine = `${t('report.periodLabel')}: ${periodLabel}`;

  /* ---- Sheet 1: Summary ---- */
  const wsSum = wb.addWorksheet(t('report.sheetSummary'));
  wsSum.columns = [{width:28},{width:14},{width:12}];
  let row = addTitleBlock(wsSum, 3, t('report.title'), [periodLine, genLine, `${t('report.totalRecords')}: ${recs.length}`]);

  row++;
  wsSum.getCell(row,1).value = t('report.statusBreakdown');
  wsSum.getCell(row,1).font = { bold:true, size:12 };
  row++;
  const statHeaderRow = wsSum.getRow(row);
  statHeaderRow.getCell(1).value = t('report.status');
  statHeaderRow.getCell(2).value = t('report.count');
  statHeaderRow.getCell(3).value = t('report.percent');
  styleHeaderRow(statHeaderRow);
  row++;
  state.statuses.forEach(s=>{
    const n = recs.filter(r=>r.status===s.id).length;
    const pct = recs.length? n/recs.length : 0;
    const c1 = wsSum.getCell(row,1), c2 = wsSum.getCell(row,2), c3 = wsSum.getCell(row,3);
    const col = reportStatusColor(s.id);
    c1.value = statusLabel(s); c1.fill = {type:'pattern',pattern:'solid',fgColor:{argb:'FF'+col.soft}}; c1.font = {color:{argb:'FF'+col.fg}, bold:true};
    c2.value = n;
    c3.value = pct; c3.numFmt = '0.0%';
    [c1,c2,c3].forEach(c=> c.border = {bottom:{style:'hair',color:{argb:'FF'+REPORT_COLORS.border}}});
    row++;
  });
  row++;

  wsSum.getCell(row,1).value = t('report.issueTypeBreakdown');
  wsSum.getCell(row,1).font = { bold:true, size:12 };
  row++;
  const itHeaderRow = wsSum.getRow(row);
  itHeaderRow.getCell(1).value = t('report.status');
  itHeaderRow.getCell(2).value = t('report.count');
  itHeaderRow.getCell(3).value = t('report.percent');
  styleHeaderRow(itHeaderRow);
  row++;
  ISSUE_TYPES.forEach(it=>{
    const n = recs.filter(r=>r.issueType===it.id).length;
    const pct = recs.length? n/recs.length : 0;
    wsSum.getCell(row,1).value = state.lang==='th'? it.th : it.en;
    wsSum.getCell(row,2).value = n;
    const c3 = wsSum.getCell(row,3); c3.value = pct; c3.numFmt = '0.0%';
    row++;
  });

  /* ---- Sheet 2: By System ---- */
  const wsSys = wb.addWorksheet(t('report.sheetBySystem'));
  const systemNames = state.systems.map(s=>s.name).filter(name=>recs.some(r=>r.mainSystem===name));
  const otherSystems = Array.from(new Set(recs.map(r=>r.mainSystem))).filter(n=>!systemNames.includes(n));
  const allSysNames = [...systemNames, ...otherSystems];
  wsSys.columns = [{width:32}, ...state.statuses.map(()=>({width:14})), {width:14}];
  let r2 = addTitleBlock(wsSys, state.statuses.length+2, t('report.sheetBySystem'), [periodLine, genLine]);
  const sysHeader = wsSys.getRow(r2);
  sysHeader.getCell(1).value = t('records.col.system');
  state.statuses.forEach((s,i)=> sysHeader.getCell(2+i).value = statusLabel(s));
  sysHeader.getCell(2+state.statuses.length).value = t('report.systemTotal');
  styleHeaderRow(sysHeader);
  r2++;
  allSysNames.forEach(name=>{
    const sysRecs = recs.filter(r=>r.mainSystem===name);
    wsSys.getCell(r2,1).value = name;
    state.statuses.forEach((s,i)=>{ wsSys.getCell(r2,2+i).value = sysRecs.filter(r=>r.status===s.id).length; });
    wsSys.getCell(r2,2+state.statuses.length).value = sysRecs.length;
    wsSys.getCell(r2,2+state.statuses.length).font = {bold:true};
    r2++;
  });
  const totalRow2 = wsSys.getRow(r2);
  totalRow2.getCell(1).value = t('report.systemTotal');
  totalRow2.getCell(1).font = {bold:true};
  state.statuses.forEach((s,i)=>{ totalRow2.getCell(2+i).value = recs.filter(r=>r.status===s.id).length; totalRow2.getCell(2+i).font={bold:true}; });
  totalRow2.getCell(2+state.statuses.length).value = recs.length;
  totalRow2.getCell(2+state.statuses.length).font = {bold:true};
  wsSys.views = [{state:'frozen', ySplit: r2-allSysNames.length-1}];

  /* ---- Sheet 3: Monthly Trend (always last 12 months, independent of period filter) ---- */
  const wsMonth = wb.addWorksheet(t('report.sheetByMonth'));
  const months = allMonths().slice(0,12).reverse();
  wsMonth.columns = [{width:16}, ...state.statuses.map(()=>({width:14})), {width:14}];
  let r3 = addTitleBlock(wsMonth, state.statuses.length+2, t('report.sheetByMonth'), [genLine, t('report.monthlyNote')]);
  const monthHeader = wsMonth.getRow(r3);
  monthHeader.getCell(1).value = t('dash.col.date');
  state.statuses.forEach((s,i)=> monthHeader.getCell(2+i).value = statusLabel(s));
  monthHeader.getCell(2+state.statuses.length).value = t('report.systemTotal');
  styleHeaderRow(monthHeader);
  r3++;
  months.forEach(m=>{
    const monthRecs = state.records.filter(r=>monthKeyOf(r.testDate)===m);
    wsMonth.getCell(r3,1).value = monthLabel(m);
    state.statuses.forEach((s,i)=>{ wsMonth.getCell(r3,2+i).value = monthRecs.filter(r=>r.status===s.id).length; });
    wsMonth.getCell(r3,2+state.statuses.length).value = monthRecs.length;
    wsMonth.getCell(r3,2+state.statuses.length).font = {bold:true};
    r3++;
  });

  /* ---- Sheet 4: By Tester ---- */
  const wsTester = wb.addWorksheet(t('report.sheetByTester'));
  wsTester.columns = [{width:26}, ...state.statuses.map(()=>({width:14})), {width:14}, {width:12}];
  let r4 = addTitleBlock(wsTester, state.statuses.length+3, t('report.sheetByTester'), [periodLine, genLine]);
  const testerHeader = wsTester.getRow(r4);
  testerHeader.getCell(1).value = t('report.testerName');
  state.statuses.forEach((s,i)=> testerHeader.getCell(2+i).value = statusLabel(s));
  testerHeader.getCell(2+state.statuses.length).value = t('report.testerTotal');
  testerHeader.getCell(3+state.statuses.length).value = t('report.testerActive');
  styleHeaderRow(testerHeader);
  r4++;
  state.testers.forEach(tst=>{
    const tRecs = recs.filter(r=>r.tester===tst.id);
    wsTester.getCell(r4,1).value = tst.name;
    state.statuses.forEach((s,i)=>{ wsTester.getCell(r4,2+i).value = tRecs.filter(r=>r.status===s.id).length; });
    wsTester.getCell(r4,2+state.statuses.length).value = tRecs.length;
    wsTester.getCell(r4,2+state.statuses.length).font = {bold:true};
    const activeCell = wsTester.getCell(r4,3+state.statuses.length);
    activeCell.value = tst.active ? t('common.active') : t('common.inactive');
    activeCell.font = { color:{argb:'FF'+(tst.active?REPORT_COLORS.passed.fg:REPORT_COLORS.cancelled.fg)} };
    r4++;
  });
  const unassigned = recs.filter(r=>!r.tester);
  if(unassigned.length){
    wsTester.getCell(r4,1).value = t('common.unassigned');
    wsTester.getCell(r4,1).font = {italic:true, color:{argb:'FF8A94A6'}};
    state.statuses.forEach((s,i)=>{ wsTester.getCell(r4,2+i).value = unassigned.filter(r=>r.status===s.id).length; });
    wsTester.getCell(r4,2+state.statuses.length).value = unassigned.length;
  }

  /* ---- Sheet 5: Record detail (full formatted list for the period) ---- */
  const wsDetail = wb.addWorksheet(t('report.sheetDetail'));
  const detailCols = [
    {header:t('records.col.id'), key:'id', width:16},
    {header:t('form.mainSystem'), key:'mainSystem', width:26},
    {header:t('form.subSystem'), key:'subSystem', width:22},
    {header:t('form.programName'), key:'programName', width:22},
    {header:t('form.version'), key:'version', width:10},
    {header:t('form.issueType'), key:'issueType', width:20},
    {header:t('records.col.status'), key:'status', width:16},
    {header:t('records.col.tester'), key:'tester', width:16},
    {header:t('records.col.date'), key:'testDate', width:14},
    {header:t('form.responsible'), key:'responsible', width:16},
    {header:t('form.relatedApps'), key:'relatedApps', width:24},
    {header:t('detail.issueDesc'), key:'issueDescription', width:50},
    {header:t('form.notes'), key:'notes', width:24},
  ];
  wsDetail.columns = detailCols;
  styleHeaderRow(wsDetail.getRow(1));
  wsDetail.views = [{state:'frozen', ySplit:1}];
  wsDetail.autoFilter = { from:{row:1,column:1}, to:{row:1,column:detailCols.length} };

  const sorted = recs.slice().sort((a,b)=> a.id<b.id?1:-1);
  sorted.forEach((r,i)=>{
    const tst = getTester(r.tester);
    const s = getStatus(r.status);
    const rowObj = wsDetail.addRow({
      id:r.id, mainSystem:r.mainSystem, subSystem:r.subSystem||'', programName:r.programName,
      version:r.version||'', issueType:issueTypeLabel(r.issueType), status:statusLabel(s),
      tester: tst? tst.name : t('common.unassigned'), testDate:r.testDate||'',
      responsible:r.responsible||'', relatedApps:r.relatedApps||'', issueDescription:r.issueDescription||'', notes:r.notes||'',
    });
    if(i%2===1) rowObj.eachCell(c=>{ if(!c.fill) c.fill = {type:'pattern',pattern:'solid',fgColor:{argb:'FF'+REPORT_COLORS.bandLight}}; });
    const col = reportStatusColor(r.status);
    const statusCell = rowObj.getCell(7);
    statusCell.fill = {type:'pattern',pattern:'solid',fgColor:{argb:'FF'+col.soft}};
    statusCell.font = {color:{argb:'FF'+col.fg}, bold:true};
    rowObj.eachCell(c=>{ c.alignment = { vertical:'top', wrapText:false }; });
  });

  [wsSum, wsSys, wsMonth, wsTester, wsDetail].forEach(ws=>{
    ws.pageSetup = { orientation:'landscape', fitToPage:true, fitToWidth:1, fitToHeight:0 };
  });

  return await wb.xlsx.writeBuffer();
}

/* ============================================================
   DATA (EXPORT / IMPORT / CLEAR)
   ============================================================ */
function dataPage(){
  return `
  <div class="grid-2">
    <div class="card card-pad">
      <div class="section-title">${esc(t('data.exportTitle'))}</div>
      <div class="section-sub">${esc(t('data.exportSub'))}</div>
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:6px">
        <button class="btn btn-primary btn-block" data-action="export-records-xlsx">${ICONS.download} ${esc(t('data.exportRecords'))}</button>
        <button class="btn btn-block" data-action="export-testers-xlsx">${ICONS.download} ${esc(t('data.exportTesters'))}</button>
        <button class="btn btn-block" data-action="export-statuses-xlsx">${ICONS.download} ${esc(t('data.exportStatuses'))}</button>
      </div>
    </div>
    <div class="card card-pad">
      <div class="section-title">${esc(t('data.importTitle'))}</div>
      <div class="section-sub">${esc(t('data.importSub'))}</div>
      <div class="upload-zone" data-action="pick-import-records" style="margin-bottom:10px">
        ${ICONS.upload}<div style="margin-top:8px;font-weight:600">${esc(t('data.importRecords'))}</div><div class="cell-muted">${esc(t('data.chooseFile'))}</div>
      </div>
      <div class="upload-zone" data-action="pick-import-testers">
        ${ICONS.upload}<div style="margin-top:8px;font-weight:600">${esc(t('data.importTesters'))}</div><div class="cell-muted">${esc(t('data.chooseFile'))}</div>
      </div>
    </div>
  </div>
  <div class="card card-pad">
    <div class="section-title">${esc(t('data.resetImportedTitle'))}</div>
    <div class="section-sub">${esc(t('data.resetImportedSub'))}</div>
    <button class="btn" data-action="reset-to-imported">${esc(t('common.reset'))}</button>
  </div>
  <div class="card card-pad" style="border-color:var(--danger)">
    <div class="section-title" style="color:var(--danger)">${esc(t('data.dangerTitle'))}</div>
    <div class="section-sub">${esc(t('data.dangerSub'))}</div>
    <button class="btn btn-danger" data-action="clear-all">${ICONS.trash} ${esc(t('data.clearBtn'))}</button>
  </div>
  `;
}

/* ============================================================
   BACKUP PAGE
   ============================================================ */
function backupPage(){
  return `
  <div class="helper-banner" style="${state.syncMode==='none'?'border-color:var(--text-faint)':''}">${ICONS.info}<div>
    <b>${esc(t('common.sync'+(state.syncMode||'none').charAt(0).toUpperCase()+(state.syncMode||'none').slice(1)))}.</b>
    ${esc(t('common.sync'+(state.syncMode||'none').charAt(0).toUpperCase()+(state.syncMode||'none').slice(1)+'Hint'))}
  </div></div>
  <div class="grid-2">
    <div class="card card-pad">
      <div class="section-title">${esc(t('backup.nowTitle'))}</div>
      <div class="section-sub">${esc(t('backup.nowSub'))}</div>
      <div class="kpi-sub" style="margin-bottom:14px">${esc(t('backup.lastBackup'))} <b class="mono">${state.lastBackupAt? fmtDateTime(state.lastBackupAt): esc(t('common.never'))}</b></div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-primary" data-action="backup-now">${ICONS.backup} ${esc(t('backup.backupBtn'))}</button>
        <button class="btn" data-action="download-latest-backup" ${!state.backups.length?'disabled':''}>${ICONS.download} ${esc(t('backup.downloadLatest'))}</button>
      </div>
    </div>
    <div class="card card-pad">
      <div class="section-title">${esc(t('backup.restoreTitle'))}</div>
      <div class="section-sub">${esc(t('backup.restoreSub'))}</div>
      <div class="upload-zone" data-action="pick-restore">
        ${ICONS.upload}<div style="margin-top:8px;font-weight:600">${esc(t('backup.restoreClick'))}</div><div class="cell-muted">${esc(t('backup.chooseBackupFile'))}</div>
      </div>
    </div>
  </div>
  <div class="card card-pad">
    <div class="section-title">${esc(t('backup.historyTitle'))}</div>
    <div class="section-sub">${esc(t('backup.historySub')(state.backups.length))}</div>
    ${!state.backups.length? emptyState('backup.empty','backup.emptySub', null): `
    <div class="history-list">
    ${state.backups.slice().reverse().map(b=>`<div class="history-row">
      <div class="history-meta"><b>${fmtDateTime(b.ts)}</b><span>${b.recordCount} · ${b.testerCount} · ${b.sizeKB} KB</span></div>
      <div class="row-actions">
        <button class="btn btn-sm" data-action="download-backup" data-id="${esc(b.id)}">${ICONS.download} ${esc(t('backup.download'))}</button>
        <button class="btn btn-sm btn-ghost" data-action="restore-backup" data-id="${esc(b.id)}">${esc(t('backup.restore'))}</button>
      </div>
    </div>`).join('')}
    </div>`}
  </div>
  `;
}

/* ============================================================
   MODALS
   ============================================================ */
function renderModal(){
  const root = document.getElementById('modal-root');
  if(!state.modal){ root.innerHTML=''; return; }
  const m = state.modal;
  let html='';
  if(m.type==='recordForm') html = recordFormModal(m.data);
  else if(m.type==='recordStatusForm') html = recordStatusFormModal(m.data);
  else if(m.type==='recordDetail') html = recordDetailModal(m.data);
  else if(m.type==='sendTester') html = sendTesterModal(m.data);
  else if(m.type==='testerForm') html = testerFormModal(m.data);
  else if(m.type==='statusForm') html = statusFormModal(m.data);
  else if(m.type==='systemForm') html = systemFormModal(m.data);
  else if(m.type==='subSystemForm') html = subSystemFormModal(m.data);
  else if(m.type==='confirm') html = confirmModal(m.data);
  root.innerHTML = `<div class="modal-overlay" data-action="close-modal-overlay"><div data-action="modal-noop" style="display:contents">${html}</div></div>`;
}

function fieldError(errors,key){ return errors && errors[key] ? `<div class="form-hint" style="color:var(--danger)">${esc(errors[key])}</div>` : ''; }

function recordFormModal(data){
  const isEdit = !!data.isEdit;
  const r = data.record;
  const errors = data.errors || {};
  const subs = subsForMainName(r.mainSystem);
  return `
  <div class="modal wide">
    <div class="modal-head">
      <div><h2>${isEdit?esc(t('form.editTitle')):esc(t('form.addTitle'))}</h2><p>${isEdit? esc(t('form.problemId'))+' '+esc(r.id) : esc(t('form.newIdNote'))}</p></div>
      <button class="btn btn-ghost icon-btn" data-action="close-modal">${ICONS.x}</button>
    </div>
    <div id="record-form">
    <div class="modal-body">
      <div class="form-grid">
        <div class="form-field"><label>${esc(t('form.mainSystem'))} <span class="req">*</span></label>
          <select name="mainSystem" data-action="record-mainsystem-change">
            <option value="">${esc(t('form.selectMainSystem'))}</option>
            ${r.mainSystem && !state.systems.some(s=>s.name===r.mainSystem) ? `<option value="${esc(r.mainSystem)}" selected>${esc(r.mainSystem)} (${esc(t('form.notInList'))})</option>` : ''}
            ${state.systems.map(s=>`<option value="${esc(s.name)}" ${r.mainSystem===s.name?'selected':''}>${esc(s.name)}</option>`).join('')}
          </select>
          ${fieldError(errors,'mainSystem')}
          ${!state.systems.length? `<div class="form-hint">${esc(t('form.noSystemsYet'))} <a href="#" data-action="nav" data-route="systems">${esc(t('nav.systems'))}</a></div>`:''}
        </div>
        <div class="form-field"><label>${esc(t('form.subSystem'))}</label>
          <select name="subSystem">
            <option value="">${esc(t('common.none'))}</option>
            ${r.subSystem && !subs.includes(r.subSystem) ? `<option value="${esc(r.subSystem)}" selected>${esc(r.subSystem)} (${esc(t('form.notInList'))})</option>` : ''}
            ${subs.map(name=>`<option value="${esc(name)}" ${r.subSystem===name?'selected':''}>${esc(name)}</option>`).join('')}
          </select>
        </div>
        <div class="form-field"><label>${esc(t('form.programName'))} <span class="req">*</span></label><input name="programName" value="${esc(r.programName)}" required>${fieldError(errors,'programName')}</div>
        <div class="form-field"><label>${esc(t('form.version'))}</label><input name="version" value="${esc(r.version)}" placeholder="${esc(t('form.versionPh'))}"></div>
        <div class="form-field full"><label>${esc(t('form.issueDesc'))} <span class="req">*</span></label>
          <textarea name="issueDescription" required>${esc(r.issueDescription)}</textarea>${fieldError(errors,'issueDescription')}
        </div>
        <div class="form-field"><label>${esc(t('form.issueType'))} <span class="req">*</span></label>
          <select name="issueType">${ISSUE_TYPES.map(it=>`<option value="${it.id}" ${r.issueType===it.id?'selected':''}>${esc(state.lang==='th'?it.th:it.en)}</option>`).join('')}</select>
        </div>
        <div class="form-field"><label>${esc(t('form.testStatus'))} <span class="req">*</span></label>
          <select name="status">${state.statuses.map(s=>`<option value="${esc(s.id)}" ${r.status===s.id?'selected':''}>${esc(statusLabel(s))}</option>`).join('')}</select>
        </div>
        <div class="form-field"><label>${esc(t('form.tester'))}</label>
          <select name="tester"><option value="">${esc(t('common.unassigned'))}</option>${state.testers.map(x=>`<option value="${esc(x.id)}" ${r.tester===x.id?'selected':''}>${esc(x.name)}${x.active?'':' ('+esc(t('common.inactive'))+')'}</option>`).join('')}</select>
        </div>
        <div class="form-field"><label>${esc(t('form.testDate'))} <span class="req">*</span></label><input type="date" name="testDate" value="${esc(r.testDate)}" required>${fieldError(errors,'testDate')}</div>
        <div class="form-field"><label>${esc(t('form.responsible'))}</label><input name="responsible" value="${esc(r.responsible||'')}"></div>
        <div class="form-field full"><label>${esc(t('form.relatedApps'))}</label><input name="relatedApps" value="${esc(r.relatedApps||'')}" placeholder="${esc(t('form.relatedAppsPh'))}"></div>
        <div class="form-field full"><label>${esc(t('form.notes'))}</label><textarea name="notes">${esc(r.notes)}</textarea></div>
        <div class="form-field full"><label>${esc(t('form.attachments'))}</label>
          <div class="file-drop" data-action="pick-attachment">${ICONS.file} ${esc(t('form.attachClick'))}</div>
          <div class="form-hint" style="margin-top:4px">${esc(t(supa?'form.attachHintOnline':'form.attachHintLocal'))}</div>
          <input type="file" id="attachment-input" multiple accept="image/*,.pdf,.doc,.docx,.xlsx" style="display:none">
          <div class="file-list" id="attachment-list">${(r.attachments||[]).map((f,i)=>attachmentChipHTML(f,i)).join('')}</div>
        </div>
      </div>
    </div>
    <div class="modal-foot">
      <button type="button" class="btn" data-action="close-modal">${esc(t('common.cancel'))}</button>
      <button type="button" class="btn btn-primary" data-action="save-record">${isEdit?esc(t('common.save')):esc(t('form.create'))}</button>
    </div>
    </div>
  </div>`;
}

function recordDetailModal(r){
  const s = getStatus(r.status);
  const tst = getTester(r.tester);
  const link = deepLinkFor(r.id);
  return `
  <div class="modal wide">
    <div class="modal-head">
      <div><h2 class="mono">${esc(r.id)}</h2><p>${esc(r.mainSystem)}${r.subSystem? ' / '+esc(r.subSystem):''}</p></div>
      <button class="btn btn-ghost icon-btn" data-action="close-modal">${ICONS.x}</button>
    </div>
    <div class="modal-body">
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px">${statusStamp(r.status)}<span class="month-tag" style="${monthTagStyle(monthKeyOf(r.testDate))}">${esc(monthLabel(monthKeyOf(r.testDate)))}</span></div>
      <div class="detail-grid">
        <div class="detail-item"><label>${esc(t('detail.programName'))}</label><div class="val">${esc(r.programName)||'—'}</div></div>
        <div class="detail-item"><label>${esc(t('detail.version'))}</label><div class="val">${esc(r.version)||'—'}</div></div>
        <div class="detail-item"><label>${esc(t('detail.issueType'))}</label><div class="val">${esc(issueTypeLabel(r.issueType))}</div></div>
        <div class="detail-item"><label>${esc(t('detail.testDate'))}</label><div class="val">${fmtDate(r.testDate)}</div></div>
        <div class="detail-item"><label>${esc(t('detail.tester'))}</label><div class="val">${tst? esc(tst.name)+(tst.email? ' · '+esc(tst.email):'') : esc(t('common.unassigned'))}</div></div>
        <div class="detail-item"><label>${esc(t('detail.status'))}</label><div class="val">${esc(statusLabel(s))} <span class="cell-muted">— ${esc(statusDesc(s))}</span></div></div>
        <div class="detail-item"><label>${esc(t('detail.responsible'))}</label><div class="val">${esc(r.responsible)||'—'}</div></div>
        <div class="detail-item"><label>${esc(t('detail.relatedApps'))}</label><div class="val">${esc(r.relatedApps)||'—'}</div></div>
        <div class="detail-item full"><label>${esc(t('detail.issueDesc'))}</label><div class="val">${esc(r.issueDescription)}</div></div>
        <div class="detail-item full"><label>${esc(t('detail.notes'))}</label><div class="val">${esc(r.notes)||'—'}</div></div>
        <div class="detail-item full"><label>${esc(t('detail.attachments'))}</label><div class="val">${(r.attachments&&r.attachments.length)? `<div class="attachment-gallery">${r.attachments.map(f=>attachmentGalleryItemHTML(f)).join('')}</div>` : esc(t('detail.none'))}</div></div>
        <div class="detail-item full"><label>${esc(t('detail.directLink'))}</label><div class="val mono" style="word-break:break-all;font-size:12px">${esc(link)}</div></div>
      </div>
    </div>
    <div class="modal-foot">
      ${state.accessRole==='admin' ? `<button class="btn btn-danger" data-action="delete-record" data-id="${esc(r.id)}">${ICONS.trash} ${esc(t('common.delete'))}</button>` : ''}
      <div style="flex:1"></div>
      <button class="btn" data-action="copy-link" data-id="${esc(r.id)}">${ICONS.link} ${esc(t('records.copyLink'))}</button>
      <button class="btn" data-action="send-tester" data-id="${esc(r.id)}">${ICONS.mail} ${esc(t('records.sendTester'))}</button>
      <button class="btn btn-primary" data-action="edit-record" data-id="${esc(r.id)}">${ICONS.edit} ${esc(t('common.edit'))}</button>
    </div>
  </div>`;
}

function recordStatusFormModal(data){
  const r = data.record;
  const errors = data.errors || {};
  return `
  <div class="modal">
    <div class="modal-head">
      <div><h2 class="mono">${esc(r.id)}</h2><p>${esc(r.programName)}</p></div>
      <button class="btn btn-ghost icon-btn" data-action="close-modal">${ICONS.x}</button>
    </div>
    <div id="record-status-form">
    <div class="modal-body">
      <div class="detail-grid" style="margin-bottom:14px">
        <div class="detail-item"><label>${esc(t('detail.programName'))}</label><div class="val">${esc(r.programName)||'—'}</div></div>
        <div class="detail-item"><label>${esc(t('form.mainSystem'))}</label><div class="val">${esc(r.mainSystem)}${r.subSystem?' / '+esc(r.subSystem):''}</div></div>
        <div class="detail-item full"><label>${esc(t('detail.issueDesc'))}</label><div class="val">${esc(r.issueDescription)}</div></div>
      </div>
      <div class="form-grid">
        <div class="form-field full"><label>${esc(t('form.testStatus'))} <span class="req">*</span></label>
          <select name="status">${state.statuses.map(s=>`<option value="${esc(s.id)}" ${r.status===s.id?'selected':''}>${esc(statusLabel(s))}</option>`).join('')}</select>
          ${fieldError(errors,'status')}
        </div>
      </div>
    </div>
    <div class="modal-foot">
      <button type="button" class="btn" data-action="close-modal">${esc(t('common.cancel'))}</button>
      <button type="button" class="btn btn-primary" data-action="save-record-status">${esc(t('common.save'))}</button>
    </div>
    </div>
  </div>`;
}

function sendTesterModal(data){
  const r = data.record;
  const lang = data.lang || (state.lang==='th'?'th':'en');
  const format = data.format || 'html';
  const testerId = data.testerId || r.tester || (state.testers[0] && state.testers[0].id) || '';
  const tst = getTester(testerId);
  const emailPlain = buildEmail(r, tst || {name:'', email:''}, lang);
  const emailHtml = buildEmailHTML(r, tst || {name:'', email:''}, lang);
  const subject = format==='html' ? emailHtml.subject : emailPlain.subject;
  return `
  <div class="modal wide">
    <div class="modal-head">
      <div><h2>${esc(t('send.title'))}</h2><p>${esc(r.id)} — ${esc(t('send.preview'))}</p></div>
      <button class="btn btn-ghost icon-btn" data-action="close-modal">${ICONS.x}</button>
    </div>
    <div class="modal-body">
      <div class="form-grid" style="margin-bottom:14px">
        <div class="form-field"><label>${esc(t('send.recipient'))}</label>
          <select data-action="send-tester-select">
            <option value="">${esc(t('send.selectTester'))}</option>
            ${state.testers.map(tt=>`<option value="${esc(tt.id)}" ${testerId===tt.id?'selected':''}>${esc(tt.name)}${tt.email?' ('+esc(tt.email)+')':''}</option>`).join('')}
          </select>
        </div>
        <div class="form-field"><label>${esc(t('send.language'))}</label>
          <div class="lang-toggle">
            <button type="button" class="${lang==='en'?'active':''}" data-action="send-tester-lang" data-lang="en">English</button>
            <button type="button" class="${lang==='th'?'active':''}" data-action="send-tester-lang" data-lang="th">ไทย</button>
            <button type="button" class="${lang==='both'?'active':''}" data-action="send-tester-lang" data-lang="both">EN+TH</button>
          </div>
        </div>
      </div>
      <div class="form-field" style="margin-bottom:12px">
        <label>${esc(t('send.format'))}</label>
        <div class="lang-toggle">
          <button type="button" class="${format==='html'?'active':''}" data-action="send-tester-format" data-format="html">${esc(t('send.formatHtml'))}</button>
          <button type="button" class="${format==='plain'?'active':''}" data-action="send-tester-format" data-format="plain">${esc(t('send.formatPlain'))}</button>
        </div>
      </div>
      <div class="form-field" style="margin-bottom:10px"><label>${esc(t('send.subject'))}</label><input type="text" id="email-subject" value="${esc(subject)}"></div>
      <label style="font-size:12px;font-weight:600;color:var(--text-muted)">${esc(t('send.previewLbl'))}</label>
      ${format==='html'
        ? `<div class="email-html-frame-wrap"><iframe id="email-html-frame" class="email-html-frame" srcdoc="${esc(emailHtml.html)}"></iframe></div>
           <div class="form-hint" style="margin-top:6px">${esc(t('send.htmlHint'))}</div>`
        : `<div class="email-preview" id="email-body">${esc(emailPlain.body)}</div>`}
    </div>
    <div class="modal-foot">
      <button class="btn" data-action="close-modal">${esc(t('common.cancel'))}</button>
      ${format==='html'
        ? `<button class="btn btn-primary" data-action="copy-email-html">${ICONS.copy} ${esc(t('send.copyFormatted'))}</button>`
        : `<button class="btn" data-action="copy-email">${ICONS.copy} ${esc(t('send.copyContent'))}</button>
           <button class="btn btn-primary" data-action="open-mail-client" data-id="${esc(r.id)}">${ICONS.mail} ${esc(t('send.openMail'))}</button>`}
    </div>
  </div>`;
}

function testerFormModal(data){
  const isEdit = !!data.isEdit;
  const x = data.tester;
  const errors = data.errors||{};
  return `
  <div class="modal">
    <div class="modal-head"><div><h2>${isEdit?esc(t('tester.editTitle')):esc(t('tester.addTitle'))}</h2></div><button class="btn btn-ghost icon-btn" data-action="close-modal">${ICONS.x}</button></div>
    <div id="tester-form">
    <div class="modal-body">
      <div class="form-grid">
        <div class="form-field full"><label>${esc(t('tester.name'))} <span class="req">*</span></label><input name="name" value="${esc(x.name)}" required>${fieldError(errors,'name')}</div>
        <div class="form-field"><label>${esc(t('tester.username'))} <span class="req">*</span></label><input name="username" value="${esc(x.username)}" required>${fieldError(errors,'username')}</div>
        <div class="form-field"><label>${esc(t('tester.email'))}</label><input type="email" name="email" value="${esc(x.email)}"></div>
        <div class="form-field"><label>${esc(t('tester.role'))}</label><input name="role" value="${esc(x.role)}"></div>
        <div class="form-field"><label>${esc(t('tester.accessRole'))}</label>
          <select name="accessRole">
            <option value="tester" ${x.accessRole!=='admin'?'selected':''}>${esc(t('tester.accessRoleTester'))}</option>
            <option value="admin" ${x.accessRole==='admin'?'selected':''}>${esc(t('tester.accessRoleAdmin'))}</option>
          </select>
        </div>
        <div class="form-field"><label>${esc(t('tester.department'))}</label><input name="department" value="${esc(x.department)}"></div>
        <div class="form-field"><label>${esc(t('tester.status'))}</label>
          <select name="active"><option value="true" ${x.active?'selected':''}>${esc(t('common.active'))}</option><option value="false" ${!x.active?'selected':''}>${esc(t('common.inactive'))}</option></select>
        </div>
        <div class="form-field full"><label>${esc(t('common.notes'))}</label><textarea name="notes">${esc(x.notes)}</textarea></div>
      </div>
    </div>
    <div class="modal-foot"><button type="button" class="btn" data-action="close-modal">${esc(t('common.cancel'))}</button><button type="button" class="btn btn-primary" data-action="save-tester">${isEdit?esc(t('common.save')):esc(t('tester.addBtn'))}</button></div>
    </div>
  </div>`;
}

const COLOR_PALETTE = ['#0E9F6E','#1E88C7','#C9781F','#D0362A','#5B5BD6','#6B7280','#0B6E4F','#B23A87','#2E7D9A'];
function statusFormModal(data){
  const isEdit=!!data.isEdit;
  const s = data.status;
  const errors = data.errors||{};
  return `
  <div class="modal">
    <div class="modal-head"><div><h2>${isEdit?esc(t('status.editTitle')):esc(t('status.addTitle'))}</h2></div><button class="btn btn-ghost icon-btn" data-action="close-modal">${ICONS.x}</button></div>
    <div id="status-form">
    <div class="modal-body">
      <div class="form-grid">
        <div class="form-field full"><label>${esc(t('status.label'))} <span class="req">*</span></label><input name="label" value="${esc(s.label)}" required>${fieldError(errors,'label')}</div>
        <div class="form-field full"><label>${esc(t('status.desc'))}</label><input name="desc" value="${esc(s.desc)}"></div>
        ${!['passed','installed','failed','under_revision','pending_test','cancelled','testing'].includes(s.id) ? `
        <div class="form-field full"><label>${esc(t('status.color'))}</label>
          <div class="chip-row">${COLOR_PALETTE.map(c=>`<button type="button" data-action="pick-status-color" data-color="${c}" style="width:26px;height:26px;border-radius:6px;background:${c};border:2px solid ${s.customColor===c?'#000':'transparent'}"></button>`).join('')}</div>
          <input type="hidden" name="customColor" value="${esc(s.customColor||COLOR_PALETTE[0])}">
        </div>`:`<div class="form-hint full" style="grid-column:1/-1">${esc(t('status.lockedColor'))}</div>`}
      </div>
    </div>
    <div class="modal-foot"><button type="button" class="btn" data-action="close-modal">${esc(t('common.cancel'))}</button><button type="button" class="btn btn-primary" data-action="save-status">${isEdit?esc(t('common.save')):esc(t('status.addBtn'))}</button></div>
    </div>
  </div>`;
}

function systemFormModal(data){
  const isEdit = !!data.isEdit;
  const s = data.system;
  const errors = data.errors||{};
  return `
  <div class="modal">
    <div class="modal-head"><div><h2>${isEdit?esc(t('sys.editMainTitle')):esc(t('sys.addMainTitle'))}</h2></div><button class="btn btn-ghost icon-btn" data-action="close-modal">${ICONS.x}</button></div>
    <div id="system-form">
    <div class="modal-body">
      <div class="form-field full"><label>${esc(t('sys.mainName'))} <span class="req">*</span></label><input name="name" value="${esc(s.name)}" required>${fieldError(errors,'name')}</div>
    </div>
    <div class="modal-foot"><button type="button" class="btn" data-action="close-modal">${esc(t('common.cancel'))}</button><button type="button" class="btn btn-primary" data-action="save-system">${isEdit?esc(t('common.save')):esc(t('sys.addMain'))}</button></div>
    </div>
  </div>`;
}

function subSystemFormModal(data){
  const isEdit = !!data.isEdit;
  const sub = data.sub;
  const parent = getSystem(data.sysId);
  const errors = data.errors||{};
  return `
  <div class="modal">
    <div class="modal-head"><div><h2>${isEdit?esc(t('sys.editSubTitle')):esc(t('sys.addSubTitle'))}</h2><p>${esc(t('sys.parentSystem'))} ${esc(parent?parent.name:'')}</p></div><button class="btn btn-ghost icon-btn" data-action="close-modal">${ICONS.x}</button></div>
    <div id="subsystem-form">
    <div class="modal-body">
      <div class="form-field full"><label>${esc(t('sys.subName'))} <span class="req">*</span></label><input name="name" value="${esc(sub.name)}" required>${fieldError(errors,'name')}</div>
    </div>
    <div class="modal-foot"><button type="button" class="btn" data-action="close-modal">${esc(t('common.cancel'))}</button><button type="button" class="btn btn-primary" data-action="save-subsystem">${isEdit?esc(t('common.save')):esc(t('sys.addSub'))}</button></div>
    </div>
  </div>`;
}

function confirmModal(data){
  return `
  <div class="modal">
    <div class="modal-head"><div><h2>${esc(data.title)}</h2></div><button class="btn btn-ghost icon-btn" data-action="close-modal">${ICONS.x}</button></div>
    <div class="modal-body"><p>${data.body}</p>
      ${data.typeToConfirm? `<div class="form-field" style="margin-top:10px"><label>${esc(t('confirm.typeToConfirm')(data.typeToConfirm))}</label><input type="text" id="confirm-input"></div>`:''}
    </div>
    <div class="modal-foot">
      <button class="btn" data-action="close-modal">${esc(t('common.cancel'))}</button>
      <button class="btn btn-danger" data-action="confirm-yes">${esc(data.confirmLabel||t('common.confirm'))}</button>
    </div>
  </div>`;
}

/* ============================================================
   EMAIL BUILDING (bilingual)
   ============================================================ */
function buildEmail(record, tester, lang){
  const link = deepLinkFor(record.id);
  const sys = record.mainSystem + (record.subSystem? ' / '+record.subSystem : '');
  const statusLbl = getStatus(record.status).label;
  const en = {
    subject: 'QC Record '+record.id+' — Action Required',
    body: 'Dear '+(tester.name||'Tester')+',\n\n'+
      'A QC record has been assigned to you for testing / review.\n\n'+
      'Problem ID: '+record.id+'\n'+
      'System / Module: '+sys+'\n'+
      'Program / Version: '+record.programName+' / '+record.version+'\n'+
      'Status: '+statusLbl+'\n\n'+
      'Issue Description:\n'+record.issueDescription+'\n\n'+
      'Direct link: '+link+'\n\n'+
      'Please review and update the test status accordingly.\n\n'+
      'Best regards,\nQC Management System'
  };
  const th = {
    subject: 'รายการ QC '+record.id+' — โปรดดำเนินการ',
    body: 'เรียนคุณ '+(tester.name||'ผู้ทดสอบ')+'\n\n'+
      'มีรายการ QC ที่ถูกมอบหมายให้ท่านทดสอบ / ตรวจสอบ\n\n'+
      'รหัสปัญหา (Problem ID): '+record.id+'\n'+
      'ระบบ / โมดูล: '+sys+'\n'+
      'โปรแกรม / เวอร์ชัน: '+record.programName+' / '+record.version+'\n'+
      'สถานะ: '+statusLbl+'\n\n'+
      'รายละเอียดปัญหา:\n'+record.issueDescription+'\n\n'+
      'ลิงก์โดยตรง: '+link+'\n\n'+
      'กรุณาตรวจสอบและปรับปรุงสถานะการทดสอบ\n\n'+
      'ขอแสดงความนับถือ\nระบบบริหารจัดการ QC'
  };
  if(lang==='en') return en;
  if(lang==='th') return th;
  return { subject: en.subject+' / '+th.subject, body: en.body+'\n\n'+'—'.repeat(24)+'\n\n'+th.body };
}

function emailTableRows(record, tester, lang, sys){
  const s = getStatus(record.status);
  const col = reportStatusColor(record.status);
  const L = lang==='th' ? {
    id:'รหัสปัญหา', sys:'ระบบ / โมดูล', prog:'โปรแกรม / เวอร์ชัน', status:'สถานะ', tester:'ผู้ทดสอบ', date:'วันที่ทดสอบ',
  } : {
    id:'Problem ID', sys:'System / Module', prog:'Program / Version', status:'Status', tester:'Tester', date:'Test Date',
  };
  const rows = [
    [L.id, `<span style="font-family:monospace;font-weight:700;color:#0B4F4F">${esc(record.id)}</span>`],
    [L.sys, esc(sys)],
    [L.prog, esc(record.programName)+' / '+esc(record.version||'—')],
    [L.status, `<span style="display:inline-block;background:#${col.soft};color:#${col.fg};padding:3px 10px;border-radius:12px;font-size:11px;font-weight:700">${esc(statusLabel(s))}</span>`],
    [L.tester, esc(tester.name||'—')],
    [L.date, esc(fmtDate(record.testDate))],
  ];
  return rows.map(([k,v])=>
    `<tr><td style="padding:9px 12px;border:1px solid #e2e6ee;background:#f5f7fa;font-weight:600;font-size:12.5px;white-space:nowrap">${k}</td><td style="padding:9px 12px;border:1px solid #e2e6ee;font-size:12.5px">${v}</td></tr>`
  ).join('');
}
function emailImagesHTML(record){
  const imgs = (record.attachments||[]).filter(isImageAttachment).map(attachmentImageSrc).filter(Boolean);
  if(!imgs.length) return '';
  return `<div style="margin:16px 0">${imgs.map(src=>
    `<img src="${esc(src)}" style="max-width:100%;border-radius:8px;border:1px solid #e2e6ee;margin-bottom:8px;display:block">`
  ).join('')}</div>`;
}
function buildEmailHTMLSection(record, tester, lang){
  const link = deepLinkFor(record.id);
  const sys = record.mainSystem + (record.subSystem? ' / '+record.subSystem : '');
  const isTh = lang==='th';
  const greeting = isTh ? `เรียนคุณ ${esc(tester.name||'ผู้ทดสอบ')}` : `Dear ${esc(tester.name||'Tester')},`;
  const intro = isTh ? 'มีรายการ QC ที่ถูกมอบหมายให้ท่านทดสอบ / ตรวจสอบ ตามรายละเอียดด้านล่าง' : 'A QC record has been assigned to you for testing / review. Details below.';
  const descLabel = isTh ? 'รายละเอียดการแจ้งปัญหา' : 'Issue Description';
  const btnLabel = isTh ? 'เปิดดูรายการ' : 'Open Record';
  const closing = isTh ? 'กรุณาตรวจสอบและปรับปรุงสถานะการทดสอบ' : 'Please review and update the test status accordingly.';
  const sign = isTh ? 'ขอแสดงความนับถือ<br>ระบบบริหารจัดการ QC' : 'Best regards,<br>QC Management System';
  return `
    <p style="margin:0 0 4px">${greeting}</p>
    <p style="margin:0 0 16px;color:#5b6779">${intro}</p>
    <table style="width:100%;border-collapse:collapse;margin:0 0 16px">${emailTableRows(record,tester,lang,sys)}</table>
    <div style="margin:0 0 4px;font-weight:700;font-size:13px">${descLabel}</div>
    <p style="margin:0 0 8px;white-space:pre-wrap;font-size:13px;color:#182233">${esc(record.issueDescription)}</p>
    ${emailImagesHTML(record)}
    <div style="text-align:center;margin:22px 0">
      <a href="${esc(link)}" style="background:#0F6E6E;color:#ffffff;padding:11px 28px;border-radius:7px;text-decoration:none;font-weight:700;font-size:13px;display:inline-block">${btnLabel}</a>
    </div>
    <p style="margin:0 0 12px;font-size:12.5px;color:#5b6779">${closing}</p>
    <p style="margin:0;font-size:12.5px;color:#5b6779">${sign}</p>
  `;
}
function buildEmailHTML(record, tester, lang){
  const subjectPlain = buildEmail(record, tester, lang==='both'?'en':lang).subject;
  let bodyInner;
  if(lang==='both'){
    bodyInner = buildEmailHTMLSection(record,tester,'en')
      + '<hr style="border:none;border-top:1px solid #e2e6ee;margin:24px 0">'
      + buildEmailHTMLSection(record,tester,'th');
  } else {
    bodyInner = buildEmailHTMLSection(record,tester,lang);
  }
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2e6ee;border-radius:12px;overflow:hidden;background:#ffffff">
  <div style="background:#0F6E6E;color:#ffffff;padding:18px 22px">
    <div style="font-size:11px;letter-spacing:.06em;text-transform:uppercase;opacity:.85">QC Management System</div>
    <div style="font-size:19px;font-weight:700;margin-top:4px;font-family:monospace">${esc(record.id)}</div>
  </div>
  <div style="padding:22px">${bodyInner}</div>
</div>`;
  return { subject: subjectPlain, html };
}

/* ============================================================
   EXCEL EXPORT / IMPORT
   ============================================================ */
function recordsToSheetRows(recs){
  return recs.map(r=>({
    'Problem ID': r.id, 'Main System': r.mainSystem, 'Sub System': r.subSystem,
    'Program Name': r.programName, 'Version': r.version, 'Issue Description': r.issueDescription,
    'Issue Type': issueTypeLabel(r.issueType),
    'Test Status': getStatus(r.status).label, 'Tester': getTester(r.tester)?.name||'', 'Test Date': r.testDate,
    'Responsible': r.responsible||'', 'Related Applications': r.relatedApps||'',
    'Notes': r.notes||'', 'Attachments': (r.attachments||[]).map(a=>a.name).join('; '),
  }));
}
function exportXLSX(filename, sheetName, rows){
  if(typeof XLSX==='undefined'){ toast(t('toast.excelFail'),'error'); return; }
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const out = XLSX.write(wb, {bookType:'xlsx', type:'array'});
  download(filename, new Blob([out], {type:'application/octet-stream'}));
  toast(t('toast.exported')(filename), 'success');
}
function readXLSX(file, cb){
  if(typeof XLSX==='undefined'){ toast(t('toast.excelFail'),'error'); return; }
  const reader = new FileReader();
  reader.onload = e=>{
    try{
      const wb = XLSX.read(e.target.result, {type:'array'});
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, {defval:''});
      cb(null, rows);
    }catch(err){ cb(err); }
  };
  reader.onerror = ()=>cb(new Error('Could not read file'));
  reader.readAsArrayBuffer(file);
}
function pick(row, keys){ for(const k of keys){ if(row[k]!==undefined && row[k]!=='') return row[k]; } return ''; }

/* ============================================================
   ACTIONS (event delegation registry)
   ============================================================ */
function findRecord(id){ return state.records.find(r=>r.id===id); }
function safeSetHash(hash){
  try{ history.replaceState(null,'',hash); }catch(e){ try{ location.hash = hash; }catch(e2){} }
}

function openAddRecord(){
  state.modal={type:'recordForm', isEdit:false, data:{record:{mainSystem:'',subSystem:'',programName:'',version:'',issueDescription:'',issueType:ISSUE_TYPES[0].id,status:state.statuses[0]?.id||'pending_test',tester:'',testDate:todayISO(),notes:'',responsible:'',relatedApps:'',attachments:[]}, isEdit:false, errors:{}}};
  render();
}
function openEditRecord(id){ const r=findRecord(id); if(!r) return; state.modal={type:'recordForm', data:{record:JSON.parse(JSON.stringify(r)), isEdit:true, errors:{}}}; render(); }
function openEditRecordStatus(id){ const r=findRecord(id); if(!r) return; state.modal={type:'recordStatusForm', data:{record:JSON.parse(JSON.stringify(r)), errors:{}}}; render(); }
function openDetail(id){ const r=findRecord(id); if(!r) return; state.modal={type:'recordDetail', data:r}; render(); safeSetHash('#/records/'+encodeURIComponent(id)); }
function closeModalAndClearHash(){
  state.modal=null;
  render();
  try{ if(location.hash.startsWith('#/records/')) safeSetHash('#/records'); }catch(e){}
}

function captureAuthFormIntoState(){
  const el = document.getElementById('auth-email');
  if(el) state.authEmail = el.value;
}
function captureRecordFormIntoState(){
  // Attachment add/remove triggers a re-render of the whole Add/Edit modal; without
  // this, any text the user already typed into other fields (not yet saved) would
  // be wiped out because render() rebuilds the form HTML from state.
  const form = document.getElementById('record-form');
  if(!form || !state.modal || !state.modal.data || !state.modal.data.record) return;
  Object.assign(state.modal.data.record, collectFields(form));
}
function collectFields(container){
  // Forms in this app are plain <div> containers, not <form> elements — sandboxed
  // preview iframes (no "allow-forms") silently block native form submission, so we
  // never rely on it. This reads named fields directly instead of using FormData.
  const data = {};
  if(!container) return data;
  container.querySelectorAll('[name]').forEach(el=>{
    if(el.type==='checkbox') data[el.name] = el.checked;
    else data[el.name] = el.value;
  });
  return data;
}

const actions = {
  'nav'(btn){ state.route={name:btn.dataset.route, param:null}; state.sidebarOpen=false; render(); try{ location.hash = '#/'+btn.dataset.route; }catch(e){} },
  'open-sidebar'(){ state.sidebarOpen=true; render(); },
  'close-sidebar'(){ state.sidebarOpen=false; render(); },
  'toggle-theme'(){ state.theme = state.theme==='dark'?'light':'dark'; document.documentElement.setAttribute('data-theme', state.theme); render(); },
  'set-lang'(btn){ state.lang = btn.dataset.lang; render(); },
  'toggle-auth-mode'(){ captureAuthFormIntoState(); state.authMode = state.authMode==='signup'?'login':'signup'; state.authError=''; state.authNotice=''; render(); },
  async 'submit-login'(){
    captureAuthFormIntoState();
    if(!supa){ state.authError=t('auth.genericError'); render(); return; }
    const password = document.getElementById('auth-password')?.value||'';
    if(!state.authEmail || !password){ state.authError=t('auth.required'); render(); return; }
    state.authBusy=true; state.authError=''; render();
    const { error } = await supa.auth.signInWithPassword({ email:state.authEmail, password });
    state.authBusy=false;
    if(error){ state.authError = error.message || t('auth.genericError'); render(); }
    else { state.authNotice=''; }
  },
  async 'submit-signup'(){
    captureAuthFormIntoState();
    if(!supa){ state.authError=t('auth.genericError'); render(); return; }
    const password = document.getElementById('auth-password')?.value||'';
    if(!state.authEmail || !password){ state.authError=t('auth.required'); render(); return; }
    state.authBusy=true; state.authError=''; render();
    const { error } = await supa.auth.signUp({
      email:state.authEmail, password,
      options:{ emailRedirectTo: location.origin + location.pathname },
    });
    state.authBusy=false;
    if(error){ state.authError = error.message || t('auth.genericError'); render(); return; }
    state.authMode='login';
    state.authNotice = t('auth.signupDone');
    toast(t('auth.signupDone'),'success');
    render();
  },
  async 'logout'(){ if(supa) await supa.auth.signOut(); },
  'dashboard-month'(sel){ state.ui.dashboardMonth = sel.value; render(); },
  'report-month'(sel){ state.ui.reportMonth = sel.value; render(); },
  async 'export-report'(){
    if(typeof window.ExcelJS === 'undefined'){ toast(t('toast.excelFail'),'error'); return; }
    toast(t('report.generating'));
    try{
      const buf = await generateReportWorkbook(state.ui.reportMonth);
      const period = state.ui.reportMonth==='all' ? 'all' : state.ui.reportMonth;
      download('QC_Report_'+period+'.xlsx', new Blob([buf], {type:'application/octet-stream'}));
      toast(t('report.done'),'success');
    }catch(e){ console.error(e); toast(t('toast.excelFail'),'error'); }
  },
  'close-modal'(){ closeModalAndClearHash(); },
  'close-modal-overlay'(){ closeModalAndClearHash(); },
  'modal-noop'(){ /* swallow clicks on empty modal space without blocking bubbling of real actions */ },
  'add-record'(){ openAddRecord(); },
  'open-detail'(btn){ openDetail(btn.dataset.id); },
  'edit-record'(btn){ if(state.accessRole==='admin') openEditRecord(btn.dataset.id); else openEditRecordStatus(btn.dataset.id); },
  'record-mainsystem-change'(sel){
    captureRecordFormIntoState();
    state.modal.data.record.mainSystem = sel.value;
    state.modal.data.record.subSystem = '';
    render();
  },
  'delete-record'(btn){
    const id=btn.dataset.id;
    state.modal={type:'confirm', data:{title:t('confirm.delRecordTitle'), body:t('confirm.delRecordBody')(esc(id)), confirmLabel:t('common.delete'), onConfirm:()=>{
      state.records = state.records.filter(r=>r.id!==id); toast(t('toast.recDeleted')(id),'success'); closeModalAndClearHash();
    }}};
    render();
  },
  async 'copy-link'(btn){
    const id=btn.dataset.id;
    try{ await copyToClipboard(deepLinkFor(id)); toast(t('toast.linkCopied')(id),'success'); }
    catch(e){ toast(t('toast.mailCopyBlocked'),'error'); }
  },
  'send-tester'(btn){ const r=findRecord(btn.dataset.id); if(!r) return; state.modal={type:'sendTester', data:{record:r, lang:(state.lang==='th'?'th':'en'), testerId:r.tester}}; render(); },
  'send-tester-select'(sel){ state.modal.data.testerId = sel.value; render(); },
  'send-tester-lang'(btn){ state.modal.data.lang = btn.dataset.lang; render(); },
  'send-tester-format'(btn){ state.modal.data.format = btn.dataset.format; render(); },
  async 'copy-email'(){
    const subj = document.getElementById('email-subject').value;
    const body = document.getElementById('email-body').textContent;
    try{ await copyToClipboard('Subject: '+subj+'\n\n'+body); toast(t('toast.mailCopied'),'success'); }
    catch(e){ toast(t('toast.mailCopyBlocked'),'error'); }
  },
  async 'copy-email-html'(){
    const r = findRecord(state.modal.data.record.id);
    const tst = getTester(state.modal.data.testerId);
    const lang = state.modal.data.lang || 'en';
    const subj = document.getElementById('email-subject').value;
    const emailHtml = buildEmailHTML(r, tst || {name:''}, lang);
    const plainFallback = buildEmail(r, tst || {name:''}, lang==='both'?'en':lang).body;
    try{
      if(typeof ClipboardItem === 'undefined') throw new Error('ClipboardItem unsupported');
      const item = new ClipboardItem({
        'text/html': new Blob([emailHtml.html], {type:'text/html'}),
        'text/plain': new Blob([plainFallback], {type:'text/plain'}),
      });
      await navigator.clipboard.write([item]);
      toast(t('toast.mailHtmlCopied'),'success');
    }catch(e){
      try{
        await copyToClipboard('Subject: '+subj+'\n\n'+plainFallback);
        toast(t('toast.mailHtmlCopyFailed'),'error');
      }catch(e2){
        toast(t('toast.mailCopyBlocked'),'error');
      }
    }
  },
  'open-mail-client'(btn){
    const t2 = getTester(state.modal.data.testerId);
    if(!t2){ toast(t('toast.selectTesterFirst'),'error'); return; }
    const subj = document.getElementById('email-subject').value;
    const body = document.getElementById('email-body').textContent;
    window.open('mailto:'+encodeURIComponent(t2.email||'')+'?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(body), '_blank');
    toast(t('toast.mailOpened'),'success');
  },
  'pick-attachment'(){ document.getElementById('attachment-input').click(); },
  'remove-attachment'(btn){
    captureRecordFormIntoState();
    const idx = parseInt(btn.dataset.idx,10);
    const [removed] = state.modal.data.record.attachments.splice(idx,1);
    deleteAttachmentFromStorage(removed);
    render();
  },
  'add-tester'(){ state.modal={type:'testerForm', data:{tester:{name:'',username:'',email:'',role:'',department:'',active:true,notes:''}, isEdit:false, errors:{}}}; render(); },
  'edit-tester'(btn){ const x=state.testers.find(v=>v.id===btn.dataset.id); state.modal={type:'testerForm', data:{tester:JSON.parse(JSON.stringify(x)), isEdit:true, errors:{}}}; render(); },
  'delete-tester'(btn){
    const id=btn.dataset.id; const inUse = state.records.some(r=>r.tester===id);
    state.modal={type:'confirm', data:{title:t('confirm.delTesterTitle'), body: inUse? t('confirm.delTesterInUse') : t('confirm.delTesterOk'), confirmLabel:t('common.delete'), onConfirm:()=>{
      state.testers = state.testers.filter(x=>x.id!==id);
      state.records.forEach(r=>{ if(r.tester===id) r.tester=''; });
      toast(t('toast.testerRemoved'),'success'); state.modal=null; render();
    }}};
    render();
  },
  'add-status'(){ state.modal={type:'statusForm', data:{status:{id:uid('st'),label:'',desc:'',customColor:COLOR_PALETTE[0]}, isEdit:false, errors:{}}}; render(); },
  'edit-status'(btn){ const s=state.statuses.find(v=>v.id===btn.dataset.id); state.modal={type:'statusForm', data:{status:JSON.parse(JSON.stringify(s)), isEdit:true, errors:{}}}; render(); },
  'delete-status'(btn){
    const id=btn.dataset.id; const count = state.records.filter(r=>r.status===id).length;
    state.modal={type:'confirm', data:{title:t('confirm.delStatusTitle'), body: count? t('confirm.delStatusInUse')(count) : t('confirm.delStatusOk'), confirmLabel:t('common.delete'), onConfirm:()=>{
      state.statuses = state.statuses.filter(s=>s.id!==id); toast(t('toast.statusRemoved'),'success'); state.modal=null; render();
    }}};
    render();
  },
  'reset-statuses'(){
    state.modal={type:'confirm', data:{title:t('confirm.resetStatusTitle'), body:t('confirm.resetStatusBody'), confirmLabel:t('common.reset'), onConfirm:()=>{
      state.statuses = JSON.parse(JSON.stringify(DEFAULT_STATUSES)); toast(t('toast.statusesReset'),'success'); state.modal=null; render();
    }}};
    render();
  },
  'pick-status-color'(btn){ state.modal.data.status.customColor = btn.dataset.color; render(); },
  'add-system'(){ state.modal={type:'systemForm', data:{system:{id:uid('sys'), name:''}, isEdit:false, errors:{}}}; render(); },
  'edit-system'(btn){ const s=getSystem(btn.dataset.id); state.modal={type:'systemForm', data:{system:JSON.parse(JSON.stringify(s)), isEdit:true, errors:{}}}; render(); },
  'delete-system'(btn){
    const id=btn.dataset.id; const sys=getSystem(id); if(!sys) return;
    const count = state.records.filter(r=>r.mainSystem===sys.name).length;
    state.modal={type:'confirm', data:{title:t('confirm.delSystemTitle'), body: count? t('confirm.delSystemInUse')(count) : t('confirm.delSystemOk'), confirmLabel:t('common.delete'), onConfirm:()=>{
      state.systems = state.systems.filter(s=>s.id!==id); toast(t('toast.systemRemoved'),'success'); state.modal=null; render();
    }}};
    render();
  },
  'add-subsystem'(btn){ state.modal={type:'subSystemForm', data:{sysId:btn.dataset.sysid, sub:{id:uid('sub'), name:''}, isEdit:false, errors:{}}}; render(); },
  'edit-subsystem'(btn){
    const sys=getSystem(btn.dataset.sysid); if(!sys) return;
    const sub = sys.subs.find(x=>x.id===btn.dataset.subid); if(!sub) return;
    state.modal={type:'subSystemForm', data:{sysId:sys.id, sub:JSON.parse(JSON.stringify(sub)), isEdit:true, errors:{}}};
    render();
  },
  'delete-subsystem'(btn){
    const sys=getSystem(btn.dataset.sysid); if(!sys) return;
    const sub = sys.subs.find(x=>x.id===btn.dataset.subid); if(!sub) return;
    state.modal={type:'confirm', data:{title:t('confirm.delSubTitle'), body:t('confirm.delSubOk'), confirmLabel:t('common.delete'), onConfirm:()=>{
      sys.subs = sys.subs.filter(x=>x.id!==sub.id); toast(t('toast.subRemoved'),'success'); state.modal=null; render();
    }}};
    render();
  },
  'export-testers-xlsx'(){ exportXLSX('qc-testers.xlsx','Testers', state.testers.map(x=>({'Tester Name':x.name,'Username / Employee ID':x.username,'Email':x.email,'Role':x.role,'Department':x.department,'Active':x.active?'Yes':'No','Notes':x.notes||''}))); },
  'pick-import-testers'(){ document.getElementById('file-import-testers').click(); },
  'export-records-xlsx'(){ exportXLSX('qc-records.xlsx','QC Records', recordsToSheetRows(state.records)); },
  'export-statuses-xlsx'(){ exportXLSX('qc-statuses.xlsx','Program Statuses', state.statuses.map(s=>({'Status ID':s.id,'Label':s.label,'Description':s.desc||''}))); },
  'pick-import-records'(){ document.getElementById('file-import-records').click(); },
  'reset-to-imported'(){
    state.modal={type:'confirm', data:{title:t('data.resetImportedTitle'), body:t('data.resetImportedSub'), confirmLabel:t('common.reset'), onConfirm:()=>{
      state.records = JSON.parse(JSON.stringify(DEFAULT_RECORDS)).map(r=>Object.assign({}, r, {
        createdAt: Date.parse(r.testDate)||Date.now(), notes: r.notes||'', attachments: r.attachments||[],
        responsible: r.responsible||'', relatedApps: r.relatedApps||'', reportedTime: r.reportedTime||'',
      }));
      state.testers = JSON.parse(JSON.stringify(DEFAULT_TESTERS));
      state.systems = JSON.parse(JSON.stringify(DEFAULT_SYSTEMS));
      state.statuses = JSON.parse(JSON.stringify(DEFAULT_STATUSES));
      state.nextSeq = computeNextSeq(state.records);
      toast(t('toast.resetToImported'),'success'); state.modal=null; render();
    }}};
    render();
  },
  'clear-all'(){
    state.modal={type:'confirm', data:{title:t('confirm.clearAllTitle'), body:t('confirm.clearAllBody'), confirmLabel:t('data.clearBtn'), typeToConfirm:'DELETE', onConfirm:()=>{
      const input = document.getElementById('confirm-input');
      if(!input || input.value!=='DELETE'){ toast(t('toast.typeDelete'),'error'); return false; }
      state.records=[]; state.testers=[]; state.statuses=JSON.parse(JSON.stringify(DEFAULT_STATUSES)); state.systems=[];
      clearStorage();
      toast(t('toast.allCleared'),'success'); state.modal=null; render();
    }}};
    render();
  },
  'backup-now'(){
    const snapshot = { ts:Date.now(), records:JSON.parse(JSON.stringify(state.records)), testers:JSON.parse(JSON.stringify(state.testers)), statuses:JSON.parse(JSON.stringify(state.statuses)), systems:JSON.parse(JSON.stringify(state.systems)) };
    const json = JSON.stringify(snapshot);
    const sizeKB = Math.max(1, Math.round(new Blob([json]).size/1024));
    const b = { id: uid('bk'), ts:snapshot.ts, recordCount:snapshot.records.length, testerCount:snapshot.testers.length, sizeKB, snapshot };
    state.backups.push(b); state.lastBackupAt = b.ts;
    toast(t('toast.backupCreated')(b.recordCount),'success');
    render();
  },
  'download-latest-backup'(){ if(!state.backups.length) return; const b=state.backups[state.backups.length-1]; downloadJSON('qc-backup-'+b.ts+'.json', b.snapshot); },
  'download-backup'(btn){ const b=state.backups.find(x=>x.id===btn.dataset.id); if(b) downloadJSON('qc-backup-'+b.ts+'.json', b.snapshot); },
  'restore-backup'(btn){
    const b=state.backups.find(x=>x.id===btn.dataset.id); if(!b) return;
    state.modal={type:'confirm', data:{title:t('confirm.restoreBackupTitle'), body:t('confirm.restoreBackupBody')(fmtDateTime(b.ts)), confirmLabel:t('backup.restore'), onConfirm:()=>{
      applySnapshot(b.snapshot); toast(t('toast.backupRestored'),'success'); state.modal=null; render();
    }}};
    render();
  },
  'pick-restore'(){ document.getElementById('file-restore').click(); },
  'sort-records'(th){
    const key = th.dataset.key; const u=state.ui.records;
    if(u.sortKey===key) u.sortDir = u.sortDir==='asc'?'desc':'asc'; else { u.sortKey=key; u.sortDir='asc'; }
    render();
  },
  'page'(btn){
    const u=state.ui.records;
    if(btn.dataset.dir==='prev') u.page=Math.max(1,u.page-1); else u.page=u.page+1;
    render();
  },
  'clear-record-filters'(){
    Object.assign(state.ui.records,{search:'',system:'all',month:'all',status:'all',tester:'all',date:'',page:1});
    render();
  },
  'confirm-yes'(){
    const d = state.modal && state.modal.data;
    if(d && typeof d.onConfirm==='function'){ const r=d.onConfirm(); if(r===false) return; }
  },
  'save-record'(){ submitRecordForm(document.getElementById('record-form')); },
  'save-record-status'(){ submitTesterStatusUpdate(document.getElementById('record-status-form')); },
  'save-tester'(){ submitTesterForm(document.getElementById('tester-form')); },
  'save-status'(){ submitStatusForm(document.getElementById('status-form')); },
  'save-system'(){ submitSystemForm(document.getElementById('system-form')); },
  'save-subsystem'(){ submitSubSystemForm(document.getElementById('subsystem-form')); },
};

function applySnapshot(snap){
  state.records = JSON.parse(JSON.stringify(snap.records||[]));
  state.testers = JSON.parse(JSON.stringify(snap.testers||[]));
  state.statuses = JSON.parse(JSON.stringify(snap.statuses||DEFAULT_STATUSES));
  state.systems = JSON.parse(JSON.stringify(snap.systems||[]));
  state.modal=null;
}

function handleBind(el){
  const path = el.dataset.bind.split('.');
  let target = state.ui;
  for(let i=0;i<path.length-1;i++) target = target[path[i]];
  let val = el.value;
  if(el.tagName==='SELECT' && (path[path.length-1]==='pageSize')) val = parseInt(val,10);
  target[path[path.length-1]] = val;
  if(path[0]==='records' && path[1]!=='page') state.ui.records.page = 1;
  render();
}

function attachGlobalEvents(){
  const app = document.getElementById('app');
  app.onclick = e=>{
    const el = e.target.closest('[data-action]');
    if(!el) return;
    const fn = actions[el.dataset.action];
    if(fn) fn(el, e);
  };
  app.onchange = e=>{
    const el = e.target;
    if(el.dataset && el.dataset.bind){ handleBind(el); return; }
    if(el.dataset && el.dataset.action){
      const fn = actions[el.dataset.action];
      if(fn) fn(el, e);
    }
    if(el.id==='attachment-input'){
      captureRecordFormIntoState();
      const files = Array.from(el.files);
      el.value = '';
      handleAttachmentFiles(files);
    }
    if(el.id==='file-import-records') importRecordsFile(el.files[0]);
    if(el.id==='file-import-testers') importTestersFile(el.files[0]);
    if(el.id==='file-restore') importRestoreFile(el.files[0]);
  };
  app.oninput = e=>{
    const el = e.target;
    if(el.dataset && el.dataset.bind) handleBind(el);
  };
  document.onkeydown = e=>{
    if(e.key==='Escape' && state.modal) { closeModalAndClearHash(); return; }
    if(e.key==='Enter' && !state.session && e.target.tagName==='INPUT'){
      e.preventDefault();
      actions[state.authMode==='signup'?'submit-signup':'submit-login']();
      return;
    }
    if(e.key==='Enter' && state.modal && (e.target.tagName==='INPUT' || e.target.tagName==='SELECT')){
      const saveActionByModal = { recordForm:'save-record', recordStatusForm:'save-record-status', testerForm:'save-tester', statusForm:'save-status', systemForm:'save-system', subSystemForm:'save-subsystem' };
      const actionName = saveActionByModal[state.modal.type];
      if(actionName){ e.preventDefault(); actions[actionName](); }
    }
  };
}

function submitRecordForm(form){
  const data = collectFields(form);
  const errors = {};
  if(!data.mainSystem||!data.mainSystem.trim()) errors.mainSystem=t('form.mainSystem')+' '+t('form.required');
  if(!data.programName||!data.programName.trim()) errors.programName=t('form.programName')+' '+t('form.required');
  if(!data.issueDescription||!data.issueDescription.trim()) errors.issueDescription=t('form.issueDesc')+' '+t('form.required');
  if(!data.testDate) errors.testDate=t('form.testDate')+' '+t('form.required');
  if(Object.keys(errors).length){
    state.modal.data.errors=errors;
    render();
    toast(Object.values(errors)[0], 'error');
    return;
  }

  const isEdit = state.modal.data.isEdit;
  const attachments = state.modal.data.record.attachments || [];
  if(isEdit){
    const r = findRecord(state.modal.data.record.id);
    Object.assign(r, data, {attachments});
    toast(t('toast.recUpdated')(r.id),'success');
  } else {
    const year = new Date(data.testDate).getFullYear() || new Date().getFullYear();
    const id = 'QC-'+year+'-'+pad4(state.nextSeq++);
    const rec = Object.assign({id, attachments, notes:data.notes||'', createdAt:Date.now()}, data);
    state.records.unshift(rec);
    toast(t('toast.recCreated')(id),'success');
  }
  state.modal=null; render();
}

async function submitTesterStatusUpdate(form){
  const data = collectFields(form);
  if(!data.status){ state.modal.data.errors={status:t('form.testStatus')+' '+t('form.required')}; render(); return; }
  const id = state.modal.data.record.id;
  const r = findRecord(id);
  if(!r) return;
  r.status = data.status;
  state.modal = null; render();
  const { error } = await pushTesterStatusUpdate(id, data.status);
  if(error){ toast(t('auth.genericError'),'error'); }
  else toast(t('toast.recUpdated')(id),'success');
}

function submitTesterForm(form){
  const data = collectFields(form);
  const errors={};
  if(!data.name||!data.name.trim()) errors.name=t('tester.name')+' '+t('form.required');
  if(!data.username||!data.username.trim()) errors.username=t('tester.username')+' '+t('form.required');
  if(Object.keys(errors).length){ state.modal.data.errors=errors; render(); toast(Object.values(errors)[0], 'error'); return; }
  data.active = data.active==='true';
  const isEdit = state.modal.data.isEdit;
  if(isEdit){
    const x = state.testers.find(v=>v.id===state.modal.data.tester.id);
    Object.assign(x, data);
    toast(t('toast.testerUpdated'),'success');
  }else{
    const id = 'T'+String(state.testers.length+1).padStart(3,'0')+Math.random().toString(36).slice(2,4);
    state.testers.push(Object.assign({id}, data));
    toast(t('toast.testerAdded'),'success');
  }
  state.modal=null; render();
}

function submitStatusForm(form){
  const data = collectFields(form);
  if(!data.label || !data.label.trim()){ state.modal.data.errors={label:t('status.label')+' '+t('form.required')}; render(); toast(t('status.label')+' '+t('form.required'),'error'); return; }
  const isEdit = state.modal.data.isEdit;
  if(isEdit){
    const s = state.statuses.find(v=>v.id===state.modal.data.status.id);
    s.label=data.label; s.desc=data.desc; if(data.customColor) s.customColor=data.customColor;
    toast(t('toast.statusUpdated'),'success');
  }else{
    state.statuses.push({id:state.modal.data.status.id, label:data.label, desc:data.desc, color:'custom', customColor:data.customColor||COLOR_PALETTE[0]});
    toast(t('toast.statusAdded'),'success');
  }
  state.modal=null; render();
}

function submitSystemForm(form){
  const data = collectFields(form);
  if(!data.name || !data.name.trim()){ state.modal.data.errors={name:t('sys.mainName')+' '+t('form.required')}; render(); toast(t('sys.mainName')+' '+t('form.required'),'error'); return; }
  const isEdit = state.modal.data.isEdit;
  if(isEdit){
    const s = getSystem(state.modal.data.system.id);
    const oldName = s.name;
    s.name = data.name.trim();
    if(oldName!==s.name) state.records.forEach(r=>{ if(r.mainSystem===oldName) r.mainSystem=s.name; });
    toast(t('toast.systemUpdated'),'success');
  }else{
    state.systems.push({id:state.modal.data.system.id, name:data.name.trim(), subs:[]});
    toast(t('toast.systemAdded'),'success');
  }
  state.modal=null; render();
}

function submitSubSystemForm(form){
  const data = collectFields(form);
  if(!data.name || !data.name.trim()){ state.modal.data.errors={name:t('sys.subName')+' '+t('form.required')}; render(); toast(t('sys.subName')+' '+t('form.required'),'error'); return; }
  const sys = getSystem(state.modal.data.sysId);
  if(!sys){ state.modal=null; render(); return; }
  const isEdit = state.modal.data.isEdit;
  if(isEdit){
    const sub = sys.subs.find(x=>x.id===state.modal.data.sub.id);
    const oldName = sub.name;
    sub.name = data.name.trim();
    if(oldName!==sub.name) state.records.forEach(r=>{ if(r.mainSystem===sys.name && r.subSystem===oldName) r.subSystem=sub.name; });
    toast(t('toast.subUpdated'),'success');
  }else{
    sys.subs.push({id:state.modal.data.sub.id, name:data.name.trim()});
    toast(t('toast.subAdded'),'success');
  }
  state.modal=null; render();
}

function importRecordsFile(file){
  if(!file) return;
  readXLSX(file, (err, rows)=>{
    if(err){ toast(t('toast.importFail'),'error'); return; }
    let added=0, skipped=0;
    rows.forEach(row=>{
      const problemId = pick(row, ['Problem ID','ID Code','ID']);
      const mainSystem = pick(row, ['Main System','ระบบหลัก']);
      const testDateRaw = pick(row, ['Test Date','วันที่ทดสอบ','วันที่']);
      if(!mainSystem || !testDateRaw){ skipped++; return; }
      const statusRaw = pick(row, ['Test Status','สถานะการทดสอบ']);
      const statusObj = state.statuses.find(s=> s.label.toLowerCase()===String(statusRaw).toLowerCase() || (s.th && s.th===statusRaw));
      const testerName = pick(row, ['Tester','ผู้ทดสอบ']);
      const testerObj = state.testers.find(x=>x.name.toLowerCase()===String(testerName).toLowerCase());
      const issueTypeRaw = pick(row, ['Issue Type','ประเภทใบแจ้งปัญหา']);
      const itObj = ISSUE_TYPES.find(it=> it.en===issueTypeRaw || it.th===issueTypeRaw) || (/new|เพิ่ม/i.test(issueTypeRaw)? ISSUE_TYPES[1] : /improve|ปรับปรุง/i.test(issueTypeRaw)? ISSUE_TYPES[2] : ISSUE_TYPES[0]);
      const testDate = normalizeDate(testDateRaw);
      const id = problemId || ('QC-'+(new Date(testDate).getFullYear()||new Date().getFullYear())+'-'+pad4(state.nextSeq++));
      if(state.records.some(r=>r.id===id)){ skipped++; return; }

      let sys = findSystemByName(mainSystem);
      if(!sys){ sys = {id:uid('sys'), name:mainSystem, subs:[]}; state.systems.push(sys); }
      const subSystem = pick(row, ['Sub System','ระบบย่อย']);
      if(subSystem && !sys.subs.some(s=>s.name===subSystem)) sys.subs.push({id:uid('sub'), name:subSystem});

      state.records.unshift({
        id, mainSystem, subSystem,
        programName: pick(row, ['Program Name','ชื่อโปรแกรม']),
        version: pick(row, ['Version']),
        issueDescription: pick(row, ['Issue Description','รายละเอียดการแจ้งปัญหา']),
        issueType: itObj.id,
        status: statusObj? statusObj.id : (state.statuses[0]?.id||'pending_test'),
        tester: testerObj? testerObj.id : '',
        testDate,
        responsible: pick(row, ['Responsible','ผู้รับผิดชอบ']),
        relatedApps: pick(row, ['Related Applications','แอปพลิเคชันที่เกี่ยวข้อง']),
        notes: pick(row, ['Notes']), attachments:[], createdAt:Date.now(),
      });
      added++;
    });
    toast(t('toast.importedRecords')(added, skipped), added? 'success':'error');
    render();
  });
}
function normalizeDate(v){
  if(!v) return todayISO();
  if(typeof v==='string' && /^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0,10);
  try{ const d=new Date(v); if(!isNaN(d)) return d.toISOString().slice(0,10); }catch(e){}
  return todayISO();
}
function importTestersFile(file){
  if(!file) return;
  readXLSX(file, (err, rows)=>{
    if(err){ toast(t('toast.importFail'),'error'); return; }
    let added=0, skipped=0;
    rows.forEach(row=>{
      const name = pick(row, ['Tester Name','ผู้ทดสอบ']);
      const username = pick(row, ['Username / Employee ID','Username']);
      if(!name||!username){ skipped++; return; }
      if(state.testers.some(x=>x.username===username)){ skipped++; return; }
      state.testers.push({
        id:'T'+String(state.testers.length+1).padStart(3,'0')+Math.random().toString(36).slice(2,4),
        name, username, email: pick(row,['Email']),
        role: pick(row,['Role']), department: pick(row,['Department']),
        active: !/^no$/i.test(pick(row,['Active'])||'yes'), notes: pick(row,['Notes']),
      });
      added++;
    });
    toast(t('toast.importedTesters')(added, skipped), added?'success':'error');
    render();
  });
}
function importRestoreFile(file){
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e=>{
    try{
      const snap = JSON.parse(e.target.result);
      if(!snap.records || !snap.testers){ toast(t('toast.invalidBackup'),'error'); return; }
      applySnapshot(snap);
      toast(t('toast.backupRestoredFile'),'success');
      render();
    }catch(err){ toast(t('toast.invalidBackup'),'error'); }
  };
  reader.readAsText(file);
}

/* ============================================================
   INIT
   ============================================================ */
function withTimeout(promise, ms){
  return Promise.race([
    promise,
    new Promise((_,reject)=> setTimeout(()=>reject(new Error('timed out after '+ms+'ms')), ms)),
  ]);
}

async function init(){
  state.route = parseHash();
  if(state.route.name==='record-detail'){
    const rec = state.records.find(r=>r.id===state.route.param);
    state.route = {name:'records', param:null};
    if(rec) state.modal = {type:'recordDetail', data:rec};
  }
  document.documentElement.setAttribute('data-theme', state.theme);
  // Phase 1: render immediately with the bundled dataset so there's never a blank screen.
  render();

  function resolveDeepLink(){
    if(state.route.name==='records' && location.hash.startsWith('#/records/') && !state.modal){
      const id = decodeURIComponent(location.hash.replace('#/records/',''));
      const rec = state.records.find(r=>r.id===id);
      if(rec) state.modal = {type:'recordDetail', data:rec};
    }
  }

  // Phase 2: fast local storage (IndexedDB/localStorage) load — establishes theme/lang
  // preference and gives an immediately-usable offline copy of the last known data.
  try{
    const saved = await loadFromStorage();
    state.autosaveActive = storageMode!==null && storageMode!=='none';
    state.storageMode = storageMode;
    if(saved){
      state.records = saved.records || state.records;
      state.testers = saved.testers || state.testers;
      state.statuses = saved.statuses || state.statuses;
      state.systems = saved.systems || state.systems;
      if(saved.theme){ state.theme = saved.theme; document.documentElement.setAttribute('data-theme', state.theme); }
      if(saved.lang) state.lang = saved.lang;
      if(saved.lastBackupAt) state.lastBackupAt = saved.lastBackupAt;
      if(saved.nextSeq) state.nextSeq = saved.nextSeq;
      state.nextSeq = Math.max(state.nextSeq, computeNextSeq(state.records));
    }
  }catch(e){ state.autosaveActive = false; state.storageMode = 'none'; }
  state.syncMode = state.autosaveActive ? 'local' : 'none';
  resolveDeepLink();
  render();

  // Phase 3: connect to Supabase Auth. Signing in (or restoring a session) is what
  // unlocks the shared live database — see loadSharedDataForCurrentSession() and the
  // render() gate, which shows a login screen whenever state.session is empty.
  try{
    supa = initSupabaseClient();
    if(supa){
      let firstAuthSeen = false;
      let resolveFirstAuth;
      const firstAuthPromise = new Promise(res=>{ resolveFirstAuth = res; });
      supa.auth.onAuthStateChange((event, session)=>{
        state.session = session || null;
        if(state.session){
          cleanAuthHashFromUrl();
          state.route = parseHash();
          resolveAccessForSession(state.session);
          loadSharedDataForCurrentSession()
            .then(()=>ensureTesterStubExists(state.session))
            .then(()=>{ resolveDeepLink(); render(); });
        } else {
          state.accessRole = null;
          state.currentTester = null;
          render();
        }
        if(!firstAuthSeen){ firstAuthSeen = true; resolveFirstAuth(); }
      });
      await withTimeout(firstAuthPromise, 6000);
      render();
    }
  }catch(e){
    console.warn('Supabase unreachable — staying on local-only data.', e && e.message);
    supa = null;
    render();
  }
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();

})();
