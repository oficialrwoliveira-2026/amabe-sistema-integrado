import fs from 'fs';

const path = 'e:/SISTEMAS/AMABE/amabe---sistema-integrado-de-gestão/AMABE2/components/MemberDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Fix the corrupted interface line
content = content.replace('onLoadFullProfile, isLoadingPartners?: (userId: string) => Promise<any>;', 'onLoadFullProfile?: (userId: string) => Promise<any>;');

// 2. Correctly add isLoadingPartners to the component arguments
// The previous log showed line 35 as: "   showAlert, showConfirm, onLoadFullProfile" followed by "}) => {"
const signatureMatch = '   showAlert, showConfirm, onLoadFullProfile\r?\n}\\) => \\{';
const regex = new RegExp(signatureMatch, 's');

if (regex.test(content)) {
    content = content.replace(regex, '   showAlert, showConfirm, onLoadFullProfile, isLoadingPartners\n}) => {');
    console.log("Success: Component signature updated correctly!");
} else {
    console.log("Regex failed, trying literal match with standard spacing");
    const literalSearch = '   showAlert, showConfirm, onLoadFullProfile\n}) => {';
    if (content.includes(literalSearch)) {
        content = content.replace(literalSearch, '   showAlert, showConfirm, onLoadFullProfile, isLoadingPartners\n}) => {');
        console.log("Success: Component signature updated (literal)!");
    } else {
        // Last resort: find the block and inject
        console.log("Still failing. Searching for the unique props block...");
        const propsBlock = 'onRegisterNewsView,\n   showAlert, showConfirm, onLoadFullProfile';
        if (content.includes(propsBlock)) {
            content = content.replace(propsBlock, 'onRegisterNewsView,\n   showAlert, showConfirm, onLoadFullProfile, isLoadingPartners');
            console.log("Success: Component signature updated (props block)!");
        }
    }
}

fs.writeFileSync(path, content);
