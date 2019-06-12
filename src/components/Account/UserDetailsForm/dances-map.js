const DANCES = [
  'lindy hop',
  'blues',
  'fuston',
  'balboa',
  'collegiate shag',
  'salsa',
  'bachata',
  'tango',
  'kizomba',
  'bal folk'
];

const defaultDanceState = {
  lead: false,
  follow: false
};

const dances = new Map();
DANCES.sort((a, b) => a > b).forEach(dance => {
  dances.set(dance, defaultDanceState);
});

console.log(dances);

export default dances;
