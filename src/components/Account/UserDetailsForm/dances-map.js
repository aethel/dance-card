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
]

const defaultDanceState = {
    lead: false,
    follow: false
}

const dances = new Map();
DANCES.forEach(dance => {
    dances.set(dance, defaultDanceState)
})

export default dances;