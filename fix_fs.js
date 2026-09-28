const fs = require('fs');

let code = fs.readFileSync('server.js', 'utf8');

// Hakikisha fs imetajwa mwanzoni mwa loadData
if (!code.includes("const fs = require('fs');")) {
    code = "const fs = require('fs');\n" + code;
} else {
    // Kama tayari ipo lakini imekaa vibaya, tuweke juu kabisa
    code = code.replace("const fs = require('fs');", "");
    code = "const fs = require('fs');\n" + code;
}

fs.writeFileSync('server.js', code);
console.log('Faili la server.js limerekebishwa kikamilifu!');
