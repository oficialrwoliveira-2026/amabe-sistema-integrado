import fs from 'fs';

const path = 'e:/SISTEMAS/AMABE/amabe---sistema-integrado-de-gestão/AMABE2/components/MemberDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

// The most direct replacement possible
const search = 'onLoadFullProfile\n}) => {';
const replace = 'onLoadFullProfile, isLoadingPartners\n}) => {';

if (content.includes(search)) {
    content = content.replace(search, replace);
    console.log("Success with exact match");
} else {
    console.log("Exact match failed, trying simple search");
    content = content.replace('onLoadFullProfile', 'onLoadFullProfile, isLoadingPartners');
}

fs.writeFileSync(path, content);
