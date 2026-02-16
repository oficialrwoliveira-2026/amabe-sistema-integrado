import fs from 'fs';

const path = 'e:/SISTEMAS/AMABE/amabe---sistema-integrado-de-gestão/AMABE2/components/MemberDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

// Target the component signature specifically
if (!content.includes('isLoadingPartners')) {
    // This is the sequence I observed in the view_file output
    const searchStr = '   showAlert, showConfirm, onLoadFullProfile\n}) => {';
    const replaceStr = '   showAlert, showConfirm, onLoadFullProfile, isLoadingPartners\n}) => {';

    if (content.includes(searchStr)) {
        content = content.replace(searchStr, replaceStr);
        console.log("Component signature updated!");
    } else {
        console.error("Could not find the signature block.");
        // Try fallback with different line endings or spaces
        const altSearch = '   showAlert, showConfirm, onLoadFullProfile }) => {';
        if (content.includes(altSearch)) {
            content = content.replace(altSearch, '   showAlert, showConfirm, onLoadFullProfile, isLoadingPartners }) => {');
            console.log("Component signature updated (alt)!");
        }
    }
}

fs.writeFileSync(path, content);
