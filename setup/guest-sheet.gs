/**
 * Prashant & Shweta · guest list (Google Sheet + Apps Script)
 *
 * The /send page reads and writes the "Guests" tab of this sheet through this script,
 * and the invitation itself notes when a family opens their personal link.
 *
 * SETUP (once):
 *   1. In the Google Sheet: Extensions → Apps Script. Delete what's there, paste this whole file, Save.
 *   2. Project Settings (gear icon) → Script properties → Add property:
 *        Property: PASSCODE     Value: (the passcode the families will type on /send)
 *   3. Deploy → New deployment → type "Web app"
 *        Execute as: Me        Who has access: Anyone
 *      → Deploy → Authorise access (choose your Google account → Advanced → Go to project → Allow).
 *   4. Copy the "Web app URL" (it ends in /exec) and send it to Claude.
 *
 * If you change this code later: Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy.
 */

const TAB = 'Guests';
const HEAD = ['ID', 'Side', 'Name', 'Greeting', 'Phones', 'City', 'Guests', 'Notes', 'Link',
  'Sent', 'Sent To', 'Sent On', 'Sent By', 'Times Opened', 'First Opened', 'Last Opened', 'Last Song',
  'Added By', 'Added On', 'Updated On'];
const DATE_COLS = ['Sent On', 'First Opened', 'Last Opened', 'Added On', 'Updated On'];

function doGet(e) { return handle_((e && e.parameter) || {}); }
function doPost(e) {
  let p = {};
  try { p = JSON.parse(e.postData.contents); } catch (err) {}
  return handle_(p);
}

function handle_(p) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = sheet_();
    const now = new Date();

    // ---- used by the invitation itself (no passcode): which song to play next, and "opened" ----
    if (p.action === 'peek' || p.action === 'opened') {
      const r = rows_(sh).find((x) => String(x.ID) === String(p.id));
      if (!r) return out_({ ok: false, error: 'not found' });
      if (p.action === 'peek') return out_({ ok: true, lastSong: r['Last Song'] || '', times: Number(r['Times Opened']) || 0 });
      const times = (Number(r['Times Opened']) || 0) + 1;
      set_(sh, r._row, 'Times Opened', times);
      if (!r['First Opened']) set_(sh, r._row, 'First Opened', now);
      set_(sh, r._row, 'Last Opened', now);
      if (p.song) set_(sh, r._row, 'Last Song', String(p.song).slice(0, 60));
      return out_({ ok: true, times: times });
    }

    // ---- everything else needs the passcode ----
    const pass = PropertiesService.getScriptProperties().getProperty('PASSCODE') || '';
    if (!pass || String(p.passcode || '') !== pass) return out_({ ok: false, error: 'passcode' });

    if (p.action === 'list') return out_({ ok: true, rows: rows_(sh) });

    if (p.action === 'save') {
      const g = p.guest || {};
      const r = g.ID ? rows_(sh).find((x) => String(x.ID) === String(g.ID)) : null;
      if (!r) {
        g.ID = g.ID || Utilities.getUuid().replace(/-/g, '').slice(0, 10);
        g['Added On'] = now; g['Updated On'] = now;
        if (g['Times Opened'] === undefined) g['Times Opened'] = 0;
        sh.appendRow(HEAD.map((k) => value_(k, g[k])));
        return out_({ ok: true, id: g.ID });
      }
      HEAD.forEach((k) => { if (k !== 'ID' && k in g) set_(sh, r._row, k, value_(k, g[k])); });
      set_(sh, r._row, 'Updated On', now);
      return out_({ ok: true, id: r.ID });
    }

    if (p.action === 'saveMany') {      // used once, to move an old list from a phone into the sheet
      (p.guests || []).forEach((g) => {
        g.ID = g.ID || Utilities.getUuid().replace(/-/g, '').slice(0, 10);
        g['Added On'] = now; g['Updated On'] = now; g['Times Opened'] = 0;
        sh.appendRow(HEAD.map((k) => value_(k, g[k])));
      });
      return out_({ ok: true });
    }

    if (p.action === 'delete') {
      const r = rows_(sh).find((x) => String(x.ID) === String(p.id));
      if (r) sh.deleteRow(r._row);
      return out_({ ok: true });
    }
    return out_({ ok: false, error: 'unknown action' });
  } finally {
    lock.releaseLock();
  }
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(TAB);
  if (!sh) sh = ss.insertSheet(TAB, 0);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEAD);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEAD.length).setFontWeight('bold').setBackground('#F8E7D3');
    // IDs and phone numbers are text (so +91… and leading zeros are kept)
    ['ID', 'Phones', 'Sent To'].forEach((k) => sh.getRange(2, HEAD.indexOf(k) + 1, sh.getMaxRows() - 1, 1).setNumberFormat('@'));
    DATE_COLS.forEach((k) => sh.getRange(2, HEAD.indexOf(k) + 1, sh.getMaxRows() - 1, 1).setNumberFormat('d mmm yyyy, h:mm am/pm'));
  }
  return sh;
}
function rows_(sh) {
  const v = sh.getDataRange().getValues();
  const h = v.shift() || [];
  return v.map((r, i) => {
    const o = { _row: i + 2 };
    h.forEach((k, j) => { o[k] = r[j] instanceof Date ? r[j].toISOString() : r[j]; });
    return o;
  }).filter((o) => o.ID !== '' && o.ID !== undefined);
}
function value_(k, v) {
  if (v === undefined || v === null) return '';
  if (DATE_COLS.indexOf(k) >= 0 && typeof v === 'string' && v) { const d = new Date(v); return isNaN(d) ? v : d; }
  return v;
}
function set_(sh, row, key, v) { sh.getRange(row, HEAD.indexOf(key) + 1).setValue(v); }
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
