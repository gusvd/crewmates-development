
// Upload care initialize


  UPLOADCARE_PUBLIC_KEY = '4c05a24f9e4a4c3b032e';
  UPLOADCARE_TABS = 'file facebook instagram';
  UPLOADCARE_EFFECTS = 'crop';
  UPLOADCARE_IMAGE_SHRINK = '1600x1600';
  UPLOADCARE_IMAGES_ONLY = true;
  UPLOADCARE_PREVIEW_STEP = true;

  uploadcare.registerTab('preview', uploadcareTabEffects)


UPLOADCARE_LOCALE_TRANSLATIONS = {
    buttons: {
      choose: {
        files: {
          one: 'Upload image'
        }
      }
    }
  }


//////////////////////////////////////////////
// Populate Nationality dropdown
// And select the correct one during Edit Profile

document.addEventListener('DOMContentLoaded', (event) => {
  var nationalitites = [
    'Afghan',
    'Albanian',
    'Algerian',
    'American',
    'Andorran',
    'Angolan',
    'Anguillan',
    'Citizen of Antigua and Barbuda',
    'Argentine',
    'Armenian',
    'Australian',
    'Austrian',
    'Azerbaijani',
    'Bahamian',
    'Bahraini',
    'Bangladeshi',
    'Barbadian',
    'Belarusian',
    'Belgian',
    'Belizean',
    'Beninese',
    'Bermudian',
    'Bhutanese',
    'Bolivian',
    'Citizen of Bosnia and Herzegovina',
    'Botswanan',
    'Brazilian',
    'British',
    'British Virgin Islander',
    'Bruneian',
    'Bulgarian',
    'Burkinan',
    'Burmese',
    'Burundian',
    'Cambodian',
    'Cameroonian',
    'Canadian',
    'Cape Verdean',
    'Cayman Islander',
    'Central African',
    'Chadian',
    'Chilean',
    'Chinese',
    'Colombian',
    'Comoran',
    'Congolese (Congo)',
    'Congolese (DRC)',
    'Cook Islander',
    'Costa Rican',
    'Croatian',
    'Cuban',
    'Cymraes',
    'Cymro',
    'Cypriot',
    'Czech',
    'Danish',
    'Djiboutian',
    'Dominican',
    'Citizen of the Dominican Republic',
    'Dutch',
    'East Timorese',
    'Ecuadorean',
    'Egyptian',
    'Emirati',
    'English',
    'Equatorial Guinean',
    'Eritrean',
    'Estonian',
    'Ethiopian',
    'Faroese',
    'Fijian',
    'Filipino',
    'Finnish',
    'French',
    'Gabonese',
    'Gambian',
    'Georgian',
    'German',
    'Ghanaian',
    'Gibraltarian',
    'Greek',
    'Greenlandic',
    'Grenadian',
    'Guamanian',
    'Guatemalan',
    'Citizen of Guinea-Bissau',
    'Guinean',
    'Guyanese',
    'Haitian',
    'Honduran',
    'Hong Konger',
    'Hungarian',
    'Icelandic',
    'Indian',
    'Indonesian',
    'Iranian',
    'Iraqi',
    'Irish',
    'Israeli',
    'Italian',
    'Ivorian',
    'Jamaican',
    'Japanese',
    'Jordanian',
    'Kazakh',
    'Kenyan',
    'Kittitian',
    'Citizen of Kiribati',
    'Kosovan',
    'Kuwaiti',
    'Kyrgyz',
    'Lao',
    'Latvian',
    'Lebanese',
    'Liberian',
    'Libyan',
    'Liechtenstein citizen',
    'Lithuanian',
    'Luxembourger',
    'Macanese',
    'Macedonian',
    'Malagasy',
    'Malawian',
    'Malaysian',
    'Maldivian',
    'Malian',
    'Maltese',
    'Marshallese',
    'Martiniquais',
    'Mauritanian',
    'Mauritian',
    'Mexican',
    'Micronesian',
    'Moldovan',
    'Monegasque',
    'Mongolian',
    'Montenegrin',
    'Montserratian',
    'Moroccan',
    'Mosotho',
    'Mozambican',
    'Namibian',
    'Nauruan',
    'Nepalese',
    'New Zealander',
    'Nicaraguan',
    'Nigerian',
    'Nigerien',
    'Niuean',
    'North Korean',
    'Northern Irish',
    'Norwegian',
    'Omani',
    'Pakistani',
    'Palauan',
    'Palestinian',
    'Panamanian',
    'Papua New Guinean',
    'Paraguayan',
    'Peruvian',
    'Pitcairn Islander',
    'Polish',
    'Portuguese',
    'Prydeinig',
    'Puerto Rican',
    'Qatari',
    'Romanian',
    'Russian',
    'Rwandan',
    'Salvadorean',
    'Sammarinese',
    'Samoan',
    'Sao Tomean',
    'Saudi Arabian',
    'Scottish',
    'Senegalese',
    'Serbian',
    'Citizen of Seychelles',
    'Sierra Leonean',
    'Singaporean',
    'Slovak',
    'Slovenian',
    'Solomon Islander',
    'Somali',
    'South African',
    'South Korean',
    'South Sudanese',
    'Spanish',
    'Sri Lankan',
    'St Helenian',
    'St Lucian',
    'Stateless',
    'Sudanese',
    'Surinamese',
    'Swazi',
    'Swedish',
    'Swiss',
    'Syrian',
    'Taiwanese',
    'Tajik',
    'Tanzanian',
    'Thai',
    'Togolese',
    'Tongan',
    'Trinidadian',
    'Tristanian',
    'Tunisian',
    'Turkish',
    'Turkmen',
    'Turks and Caicos Islander',
    'Tuvaluan',
    'Ugandan',
    'Ukrainian',
    'Uruguayan',
    'Uzbek',
    'Vatican citizen',
    'Citizen of Vanuatu',
    'Venezuelan',
    'Vietnamese',
    'Vincentian',
    'Wallisian',
    'Welsh',
    'Yemeni',
    'Zambian',
    'Zimbabwean'
  ]

  
  window.addEventListener('DOMContentLoaded', (event) => {

  var select = document.getElementById('nationality');

  nationalitites.forEach(function(e) {
    var opt = document.createElement('option');
    opt.value = e; // .replace (/ /g, "-").toLowerCase().trim();
    opt.innerHTML = e;
    select.appendChild(opt);
  })

    MemberStack.onReady.then(function(member) {
        if (member.loggedIn) {
            userNationality = member["nationality"];
            document.getElementById("nationality").value= userNationality;
        };
    })

});

}); // end DOMContentLoaded


