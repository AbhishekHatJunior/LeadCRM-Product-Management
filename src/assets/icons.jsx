const webIcons = {

  // SIDEBAR ICONS

  adminDashboard: 'https://img.icons8.com/pastel-glyph/64/555B61/webpage-analytics--v1.png',
  companyManagement: 'https://img.icons8.com/ios-filled/100/555B61/company.png',
  report: 'https://img.icons8.com/pastel-glyph/64/555B61/report-card--v1.png',
  dashboard: 'https://img.icons8.com/pastel-glyph/64/555B61/combo-chart--v1.png',
  user: 'https://img.icons8.com/pastel-glyph/64/555B61/user--v1.png',
  products: 'https://img.icons8.com/ios-filled/100/electronics.png',
  

  // BUTTON ICONS

  addUser: "https://img.icons8.com/glyph-neue/64/FFFFFF/add-user-male.png",
  userMng: "https://img.icons8.com/glyph-neue/64/000000/add-user-male.png",
  addCompany: "https://img.icons8.com/ios-glyphs/90/FFFFFF/add-property.png",
  addCategory: "https://img.icons8.com/material-outlined/96/FFFFFF/diversity.png",
  editBtn: "https://img.icons8.com/sf-black-filled/64/3764a0/edit.png",
  delBtn: "https://img.icons8.com/ios-glyphs/30/FA5252/filled-trash.png",
  viewProducts: 'https://img.icons8.com/android/48/FFFFFF/electronics.png',
  addJob: 'https://img.icons8.com/material-sharp/24/FFFFFF/permanent-job.png'
  

};

// Generic WebIcon component with default size 20x20
const Icons8 = ({ name, alt = '', ...props }) => {
  const src = webIcons[name];
  if (!src) return null; // icon not found
  return <img src={src} width={19} height={19} alt={alt || name} {...props} />;
};

// const NoDataIcons = ({ name, alt = '', ...props }) => {
//   const src = webIcons[name];
//   if (!src) return null; // icon not found
//   return <img src={src} width={19} height={19} alt={alt || name} {...props} />;
// };


export {Icons8};