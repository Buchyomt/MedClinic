const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.jsx') || file.endsWith('.js')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('c:/Users/user/OneDrive/Desktop/Medclinic/client/src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  
  newContent = newContent.replace(/\[#1d4ed8\]/g, 'primary');
  newContent = newContent.replace(/\[#1e40af\]/g, 'primary-dark');
  newContent = newContent.replace(/\[#dcfce7\]/g, 'accent-light');
  newContent = newContent.replace(/min-w-\[1px\]/g, 'min-w-px');
  newContent = newContent.replace(/bg-gradient-to-r/g, 'bg-linear-to-r');
  
  // Specific fixes
  if (file.endsWith('Success.jsx')) {
    newContent = newContent.replace(/text-\[#059669\] text-white/g, 'text-white');
    newContent = newContent.replace(/text-white text-\[#059669\]/g, 'text-white');
  }
  if (file.endsWith('BookingForm.jsx')) {
    newContent = newContent.replace(/block flex/g, 'flex');
    newContent = newContent.replace(/flex block/g, 'flex');
    newContent = newContent.replace(/block hidden md:flex/g, 'hidden md:flex');
  }
  
  if (newContent !== content) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated', file);
  }
});
