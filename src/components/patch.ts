import * as fs from 'fs';

const p = 'src/components/OfferToMarketplace.tsx';
let content = fs.readFileSync(p, 'utf-8');

const matchIndex = content.indexOf('{/* Manual Match Modal */}');
if (matchIndex > -1) {
  content = content.substring(0, matchIndex) + '    </div>\n  );\n}\n';
  fs.writeFileSync(p, content);
  console.log('Modals removed');
}
