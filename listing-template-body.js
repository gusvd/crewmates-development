
var Webflow = Webflow || [];
Webflow.push(function() {

    ////////////////////////////////////////
    // GET VARIABLES FROM SCRIPT TAG
    ////////////////////////////////////////

    var script_tag = document.getElementById('create-listing-body');
    var CMStitle = script_tag.getAttribute("CMStitle");
    var CMSdescription = script_tag.getAttribute("CMSdescription");
    var CMSlistingImage = script_tag.getAttribute("CMSlistingImage");
    var CMSdepartureLocation = script_tag.getAttribute("CMSdepartureLocation");
    var CMSdestination = script_tag.getAttribute("CMSdestination");
    var CMScategory = script_tag.getAttribute("CMScategory");
    var CMSlanguageOnboard = script_tag.getAttribute("CMSlanguageOnboard");
    var CMSexpensesCurrency = script_tag.getAttribute("CMSexpensesCurrency");
    var CMSexpensesOnboard = script_tag.getAttribute("CMSexpensesOnboard");
    var CMSboatName = script_tag.getAttribute("CMSboatName");
    var CMSboatModel = script_tag.getAttribute("CMSboatModel");
    var CMSboatSize = script_tag.getAttribute("CMSboatSize");
    var CMSboatHullType = script_tag.getAttribute("CMSboatHullType");
    var CMSboatBuiltYear = script_tag.getAttribute("CMSboatBuiltYear");
    var CMSboatBerths = script_tag.getAttribute("CMSboatBerths");
    var CMSboatDescription = script_tag.getAttribute("CMSboatDescription");
    var CMSwebflowListingId = script_tag.getAttribute("CMSwebflowListingId");
    var CMSexpensesCommute = script_tag.getAttribute("CMSexpensesCommute");
    var CMSdepartureDate = script_tag.getAttribute("CMSdepartureDate");
    var CMSmemberstackID = script_tag.getAttribute("CMSmemberstackID");
    var CMSlocationGroup = script_tag.getAttribute("CMSlocationGroup");
    var CMSdepartureCountry = script_tag.getAttribute("CMSdepartureCountry");
    var CMSlatLng = script_tag.getAttribute("CMSlatLng");
    var CMSuploadcareURL = script_tag.getAttribute("CMSuploadcareURL");



    ////////////////////////////////////////
    // EDIT OR VIEW MODE - HIDE/SHOW RELEVANT SECTION
    ////////////////////////////////////////

    // Grab query string
    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return (false);
    }

    ////////////////////////////////////////
    // Check querystring to see if it's an edit request

    if (getQueryVariable('managelisting')) {

        // Grab Memberstack User Id
        MemberStack.onReady.then(function(member) {
            if (member.loggedIn) {
                LoggedUserID = member.id
            } else {
                LoggedUserID =  null;
            };
   
            ////////////////////////////////////////
            // Check if the logged in user (memberstacl ID) is the listing owner (memberstack-id from CMS)

            if (LoggedUserID == CMSmemberstackID) {

                // Show/hide relevant section
                $('#view-listing-section').hide();
                $('#edit-listing-section').show();

                // Add date picker to form field
                var picker = new Pikaday({
                    field: document.getElementById('departure-date'),
                    format: 'DD/MM/YYYY',
                    minDate: moment().toDate()
                });

                ////////////////////////////////////////
                // PARSLEY MULTI-STEP FORM
                $(function() {
                    var $sections = $('.form-section');

                    function navigateTo(index) {
                        // Mark the current section with the class 'current'
                        $sections
                            .removeClass('current')
                            .eq(index)
                            .addClass('current');
                        // Show only the navigation buttons that make sense for the current section:
                        $('.form-navigation .previous').toggle(index > 0);
                        var atTheEnd = index >= $sections.length - 1;
                        $('.form-navigation .next').toggle(!atTheEnd);
                        $('.form-navigation [type=submit]').toggle(atTheEnd);
                    }

                    function curIndex() {
                        // Return the current index by looking at which section has the class 'current'
                        return $sections.index($sections.filter('.current'));
                    }

                    // Previous button is easy, just go back
                    $('.form-navigation .previous').click(function() {
                        navigateTo(curIndex() - 1);
                    });

                    // Next button goes forward iff current block validates
                    $('.form-navigation .next').click(function() {
                        $('.multi-step-form').parsley().whenValidate({
                            group: 'block-' + curIndex()
                        }).done(function() {
                            navigateTo(curIndex() + 1);
                        });
                    });

                    // Prepare sections by setting the `data-parsley-group` attribute to 'block-0', 'block-1', etc.
                    $sections.each(function(index, section) {
                        $(section).find(':input').attr('data-parsley-group', 'block-' + index);
                    });
                    navigateTo(0); // Start at the beginning
                });

                ////////////////////////////////////////
                // PREFILL FORM WITH CMS ITEMS FOR EDITING
                ////////////////////////////////////////

                // Function to unescape special characters to be displayed on form fields
                function htmlDecode(input) {
                    var doc = new DOMParser().parseFromString(input, "text/html");
                    return doc.documentElement.textContent;
                }

                // Pre-fill expenses filed with 0.00just in case
                document.getElementById('expenses-onboard').value = "0.00";

                // Pre-fill form
                document.getElementById('title').value = htmlDecode(CMStitle);
                document.getElementById('description').value = htmlDecode(CMSdescription);
                document.getElementById('listing-image').value = CMSuploadcareURL;
                document.getElementById('departure-location').value = CMSdepartureLocation;
                document.getElementById('departure-country').value = CMSdepartureCountry;
                document.getElementById('destination').value = htmlDecode(CMSdestination);
                document.getElementById('category').value = CMScategory;
                document.getElementById('language-onboard').value = CMSlanguageOnboard;
                document.getElementById('expenses-currency').value = CMSexpensesCurrency;
                document.getElementById('expenses-onboard').value = CMSexpensesOnboard;
                document.getElementById('boat-name').value = htmlDecode(CMSboatName);
                document.getElementById('boat-model').value = htmlDecode(CMSboatModel);
                document.getElementById('boat-size').value = CMSboatSize;
                document.getElementById('boat-hull-type').value = CMSboatHullType;
                document.getElementById('boat-built-year').value = CMSboatBuiltYear;
                document.getElementById('boat-berths').value = CMSboatBerths;
                document.getElementById('boat-description').value = htmlDecode(CMSboatDescription);

                
                 // Fill hidden fields
                document.getElementById('memberstack-id').value = LoggedUserID;
                document.getElementById('webflow-listing-id').value = CMSwebflowListingId;

                document.getElementById('location-group').value = CMSlocationGroup;
                document.getElementById('latlng').value = CMSlatLng;
                document.getElementById('departure-country').value = CMSdepartureCountry;
                                    
                // Fill form-name hidden field to tell Inegromat this form is to update listing
                document.getElementById('form-name').value = 'update-listing';
                
                
                // Expenses commute radio buttons
                if (CMSexpensesCommute == 'Skipper') {
                    document.getElementById('expenses-commute-skipper').checked = true;
                } else {
                    document.getElementById('expenses-commute-crew').checked = true;
                }

                // Convert date format add to date field
                var msec = Date.parse(CMSdepartureDate);
                var d = new Date(msec);
                var curr_date = ("0" + (d.getDate())).slice(-2) // Add 0 if the day has single digit.
                var curr_month = ("0" + (d.getMonth() + 1)).slice(-2) // Months are zero based - add 0 if the month has single digit
                var curr_year = d.getFullYear();
                let formatted_date = curr_date + "/" + curr_month + "/" + curr_year
                document.getElementById('departure-date').value = formatted_date;
             }
        });
    }

});

