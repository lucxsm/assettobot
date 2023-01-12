const COUNTRY_MAPPING = {
    'us': {flag: ':flag_us:', name: 'United States'},
    'ca': {flag: ':flag_ca:', name: 'Canada'},
    'ch': {flag: ':flag_ch:', name: 'Switzerland'},
    'br': {flag: ':flag_br:', name: 'Brazil'},
    'de': {flag: ':flag_de:', name: 'Germany'},
    'se': {flag: ':flag_se:', name: 'Sweden'},
    'fr': {flag: ':flag_fr:', name: 'France'},
    'it': {flag: ':flag_it:', name: 'Italy'},
    'es': {flag: ':flag_es:', name: 'Spain'},
    'pl': {flag: ':flag_pl:', name: 'Poland'},
    'sg': {flag: ':flag_sg:', name: 'Singapore'},
    'gb': {flag: ':flag_gb:', name: 'United Kingdom'},
    'nl': {flag: ':flag_nl:', name: 'Netherlands'},
    'au': {flag: ':flag_au:', name: 'Australia'},
    'tr': {flag: ':flag_tr:', name: 'Turkey'},
    'jp': {flag: ':flag_jp:', name: 'Japan'}
}

const getCountry = (countryKey) => COUNTRY_MAPPING[countryKey.toLowerCase()]

module.exports = {
    getCountry
}
