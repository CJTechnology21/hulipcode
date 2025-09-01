// src/utils/getLabel.js
export const toId = (val) => {
  if (!val) return null;
  if (val._id && val._id.$oid) return val._id.$oid; // nested _id.$oid
  if (val.$oid) return val.$oid; // direct $oid
  if (val._id) return val._id; // plain object with _id
  if (val.id) return val.id; // sometimes id instead of _id
  if (val.value) return val.value; // sometimes comes as value
  return val; // already string
};

export const getLabel = (arr, idOrObj) => {
  if (!arr || arr.length === 0 || !idOrObj) {
    return "—";
  }

  const id = String(toId(idOrObj));
  const item = arr.find(
    (i) => String(toId(i._id) || toId(i.id) || i.value) === id
  );

  if (!item) {
    return "—";
  }

  // Flexible fallback for display
  return (
    item.name ||  // Party.name or Vendor.name
    item.type ||  // Party.type (Client, Vendor, Contractor, Miss)
    item.label || // generic label
    "—"
  );
};

// // src/utils/getLabel.js
// export const toId = (val) => {
//   if (!val) return null;
//   if (val._id && val._id.$oid) return val._id.$oid; // nested _id.$oid
//   if (val.$oid) return val.$oid; // direct $oid
//   if (val._id) return val._id; // plain object with _id
//   if (val.id) return val.id; // sometimes id instead of _id
//   if (val.value) return val.value; // sometimes comes as value
//   return val; // already string
// };

// export const getLabel = (arr, idOrObj) => {
//   if (!arr || arr.length === 0 || !idOrObj) {
//     return "—";
//   }

//   const id = String(toId(idOrObj));
//   const item = arr.find(
//     (i) => String(toId(i._id) || toId(i.id) || i.value) === id
//   );

//   if (!item) {
//     console.warn("No match found in getLabel", {
//       lookingFor: id,
//       candidates: arr.map((i) => ({
//         id: toId(i._id) || toId(i.id) || i.value,
//         name: i.name,
//         type: i.type,
//         label: i.label,
//       })),
//     });
//     return "—";
//   }

//   console.log(" Match found in getLabel:", {
//     lookingFor: id,
//     matched: {
//       id: toId(item._id) || toId(item.id) || item.value,
//       name: item.name,
//       type: item.type,
//       label: item.label,
//     },
//   });

//   // Flexible fallback for display
//   return (
//     item.name ||  // Party.name or Vendor.name
//     item.type ||  // Party.type (Client, Vendor, Contractor, Miss)
//     item.label || // generic label
//     "—"
//   );
// };