////////////////////////////////////////////////////////////
// GOOGLE MAPS AUTO COMPLETE
var placeSearch, autocomplete;
var continentsTable = { //see https://gist.github.com/nobuti/3816985
  "AF": "Asia", // "Islamic Republic of Afghanistan") 
  "AX": "Europe", // "Åland Islands") 
  "AL": "Europe", // "Republic of Albania") 
  "DZ": "Africa", // "People's Democratic Republic of Algeria") 
  "AS": "Oceania", // "American Samoa") 
  "AD": "Europe", // "Principality of Andorra") 
  "AO": "Africa", // "Republic of Angola") 
  "AI": "North America", // "Anguilla") 
  "AQ": "Antarctica", // "Antarctica (the territory South of 60 deg S)") 
  "AG": "North America", // "Antigua and Barbuda") 
  "AR": "South America", // "Argentine Republic") 
  "AM": "Asia", // "Republic of Armenia") 
  "AW": "North America", // "Aruba") 
  "AU": "Oceania", // "Commonwealth of Australia") 
  "AT": "Europe", // "Republic of Austria") 
  "AZ": "Asia", // "Republic of Azerbaijan") 
  "BS": "North America", // "Commonwealth of the Bahamas") 
  "BH": "Asia", // "Kingdom of Bahrain") 
  "BD": "Asia", // "People's Republic of Bangladesh") 
  "BB": "North America", // "Barbados") 
  "BY": "Europe", // "Republic of Belarus") 
  "BE": "Europe", // "Kingdom of Belgium") 
  "BZ": "North America", // "Belize") 
  "BJ": "Africa", // "Republic of Benin") 
  "BM": "North America", // "Bermuda") 
  "BT": "Asia", // "Kingdom of Bhutan") 
  "BO": "South America", // "Plurinational State of Bolivia") 
  "BQ": "North America", // '535' 
  "BA": "Europe", // "Bosnia and Herzegovina") 
  "BW": "Africa", // "Republic of Botswana") 
  "BV": "Antarctica", // "Bouvet Island (Bouvetoya)") 
  "BR": "South America", // "Federative Republic of Brazil") 
  "IO": "Asia", // "British Indian Ocean Territory (Chagos Archipelago)") 
  "VG": "North America", // "British Virgin Islands") 
  "BN": "Asia", // "Brunei Darussalam") 
  "BG": "Europe", // "Republic of Bulgaria") 
  "BF": "Africa", // "Burkina Faso") 
  "BI": "Africa", // "Republic of Burundi") 
  "KH": "Asia", // "Kingdom of Cambodia") 
  "CM": "Africa", // "Republic of Cameroon") 
  "CA": "North America", // "Canada") 
  "CV": "Africa", // "Republic of Cape Verde") 
  "KY": "North America", // "Cayman Islands") 
  "CF": "Africa", // "Central African Republic") 
  "TD": "Africa", // "Republic of Chad") 
  "CL": "South America", // "Republic of Chile") 
  "CN": "Asia", // "People's Republic of China") 
  "CX": "Asia", // "Christmas Island") 
  "CC": "Asia", // "Cocos (Keeling) Islands") 
  "CO": "South America", // "Republic of Colombia") 
  "KM": "Africa", // "Union of the Comoros") 
  "CD": "Africa", // "Democratic Republic of the Congo") 
  "CG": "Africa", // "Republic of the Congo") 
  "CK": "Oceania", // "Cook Islands") 
  "CR": "North America", // "Republic of Costa Rica") 
  "CI": "Africa", // "Republic of Cote d'Ivoire") 
  "HR": "Europe", // "Republic of Croatia") 
  "CU": "North America", // "Republic of Cuba") 
  "CW": "North America", // "Curaçao") 
  "CY": "Asia", // "Republic of Cyprus") 
  "CZ": "Europe", // "Czech Republic") 
  "DK": "Europe", // "Kingdom of Denmark") 
  "DJ": "Africa", // "Republic of Djibouti") 
  "DM": "North America", // "Commonwealth of Dominica") 
  "DO": "North America", // "Dominican Republic") 
  "EC": "South America", // "Republic of Ecuador") 
  "EG": "Africa", // "Arab Republic of Egypt") 
  "SV": "North America", // "Republic of El Salvador") 
  "GQ": "Africa", // "Republic of Equatorial Guinea") 
  "ER": "Africa", // "State of Eritrea") 
  "EE": "Europe", // "Republic of Estonia") 
  "ET": "Africa", // "Federal Democratic Republic of Ethiopia") 
  "FO": "Europe", // "Faroe Islands") 
  "FK": "South America", // "Falkland Islands (Malvinas)") 
  "FJ": "Oceania", // "Republic of Fiji") 
  "FI": "Europe", // "Republic of Finland") 
  "FR": "Europe", // "French Republic") 
  "GF": "South America", // "French Guiana") 
  "PF": "Oceania", // "French Polynesia") 
  "TF": "Antarctica", // "French Southern Territories") 
  "GA": "Africa", // "Gabonese Republic") 
  "GM": "Africa", // "Republic of the Gambia") 
  "GE": "Asia", // "Georgia") 
  "DE": "Europe", // "Federal Republic of Germany") 
  "GH": "Africa", // "Republic of Ghana") 
  "GI": "Europe", // "Gibraltar") 
  "GR": ["Europe", "Mediterranean"], // "Hellenic Republic Greece") 
  "GL": "North America", // "Greenland") 
  "GD": "North America", // "Grenada") 
  "GP": "North America", // "Guadeloupe") 
  "GU": "Oceania", // "Guam") 
  "GT": "North America", // "Republic of Guatemala") 
  "GG": "Europe", // "Bailiwick of Guernsey") 
  "GN": "Africa", // "Republic of Guinea") 
  "GW": "Africa", // "Republic of Guinea-Bissau") 
  "GY": "South America", // "Co-operative Republic of Guyana") 
  "HT": "North America", // "Republic of Haiti") 
  "HM": "Antarctica", // "Heard Island and McDonald Islands") 
  "VA": "Europe", // "Holy See (Vatican City State)") 
  "HN": "North America", // "Republic of Honduras") 
  "HK": "Asia", // "Hong Kong Special Administrative Region of China") 
  "HU": "Europe", // "Hungary") 
  "IS": "Europe", // "Republic of Iceland") 
  "IN": "Asia", // "Republic of India") 
  "ID": "Asia", // "Republic of Indonesia") 
  "IR": "Asia", // "Islamic Republic of Iran") 
  "IQ": "Asia", // "Republic of Iraq") 
  "IE": "Europe", // "Ireland") 
  "IM": "Europe", // "Isle of Man") 
  "IL": "Asia", // "State of Israel") 
  "IT": "Europe", // "Italian Republic") 
  "JM": "North America", // "Jamaica") 
  "JP": "Asia", // "Japan") 
  "JE": "Europe", // "Bailiwick of Jersey") 
  "JO": "Asia", // "Hashemite Kingdom of Jordan") 
  "KZ": "Asia", // "Republic of Kazakhstan") 
  "KE": "Africa", // "Republic of Kenya") 
  "KI": "Oceania", // "Republic of Kiribati") 
  "KP": "Asia", // "Democratic People's Republic of Korea") 
  "KR": "Asia", // "Republic of Korea") 
  "KW": "Asia", // "State of Kuwait") 
  "KG": "Asia", // "Kyrgyz Republic") 
  "LA": "Asia", // "Lao People's Democratic Republic") 
  "LV": "Europe", // "Republic of Latvia") 
  "LB": "Asia", // "Lebanese Republic") 
  "LS": "Africa", // "Kingdom of Lesotho") 
  "LR": "Africa", // "Republic of Liberia") 
  "LY": "Africa", // "Libya") 
  "LI": "Europe", // "Principality of Liechtenstein") 
  "LT": "Europe", // "Republic of Lithuania") 
  "LU": "Europe", // "Grand Duchy of Luxembourg") 
  "MO": "Asia", // "Macao Special Administrative Region of China") 
  "MK": "Europe", // "Republic of Macedonia") 
  "MG": "Africa", // "Republic of Madagascar") 
  "MW": "Africa", // "Republic of Malawi") 
  "MY": "Asia", // "Malaysia") 
  "MV": "Asia", // "Republic of Maldives") 
  "ML": "Africa", // "Republic of Mali") 
  "MT": "Europe", // "Republic of Malta") 
  "MH": "Oceania", // "Republic of the Marshall Islands") 
  "MQ": "North America", // "Martinique") 
  "MR": "Africa", // "Islamic Republic of Mauritania") 
  "MU": "Africa", // "Republic of Mauritius") 
  "YT": "Africa", // "Mayotte") 
  "MX": "North America", // "United Mexican States") 
  "FM": "Oceania", // "Federated States of Micronesia") 
  "MD": "Europe", // "Republic of Moldova") 
  "MC": "Europe", // "Principality of Monaco") 
  "MN": "Asia", // "Mongolia") 
  "ME": "Europe", // "Montenegro") 
  "MS": "North America", // "Montserrat") 
  "MA": "Africa", // "Kingdom of Morocco") 
  "MZ": "Africa", // "Republic of Mozambique") 
  "MM": "Asia", // "Republic of the Union of Myanmar") 
  "NA": "Africa", // "Republic of Namibia") 
  "NR": "Oceania", // "Republic of Nauru") 
  "NP": "Asia", // "Federal Democratic Republic of Nepal") 
  "NL": "Europe", // "Kingdom of the Netherlands") 
  "NC": "Oceania", // "New Caledonia") 
  "NZ": "Oceania", // "New Zealand") 
  "NI": "North America", // "Republic of Nicaragua") 
  "NE": "Africa", // "Republic of Niger") 
  "NG": "Africa", // "Federal Republic of Nigeria") 
  "NU": "Oceania", // "Niue") 
  "NF": "Oceania", // "Norfolk Island") 
  "MP": "Oceania", // "Commonwealth of the Northern Mariana Islands") 
  "NO": "Europe", // "Kingdom of Norway") 
  "OM": "Asia", // "Sultanate of Oman") 
  "PK": "Asia", // "Islamic Republic of Pakistan") 
  "PW": "Oceania", // "Republic of Palau") 
  "PS": "Asia", // "Occupied Palestinian Territory") 
  "PA": "North America", // "Republic of Panama") 
  "PG": "Oceania", // "Independent State of Papua New Guinea") 
  "PY": "South America", // "Republic of Paraguay") 
  "PE": "South America", // "Republic of Peru") 
  "PH": "Asia", // "Republic of the Philippines") 
  "PN": "Oceania", // "Pitcairn Islands") 
  "PL": "Europe", // "Republic of Poland") 
  "PT": "Europe", // "Portuguese Republic") 
  "PR": "North America", // "Commonwealth of Puerto Rico") 
  "QA": "Asia", // "State of Qatar") 
  "RE": "Africa", // "Réunion") 
  "RO": "Europe", // "Romania") 
  "RU": "Europe", // "Russian Federation") 
  "RW": "Africa", // "Republic of Rwanda") 
  "BL": "North America", // "Saint Barthélemy") 
  "SH": "Africa", // '654' 
  "KN": "North America", // "Federation of Saint Kitts and Nevis") 
  "LC": "North America", // "Saint Lucia") 
  "MF": "North America", // "Saint Martin (French part)") 
  "PM": "North America", // "Saint Pierre and Miquelon") 
  "VC": "North America", // "Saint Vincent and the Grenadines") 
  "WS": "Oceania", // "Independent State of Samoa") 
  "SM": "Europe", // "Republic of San Marino") 
  "ST": "Africa", // "Democratic Republic of Sao Tome and Principe") 
  "SA": "Asia", // "Kingdom of Saudi Arabia") 
  "SN": "Africa", // "Republic of Senegal") 
  "RS": "Europe", // "Republic of Serbia") 
  "SC": "Africa", // "Republic of Seychelles") 
  "SL": "Africa", // "Republic of Sierra Leone") 
  "SG": "Asia", // "Republic of Singapore") 
  "SX": "North America", // "Sint Maarten (Dutch part)") 
  "SK": "Europe", // "Slovakia (Slovak Republic)") 
  "SI": "Europe", // "Republic of Slovenia") 
  "SB": "Oceania", // "Solomon Islands") 
  "SO": "Africa", // "Somali Republic") 
  "ZA": "Africa", // "Republic of South Africa") 
  "GS": "Antarctica", // "South Georgia and the South Sandwich Islands") 
  "SS": "Africa", // "Republic of South Sudan") 
  "ES": "Europe", // "Kingdom of Spain") 
  "LK": "Asia", // "Democratic Socialist Republic of Sri Lanka") 
  "SD": "Africa", // "Republic of Sudan") 
  "SR": "South America", // "Republic of Suriname") 
  "SJ": "Europe", // "Svalbard & Jan Mayen Islands") 
  "SZ": "Africa", // "Kingdom of Swaziland") 
  "SE": "Europe", // "Kingdom of Sweden") 
  "CH": "Europe", // "Swiss Confederation") 
  "SY": "Asia", // "Syrian Arab Republic") 
  "TW": "Asia", // "Taiwan 
  "TJ": "Asia", // "Republic of Tajikistan") 
  "TZ": "Africa", // "United Republic of Tanzania") 
  "TH": "Asia", // "Kingdom of Thailand") 
  "TL": "Asia", // "Democratic Republic of Timor-Leste") 
  "TG": "Africa", // "Togolese Republic") 
  "TK": "Oceania", // "Tokelau") 
  "TO": "Oceania", // "Kingdom of Tonga") 
  "TT": "North America", // "Republic of Trinidad and Tobago") 
  "TN": "Africa", // "Tunisian Republic") 
  "TR": "Asia", // "Republic of Turkey") 
  "TM": "Asia", // "Turkmenistan") 
  "TC": "North America", // "Turks and Caicos Islands") 
  "TV": "Oceania", // "Tuvalu") 
  "UG": "Africa", // "Republic of Uganda") 
  "UA": "Europe", // "Ukraine") 
  "AE": "Asia", // "United Arab Emirates") 
  "GB": "Europe", // "United Kingdom of Great Britain & Northern Ireland") 
  "US": "North America", // "United States of America") 
  "UM": "Oceania", // "United States Minor Outlying Islands") 
  "VI": "North America", // "United States Virgin Islands") 
  "UY": "South America", // "Eastern Republic of Uruguay") 
  "UZ": "Asia", // "Republic of Uzbekistan") 
  "VU": "Oceania", // "Republic of Vanuatu") 
  "VE": "South America", // "Bolivarian Republic of Venezuela") 
  "VN": "Asia", // "Socialist Republic of Vietnam") 
  "WF": "Oceania", // "Wallis and Futuna") 
  "EH": "Africa", // "Western Sahara") 
  "YE": "Asia", // "Yemen") 
  "ZM": "Africa", // "Republic of Zambia") 
  "ZW": "Africa" // "Republic of Zimbabwe"); 
};

