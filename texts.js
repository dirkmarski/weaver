// Texts: naming of cells, boxes and lists in player messages.

// "the box of rows R1-R2 and columns C1-C2" for box b (0-8).
// dash: the character between the range numbers ('-' by default; the own pointing and claiming rewards pass U+2011).
function boxName(b, dash) {
  var r = 3 * Math.floor(b / 3), c = 3 * (b % 3), h = dash || '-';
  return 'the box of rows ' + (r + 1) + h + (r + 3) + ' and columns ' + (c + 1) + h + (c + 3);
}

// "1, 2 and 3" for a list of numbers.
function andList(n) { return n.length > 1 ? n.slice(0, -1).join(', ') + ' and ' + n[n.length - 1] : String(n[0]); }

// The struck cells (flat indices, ascending) by name: "row R, column C"; in one row "row N, columns A, B and C"; in one
// column "column N, rows A and B"; else grouped per row, joined by "; ".
function struckCells(removed) {
  var rows = [], cols = [];
  removed.forEach(function (q) { if (rows.indexOf(Math.floor(q / 9)) < 0) rows.push(Math.floor(q / 9)); if (cols.indexOf(q % 9) < 0) cols.push(q % 9); });
  function nums(a) { return a.map(function (x) { return x + 1; }); }
  if (cols.length === 1 && rows.length > 1) return 'column ' + (cols[0] + 1) + ', rows ' + andList(nums(rows));
  return rows.map(function (r) {
    var c = nums(removed.filter(function (q) { return Math.floor(q / 9) === r; }).map(function (q) { return q % 9; }));
    return 'row ' + (r + 1) + ', column' + (c.length > 1 ? 's ' : ' ') + andList(c);
  }).join('; ');
}

// 'an 8' or 'a D'.
function aDigit(d) { return (d === 8 ? 'an ' : 'a ') + d; }

export { boxName, andList, struckCells, aDigit };
