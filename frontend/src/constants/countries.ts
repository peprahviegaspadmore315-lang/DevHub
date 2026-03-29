export const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia (Plurinational State of)",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei Darussalam",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Democratic Republic of the)",
  "Congo (Republic of the)",
  "Costa Rica",
  "Côte d'Ivoire",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Holy See",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran (Islamic Republic of)",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Lao People's Democratic Republic",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia (Federated States of)",
  "Moldova (Republic of)",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine, State of",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russian Federation",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syrian Arab Republic",
  "Tajikistan",
  "Tanzania, United Republic of",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom of Great Britain and Northern Ireland",
  "United States of America",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela (Bolivarian Republic of)",
  "Viet Nam",
  "Yemen",
  "Zambia",
  "Zimbabwe"
].sort()

const countryCodeAliases: Record<string, string> = {
  "Antigua and Barbuda": "AG",
  "Bolivia (Plurinational State of)": "BO",
  "Bosnia and Herzegovina": "BA",
  "Brunei Darussalam": "BN",
  "Cabo Verde": "CV",
  "Congo (Democratic Republic of the)": "CD",
  "Congo (Republic of the)": "CG",
  "Côte d'Ivoire": "CI",
  "Eswatini": "SZ",
  "Holy See": "VA",
  "Iran (Islamic Republic of)": "IR",
  "Lao People's Democratic Republic": "LA",
  "Micronesia (Federated States of)": "FM",
  "Moldova (Republic of)": "MD",
  "Myanmar": "MM",
  "Palestine, State of": "PS",
  "Russian Federation": "RU",
  "Sao Tome and Principe": "ST",
  "Syrian Arab Republic": "SY",
  "Tanzania, United Republic of": "TZ",
  "Timor-Leste": "TL",
  "Trinidad and Tobago": "TT",
  "United Kingdom of Great Britain and Northern Ireland": "GB",
  "United States of America": "US",
  "Venezuela (Bolivarian Republic of)": "VE",
  "Viet Nam": "VN",
}

const normalizeCountryName = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .toLowerCase()

const buildRegionCodeLookup = () => {
  if (typeof Intl === 'undefined' || typeof Intl.DisplayNames === 'undefined') {
    return {} as Record<string, string>
  }

  const displayNames = new Intl.DisplayNames(['en'], { type: 'region' })
  const lookup: Record<string, string> = {}

  for (let first = 65; first <= 90; first += 1) {
    for (let second = 65; second <= 90; second += 1) {
      const code = String.fromCharCode(first) + String.fromCharCode(second)

      try {
        const name = displayNames.of(code)

        if (name && name !== code) {
          lookup[normalizeCountryName(name)] = code
        }
      } catch {
        // Ignore invalid region codes and continue building the lookup.
      }
    }
  }

  return lookup
}

const regionCodeLookup = buildRegionCodeLookup()

const countryCodeToFlag = (countryCode: string) =>
  countryCode
    .toUpperCase()
    .replace(/./g, (character) =>
      String.fromCodePoint(127397 + character.charCodeAt(0))
    )

export const getCountryCode = (countryName: string) =>
  countryCodeAliases[countryName] ??
  regionCodeLookup[normalizeCountryName(countryName)] ??
  null

export const getCountryFlag = (countryName: string) => {
  const countryCode = getCountryCode(countryName)
  return countryCode ? countryCodeToFlag(countryCode) : '🌍'
}

export interface CountryOption {
  code: string
  flag: string
  name: string
}

export const countryOptions: CountryOption[] = countries.map((countryName) => {
  const countryCode = getCountryCode(countryName)

  return {
    code:
      countryCode ??
      countryName
        .slice(0, 2)
        .toUpperCase(),
    flag: getCountryFlag(countryName),
    name: countryName,
  }
})