function initAutocomplete() {
    // Create the autocomplete object, restricting the search predictions to
    // geographical location types.

    var input = document.getElementById('departure-location');

    var options = {
        // fields: ["ALL"]
        // fields: ["address_components", "place_id"]
        fields: ["address_components", "geometry"]
    };

    autocomplete = new google.maps.places.Autocomplete(input, options);


    // // Avoid paying for data that you don't need by restricting the set of
    // // place fields that are returned to just the address components.
    // autocomplete.setFields(['address_components'],);

    // When the user selects an address from the drop-down, populate the hidden fields
    autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress (){
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();

    // Get Country
    var filtered_array = place.address_components.filter(function(address_component){
        return address_component.types.includes("country");
    }); 
    var country = filtered_array.length ? filtered_array[0].short_name : "";

    // Classify continent based on ContinentsTable array
    var locationGroup = continentsTable[country] || "Not defined";

    //Get LatLong

    var lat = place.geometry.location.lat();
    var lng = place.geometry.location.lng();
    var latLng = lat + ", " + lng;


    console.log(place);
    console.log(country);
    console.log(locationGroup);
    console.log(latLng);

    document.getElementById('departure-country').value = country; 
    document.getElementById('location-group').value = locationGroup;
    document.getElementById('latlng').value = latLng;    
    
};
