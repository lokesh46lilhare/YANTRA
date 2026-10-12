const PHOTO = "https://images.unsplash.com/";
const FALLBACK = `${PHOTO}photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=75`;
const pics = [
  "photo-1581092160562-40aa08e78837", "photo-1581092921461-eab62e97a780", "photo-1621905251918-48416bd8575a",
  "photo-1504917595217-d4dc5ebe6122", "photo-1581092580497-e0d23cbdf1dc", "photo-1581092334651-ddf26d9a09d0",
  "photo-1586864387967-d02ef85d93e8", "photo-1530124566582-a618bc2615dc", "photo-1586864387967-d02ef85d93e8",
  "photo-1518770660439-4636190af475", "photo-1581092334651-ddf26d9a09d0", "photo-1558618666-fcd25c85cd64",
  "photo-1581092795360-fd1ca04f0952", "photo-1581092795360-fd1ca04f0952", "photo-1565008447742-97f6f38c985c",
  "photo-1581091226825-a6a2a5aee158", "photo-1581092918056-0c4c3acd3789", "photo-1531834685032-c34bf0d84c77"
];
const imageAt = (index, width = 800) => `${PHOTO}${pics[index % pics.length]}?auto=format&fit=crop&w=${width}&q=80`;

const workers = [
  ["Skilled Workers", "कुशल कामगार", "Trades requiring specific training and experience.", "विशेष प्रशिक्षण और अनुभव वाले ट्रेड।"],
  ["Unskilled Labour", "अकुशल श्रमिक", "General site and support work categories.", "साइट और सहयोगी काम की कैटेगरी।"],
  ["Electricians", "इलेक्ट्रीशियन", "Electrical installation, repair and maintenance.", "इलेक्ट्रिकल इंस्टॉलेशन, मरम्मत और मेंटेनेंस।"],
  ["Plumbers", "प्लंबर", "Water lines, fittings and plumbing maintenance.", "पाइपलाइन, फिटिंग और प्लंबिंग मेंटेनेंस।"],
  ["Masons", "राजमिस्त्री", "Masonry, brickwork and concrete categories.", "चिनाई, ईंट और कंक्रीट कार्य।"],
  ["Carpenters", "बढ़ई", "Woodwork, fixtures and carpentry.", "लकड़ी, फिटिंग और बढ़ई का काम।"],
  ["Welders", "वेल्डर", "Welding and fabrication work categories.", "वेल्डिंग और फैब्रिकेशन कार्य।"],
  ["Fitters", "फिटर", "Mechanical fitting and assembly work.", "मैकेनिकल फिटिंग और असेंबली का काम।"],
  ["Painters", "पेंटर", "Surface preparation and painting work.", "सतह की तैयारी और पेंटिंग का काम।"],
  ["General Helpers", "हेल्पर", "General assistance for projects and sites.", "प्रोजेक्ट और साइट के लिए सामान्य सहायता।"],
  ["Machine Operators", "मशीन ऑपरेटर", "Operation roles for site and workshop machines.", "साइट और वर्कशॉप मशीनों के संचालन की भूमिकाएँ।"],
  ["Civil Engineers", "सिविल इंजीनियर", "Planning, estimation and construction roles.", "प्लानिंग, अनुमान और निर्माण की भूमिकाएँ।"],
  ["Mechanical Engineers", "मैकेनिकल इंजीनियर", "Mechanical design, installation and maintenance.", "मैकेनिकल डिजाइन, इंस्टॉलेशन और मेंटेनेंस।"],
  ["Electrical Engineers", "इलेक्ट्रिकल इंजीनियर", "Electrical systems, design and supervision.", "इलेक्ट्रिकल सिस्टम, डिजाइन और सुपरविजन।"],
  ["AC Technicians", "एसी टेक्नीशियन", "Air-conditioning and refrigeration categories.", "एयर-कंडीशनिंग और रेफ्रिजरेशन कैटेगरी।"],
  ["Solar Technicians", "सोलर टेक्नीशियन", "Solar panel installation and service roles.", "सोलर पैनल इंस्टॉलेशन और सर्विस की भूमिकाएँ।"],
  ["Construction Supervisors", "निर्माण सुपरवाइजर", "Site coordination, safety and supervision.", "साइट समन्वय, सुरक्षा और सुपरविजन।"],
  ["Heavy Vehicle Operators", "भारी वाहन ऑपरेटर", "Heavy vehicle and equipment operation roles.", "भारी वाहन और उपकरण संचालन की भूमिकाएँ।"]
];
const services = [
  ["Civil Engineering", "सिविल इंजीनियरिंग", "Survey, planning and construction support."], ["Electrical Work", "इलेक्ट्रिकल कार्य", "Electrical installation and maintenance."],
  ["Mechanical Work", "मैकेनिकल कार्य", "Mechanical assembly, repair and fitting."], ["Plumbing", "प्लंबिंग", "Pipelines, water systems and fixtures."],
  ["Construction", "निर्माण कार्य", "Residential, commercial and site work."], ["Welding & Fabrication", "वेल्डिंग एवं फैब्रिकेशन", "Metal joining, fabrication and repair."],
  ["HVAC & Refrigeration", "एसी एवं रेफ्रिजरेशन", "Cooling system installation and service."], ["Industrial Maintenance", "औद्योगिक रखरखाव", "Equipment inspection and maintenance."],
  ["Solar Installation", "सोलर इंस्टॉलेशन", "Solar panel setup and related work."], ["Road Construction", "सड़क निर्माण", "Roadwork and infrastructure categories."],
  ["Home Repair", "घर की मरम्मत", "Common repairs and maintenance work."], ["Automobile Repair", "वाहन मरम्मत", "Vehicle inspection and repair categories."],
  ["Agricultural Engineering", "कृषि इंजीनियरिंग", "Farm equipment and irrigation work."], ["Pump & Motor Repair", "पंप एवं मोटर मरम्मत", "Pump, motor and water-system service."],
  ["Factory Installation", "फैक्ट्री इंस्टॉलेशन", "Industrial setup and installation categories."]
];
const products = [
  ["Hand Tools", "हाथ के औजार", "Everyday manual tools for workshop and site work.", "हाथ से चलने वाले वर्कशॉप और साइट औजार।", "Hand Tools"],
  ["Spanners & Wrenches", "पाना एवं रिंच", "Fastening and maintenance tool category.", "फास्टनिंग और मेंटेनेंस औजार कैटेगरी।", "Spanners"],
  ["Screwdrivers", "स्क्रूड्राइवर", "Drivers and bits for repair tasks.", "मरम्मत कार्य के लिए ड्राइवर और बिट्स।", "Screwdrivers"],
  ["Hammers", "हथौड़े", "Striking tools for fitting and construction.", "फिटिंग और निर्माण के लिए स्ट्राइकिंग औजार।", "Hammers"],
  ["Drilling Machines", "ड्रिल मशीन", "Drilling equipment for multiple materials.", "विभिन्न सामग्री के लिए ड्रिलिंग उपकरण।", "Drilling"],
  ["Cutting Machines", "कटिंग मशीन", "Cutting equipment category for workshop use.", "वर्कशॉप के लिए कटिंग उपकरण कैटेगरी।", "Cutting"],
  ["Welding Machines", "वेल्डिंग मशीन", "Welding equipment and accessories.", "वेल्डिंग उपकरण और एक्सेसरीज़।", "Welding"],
  ["Electrical Testing Instruments", "इलेक्ट्रिकल टेस्टिंग उपकरण", "Testing and measuring instruments.", "टेस्टिंग और मापने के उपकरण।", "Electrical"],
  ["Plumbing Tools", "प्लंबिंग औजार", "Tools for pipe installation and service.", "पाइप इंस्टॉलेशन और सर्विस के औजार।", "Plumbing"],
  ["Measuring Instruments", "मापने के उपकरण", "Precision measuring tool category.", "सटीक मापने के उपकरणों की कैटेगरी।", "Measuring"],
  ["Concrete Mixers", "कंक्रीट मिक्सर", "Concrete preparation equipment category.", "कंक्रीट तैयारी उपकरण कैटेगरी।", "Construction"],
  ["Water Pumps", "पानी के पंप", "Water transfer and drainage pump category.", "पानी ट्रांसफर और ड्रेनेज पंप कैटेगरी।", "Pumps"],
  ["Motors & Generators", "मोटर एवं जनरेटर", "Power equipment for multiple applications.", "कई उपयोगों के लिए पावर उपकरण।", "Electrical"],
  ["Safety Equipment", "सुरक्षा उपकरण", "Personal protective equipment category.", "व्यक्तिगत सुरक्षा उपकरण कैटेगरी।", "Safety"],
  ["Construction Equipment", "निर्माण उपकरण", "Equipment used across construction sites.", "निर्माण स्थलों पर उपयोग होने वाले उपकरण।", "Construction"],
  ["Workshop Machinery", "वर्कशॉप मशीनरी", "Workshop machinery and fabrication category.", "वर्कशॉप मशीनरी और फैब्रिकेशन कैटेगरी।", "Workshop"]
];
const workerPhotos = [
  "photo-1581092160562-40aa08e78837", "photo-1531834685032-c34bf0d84c77", "photo-1621905251918-48416bd8575a",
  "photo-1607472586893-edb57bdc0e39", "photo-1504307651254-35680f356dfd", "photo-1581092921461-eab62e97a780",
  "photo-1504917595217-d4dc5ebe6122", "photo-1581092795360-fd1ca04f0952", "photo-1581092160562-40aa08e78837",
  "photo-1518770660439-4636190af475", "photo-1581092334651-ddf26d9a09d0", "photo-1558618666-fcd25c85cd64",
  "photo-1581091226825-a6a2a5aee158", "photo-1621905251918-48416bd8575a", "photo-1581092160562-40aa08e78837",
  "photo-1509391366360-2e959784a276", "photo-1531834685032-c34bf0d84c77", "photo-1531834685032-c34bf0d84c77"
];
const servicePhotos = [
  "photo-1558618666-fcd25c85cd64", "photo-1621905251918-48416bd8575a", "photo-1581091226825-a6a2a5aee158",
  "photo-1607472586893-edb57bdc0e39", "photo-1504307651254-35680f356dfd", "photo-1504917595217-d4dc5ebe6122",
  "photo-1581092160562-40aa08e78837", "photo-1581092334651-ddf26d9a09d0", "photo-1509391366360-2e959784a276",
  "photo-1531834685032-c34bf0d84c77", "photo-1581092921461-eab62e97a780", "photo-1581092795360-fd1ca04f0952",
  "photo-1581092795360-fd1ca04f0952", "photo-1581092918056-0c4c3acd3789", "photo-1581091226825-a6a2a5aee158"
];
const toolPhotos = [
  "photo-1530124566582-a618bc2615dc", "photo-1586864387967-d02ef85d93e8", "photo-1518770660439-4636190af475",
  "photo-1586864387967-d02ef85d93e8", "photo-1581092334651-ddf26d9a09d0", "photo-1586864387967-d02ef85d93e8",
  "photo-1504917595217-d4dc5ebe6122", "photo-1581092334651-ddf26d9a09d0", "photo-1607472586893-edb57bdc0e39",
  "photo-1581092795360-fd1ca04f0952", "photo-1581092795360-fd1ca04f0952", "photo-1581092918056-0c4c3acd3789",
  "photo-1581091226825-a6a2a5aee158", "photo-1504307651254-35680f356dfd", "photo-1531834685032-c34bf0d84c77",
  "photo-1581092795360-fd1ca04f0952"
];
const machines = [
  ["JCB / Backhoe Loader", "जेसीबी / बैकहो लोडर", "Earthmoving and excavation machine category."], ["Excavator", "एक्सकेवेटर", "Excavation and site preparation equipment."],
  ["Bulldozer", "बुलडोजर", "Earthmoving and land-clearing machine category."], ["Crane", "क्रेन", "Lifting and material-handling equipment."],
  ["Road Roller", "रोड रोलर", "Road compaction machine category."], ["Concrete Mixer", "कंक्रीट मिक्सर", "Concrete mixing equipment category."],
  ["Concrete Pump", "कंक्रीट पंप", "Concrete placement equipment category."], ["Tower Crane", "टावर क्रेन", "High-rise lifting equipment category."],
  ["Forklift", "फोर्कलिफ्ट", "Warehouse and material-handling equipment."], ["Tractor", "ट्रैक्टर", "Agricultural and utility vehicle category."],
  ["Generator", "जनरेटर", "Temporary and backup power equipment."], ["Air Compressor", "एयर कंप्रेसर", "Compressed-air equipment category."],
  ["Industrial Drilling Machines", "औद्योगिक ड्रिल मशीनें", "Heavy-duty drilling equipment category."], ["Lifting Equipment", "लिफ्टिंग उपकरण", "Hoists and material-lifting equipment category."]
];
const machinePhotos = {
  "JCB / Backhoe Loader": {
    url:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/JCB_backhoe_loader%2C_Koryazhma.jpg/960px-JCB_backhoe_loader%2C_Koryazhma.jpg",
    page:"https://commons.wikimedia.org/wiki/File:JCB_backhoe_loader,_Koryazhma.jpg", credit:"Wikimedia Commons · CC0"
  },
  "Excavator": {
    url:"https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d8/Caterpillar_330_excavator_on_a_pile_of_dirt.jpg/960px-Caterpillar_330_excavator_on_a_pile_of_dirt.jpg",
    page:"https://commons.wikimedia.org/wiki/File:Caterpillar_330_excavator_on_a_pile_of_dirt.jpg", credit:"Matthew T. Rader · CC BY-SA 4.0"
  },
  "Bulldozer": {
    url:"https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b6/Bulldozer_2.jpg/960px-Bulldozer_2.jpg",
    page:"https://commons.wikimedia.org/wiki/File:Bulldozer_2.jpg", credit:"Wikideas1 · CC0"
  },
  "Crane": {
    url:"https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/1988_TIL_Coles_Hydra_Truck_830_mobile_crane.jpg/960px-1988_TIL_Coles_Hydra_Truck_830_mobile_crane.jpg",
    page:"https://commons.wikimedia.org/wiki/File:1988_TIL_Coles_Hydra_Truck_830_mobile_crane.jpg", credit:"Oleg Yunakov · CC BY-SA 4.0"
  },
  "Road Roller": {
    url:"https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Caterpillar_CB54B_roller_on_dirt_lot_in_Campbell.jpg/960px-Caterpillar_CB54B_roller_on_dirt_lot_in_Campbell.jpg",
    page:"https://commons.wikimedia.org/wiki/File:Caterpillar_CB54B_roller_on_dirt_lot_in_Campbell.jpg", credit:"Grendelkhan · CC BY-SA 4.0"
  },
  "Concrete Mixer": {
    url:"https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Mini_concrete_mixer.jpg/1280px-Mini_concrete_mixer.jpg",
    page:"https://commons.wikimedia.org/wiki/File:Mini_concrete_mixer.jpg", credit:"Al Riaz Uddin · CC BY-SA 4.0"
  },
  "Concrete Pump": {
    url:"https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b1/Concrete_pump_truck_-_Arlington%2C_MA.jpg/960px-Concrete_pump_truck_-_Arlington%2C_MA.jpg",
    page:"https://commons.wikimedia.org/wiki/File:Concrete_pump_truck_-_Arlington,_MA.jpg", credit:"Daderot · CC0"
  },
  "Tower Crane": {
    url:"https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Crane_on_Leeds_Street%2C_Liverpool.jpg/960px-Crane_on_Leeds_Street%2C_Liverpool.jpg",
    page:"https://commons.wikimedia.org/wiki/File:Crane_on_Leeds_Street,_Liverpool.jpg", credit:"Rodhullandemu · CC BY-SA 4.0"
  },
  "Tractor": {
    url:"https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/Farm_tractor_with_front_loader.jpg/960px-Farm_tractor_with_front_loader.jpg",
    page:"https://commons.wikimedia.org/wiki/File:Farm_tractor_with_front_loader.jpg", credit:"Matthew T. Rader · CC BY-SA 4.0"
  },
  "Generator": {
    url:"https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Diesel_generator_MMZ_%28Belagro-2021%29.jpg/960px-Diesel_generator_MMZ_%28Belagro-2021%29.jpg",
    page:"https://commons.wikimedia.org/wiki/File:Diesel_generator_MMZ_(Belagro-2021).jpg", credit:"Homoatrox · CC BY-SA 3.0"
  },
  "Air Compressor": {
    url:"https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/Elang_Compressors_Display.jpg/960px-Elang_Compressors_Display.jpg",
    page:"https://commons.wikimedia.org/wiki/File:Elang_Compressors_Display.jpg", credit:"Elanggroup · CC BY-SA 4.0"
  },
  "Industrial Drilling Machines": {
    url:"https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/Drilling_rig_at_a_construction_site_in_Tuntorp.jpg/960px-Drilling_rig_at_a_construction_site_in_Tuntorp.jpg",
    page:"https://commons.wikimedia.org/wiki/File:Drilling_rig_at_a_construction_site_in_Tuntorp.jpg", credit:"W.carter · CC BY 4.0"
  },
  "Lifting Equipment": {
    url:"https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/ISS_s3-s4_truss_hoist_in_the_SSPF_factory.jpg/960px-ISS_s3-s4_truss_hoist_in_the_SSPF_factory.jpg",
    page:"https://commons.wikimedia.org/wiki/File:ISS_s3-s4_truss_hoist_in_the_SSPF_factory.jpg", credit:"NASA KSC · Public domain"
  }
};

const tr = {
  hi: {
    navLabour:"मजदूरी दरें",district:"जिला",town:"शहर / कस्बा",locality:"इलाका / लोकेशन",districtCatalogNote:"डेमो कैटेगरी • जिला-वार सत्यापित लिस्टिंग अभी उपलब्ध नहीं",
    districtComingSoon:"सत्यापित स्थानीय लिस्टिंग जल्द उपलब्ध • अभी केवल डेमो कैटेगरी",
    labourKicker:"02 / DAILY LABOUR RATES",labourTitle:"एक दिन की अनुमानित मजदूरी",labourIntro:"जिला और काम चुनकर शुरुआती मजदूरी रेंज देखें और कई कामगारों का अनुमान निकालें। ये सत्यापित स्थानीय कोटेशन या लाइव उपलब्धता नहीं हैं।",calculateLabour:"मजदूरी कैलकुलेट करें",wageReferenceTitle:"न्यूनतम वेतन संदर्भ • जानकारी उपयोगकर्ता द्वारा दी गई",wageReferenceCopy:"मध्य प्रदेश संदर्भ दरें (प्रभावी 01 अक्टूबर 2026 बताई गई): अकुशल ₹484, अर्ध-कुशल ₹522, कुशल ₹588, अति-कुशल ₹651 प्रतिदिन। यहां स्वतंत्र सरकारी सत्यापन नहीं हुआ है; वास्तविक बुकिंग से पहले लागू आधिकारिक दर की पुष्टि करें।",rateDisclaimer:"अनुमानित दर • अंतिम पुष्टि आवश्यक",labourLocalHint:"सामान्य शुरुआती अनुमान • जिला-विशेष पुष्टि बाकी",labourNoResults:"इस खोज से कोई श्रेणी नहीं मिली।",calculatorKicker:"DAILY ESTIMATE",calculatorTitle:"कितने कामगार और कितने दिन?",calculatorIntro:"अनुमान = कामगार × दैनिक दर × दिन। ओवरटाइम और अतिरिक्त खर्च अलग जोड़े जाते हैं। सामग्री शामिल नहीं है।",formulaLabel:"कुल मजदूरी",formulaText:"कामगारों की संख्या × प्रतिदिन की दर × काम के दिन",estimateDisclosure:"यह केवल अनुमान है, बुकिंग/उपलब्धता की पुष्टि नहीं। अंतिम दर और शुल्क प्रदाता से तय होंगे।",bookingFormTitle:"मजदूरी का अनुमान और अनुरोध",labourCategory:"कामगार / श्रेणी *",workerCount:"कामगारों की संख्या *",workDays:"काम के दिन *",dailyHours:"रोज़ के काम के घंटे (8 से ऊपर ओवरटाइम)",dailyRate:"दैनिक दर प्रति कामगार (₹) *",toolsRequired:"औजार चाहिए (औजार शुल्क अलग जुड़ सकता है)",travelCharge:"आने-जाने का खर्च (₹)",otherCharges:"अन्य अतिरिक्त खर्च (₹)",estimatedTotal:"अनुमानित भुगतान",baseWages:"कुल मजदूरी",overtimeCharge:"ओवरटाइम",toolsCharge:"औजार",confirmPrice:"कीमत की पुष्टि हेतु अनुरोध करें",bookingLocalNote:"डेमो अनुरोध इसी ब्राउज़र में सहेजा जाएगा; कोई कामगार बुक या भुगतान नहीं होगा। वास्तविक निजी जानकारी न भरें।",adminRates:"डेमो एडमिन: जिला-वार मजदूरी दरें प्रबंधित करें",adminRateNote:"यह बिना लॉगिन वाला लोकल डेमो कंट्रोल है। दरें केवल इसी ब्राउज़र में लागू होंगी। न्यूनतम दर दिए गए संदर्भ वेतन से कम नहीं हो सकती।",minimumRate:"न्यूनतम दैनिक दर (₹)",maximumRate:"अधिकतम दैनिक दर (₹)",effectiveDate:"दर लागू होने की तारीख",lastUpdated:"अंतिम दर अपडेट",overtimeRate:"ओवरटाइम दर (₹/घंटा/कामगार)",availableCount:"उपलब्धता संकेत (कामगार)",toolsFeeAdmin:"औजार शुल्क (₹/अनुरोध)",adminExtraFee:"अन्य डिफ़ॉल्ट शुल्क (₹/अनुरोध)",saveRates:"दरें सहेजें",bookingRequests:"डेमो बुकिंग अनुरोध",
    skip:"मुख्य सामग्री पर जाएँ",brandLine:"तकनीकी संसाधनों और सहायता के लिए आपका ऑल-इन-वन नेटवर्क",navHome:"होम",navWorkers:"कामगार खोजें",navServices:"सेवाएँ",navTools:"औजार",navMachines:"मशीनरी",navRent:"किराया",navPost:"काम पोस्ट करें",registerCta:"रजिस्टर करें",loginButton:"लॉगिन",
    heroEyebrow:"काम, कौशल और मशीनरी — एक जगह",heroTitle:"आपकी इंजीनियरिंग जरूरतों का एकमात्र प्लेटफॉर्म",heroEnglish:"Your All-in-One Network for Technical Resources & Assistance",heroCopy:"कुशल और अकुशल कामगार, इंजीनियर, तकनीशियन, सेवाएँ, औजार और भारी मशीनरी — अपनी जरूरत के विकल्प एक ही जगह खोजें।",findWorkers:"कामगार खोजें",exploreTools:"औजार देखें",rentMachine:"मशीन किराए पर लें",postJob:"काम पोस्ट करें",search:"खोजें",demoNote:"डेमो प्लेटफॉर्म • यहां दिखाई गई कैटेगरी वास्तविक या सत्यापित प्रदाता नहीं हैं",trustOne:"मानव कौशल",trustTwo:"इंजीनियरिंग सेवाएँ",trustThree:"औजार एवं उपकरण",trustFour:"भारी मशीनरी",
    workersKicker:"01 / WORKFORCE",workersTitle:"सही काम के लिए सही कौशल",workersIntro:"विभिन्न ट्रेड और तकनीकी भूमिकाओं की कैटेगरी देखें। लाइव प्रोफाइल और सत्यापन इस डेमो में उपलब्ध नहीं हैं।",registerWorkerLink:"कामगार के रूप में जुड़ें",categoryDemo:"कैटेगरी डेमो • वास्तविक प्रोफाइल नहीं",noResults:"इस खोज से मेल खाती कोई कैटेगरी नहीं मिली।",viewDetails:"विवरण देखें",servicesKicker:"02 / ENGINEERING SERVICES",servicesTitle:"प्रोजेक्ट और मेंटेनेंस सेवाएँ",servicesIntro:"काम की कैटेगरी देखें और अपनी आवश्यकता साझा करें।",requestService:"सेवा का अनुरोध करें",
    toolsKicker:"03 / TOOLS & EQUIPMENT",toolsTitle:"वर्कशॉप से साइट तक के औजार",toolsIntro:"कैटेगरी ब्राउज़ करें, पसंदीदा में रखें या डेमो इन्क्वायरी कार्ट में जोड़ें।",viewCart:"इन्क्वायरी कार्ट",category:"कैटेगरी",allCategories:"सभी कैटेगरी",quoteNote:"डेमो कैटलॉग • कीमत के लिए पूछताछ करें",quote:"कीमत पूछें",addCart:"कार्ट में जोड़ें",favorite:"पसंदीदा",machinesKicker:"04 / HEAVY MACHINERY",machinesTitle:"बड़े काम के लिए भारी मशीनें",machinesIntro:"मशीन कैटेगरी देखें; उपलब्धता और दरें सप्लायर से पुष्टि के बाद ही तय होंगी।",rentalOptions:"किराये के विकल्प",viewMachine:"मशीन देखें",rentNow:"किराया पूछें",demoMachine:"डेमो कैटेगरी • सप्लायर उपलब्धता की पुष्टि करेगा",
    rentKicker:"05 / MACHINERY RENTAL",rentTitle:"मशीन किराये की जरूरत साझा करें",rentIntro:"अपना शहर, मशीन का प्रकार और अवधि बताएं। यह डेमो अनुरोध केवल इसी ब्राउज़र में सहेजा जाएगा; कोई बुकिंग या उपलब्धता पक्की नहीं होती।",locationFilter:"लोकेशन के आधार पर",durationFilter:"अवधि के आधार पर",budgetFilter:"बजट के आधार पर",rentalFormTitle:"किराया अनुरोध",machineType:"मशीन का प्रकार *",chooseOption:"चुनें",city:"शहर *",rentalPeriod:"किराये की अवधि *",hourly:"प्रति घंटा",daily:"प्रति दिन",weekly:"एक सप्ताह या अधिक",budget:"अनुमानित बजट (₹)",phone:"मोबाइल नंबर *",phoneOptional:"मोबाइल नंबर",sendRequest:"अनुरोध भेजें",localDemo:"डेमो: जानकारी आपके ब्राउज़र में ही रहेगी। असली निजी जानकारी न भरें।",
    postKicker:"06 / POST A REQUIREMENT",postTitle:"अपने काम की जरूरत बताएं",postIntro:"ठेकेदार और ग्राहक काम की जानकारी दर्ज कर सकते हैं। सबमिशन केवल लोकल डेमो रिकॉर्ड है; किसी कामगार को असाइन नहीं किया जाता।",jobPointOne:"काम और कौशल का प्रकार",jobPointTwo:"स्थान, अवधि और लोगों की संख्या",jobPointThree:"बजट, तारीख और मशीनरी की जरूरत",jobFormTitle:"काम की जानकारी",requiredNote:"* जरूरी",fullName:"पूरा नाम *",cityArea:"शहर और स्थान *",workType:"काम का प्रकार *",workersNeeded:"कितने लोग चाहिए?",workerType:"कौशल स्तर",skilled:"कुशल",unskilled:"अकुशल / हेल्पर",both:"दोनों",duration:"अवधि (दिन)",startDate:"शुरू करने की तारीख",equipmentNeed:"औजार / मशीनरी",description:"काम का पूरा विवरण *",postRequirement:"जरूरत पोस्ट करें",
    joinKicker:"07 / JOIN YANTRA",joinTitle:"कामगार और सप्लायर के लिए रजिस्ट्रेशन",joinIntro:"प्रोफाइल विवरण डेमो के तौर पर इसी डिवाइस पर सहेजे जाते हैं। कोई सार्वजनिक लिस्टिंग या असली अकाउंट नहीं बनता।",workerRegTitle:"कामगार / तकनीशियन प्रोफाइल",trade:"काम / ट्रेड *",experience:"अनुभव (वर्ष)",charge:"दैनिक मजदूरी / फीस (₹)",availability:"उपलब्धता",availableNow:"अभी उपलब्ध",availableSoon:"बाद में उपलब्ध",profilePhoto:"प्रोफाइल फोटो (वैकल्पिक)",workDescription:"काम का विवरण",registerWorker:"कामगार रजिस्टर करें",supplierRegTitle:"सप्लायर / व्यवसाय रजिस्ट्रेशन",businessName:"व्यवसाय का नाम *",contactPerson:"संपर्क व्यक्ति *",supplierCategories:"उत्पाद / मशीनरी कैटेगरी *",businessDescription:"व्यवसाय का विवरण",registerSupplier:"सप्लायर रजिस्टर करें",
    aboutKicker:"08 / ABOUT YANTRA",aboutTitle:"इंजीनियरिंग की दुनिया को जोड़ने वाला प्लेटफॉर्म",aboutCopyOne:"YANTRA का उद्देश्य इंजीनियरिंग, निर्माण, उद्योग और दैनिक जीवन से जुड़े कामों के लिए कामगारों, इंजीनियरों, तकनीशियनों, सेवाओं, औजारों और मशीनरी की जानकारी एक जगह उपलब्ध कराना है।",aboutCopyTwo:"हमारा लक्ष्य है कि सही काम के लिए सही व्यक्ति, सही उपकरण और उपयुक्त मशीनरी ढूंढना आसान हो। यह वेबसाइट अभी एक डेमो है; यहां कोई प्रदाता सत्यापित या बुकिंग की गारंटी नहीं है।",hindiTagline:"हर इंजीनियरिंग काम के लिए लोग, औजार और मशीनें।",aboutImageCaption:"ENGINEERING • WORKFORCE • EQUIPMENT",contactKicker:"09 / CONTACT",contactTitle:"संपर्क करें",contactIntro:"डेमो से जुड़ा सवाल या सुझाव भेजें। इस फॉर्म का कोई संदेश सर्वर पर नहीं भेजा जाता।",addressPlaceholder:"व्यावसायिक पता: जल्द जोड़ा जाएगा",contactEmail:"ईमेल: डेमो — अभी कॉन्फ़िगर नहीं",contactPhone:"फोन: डेमो — अभी कॉन्फ़िगर नहीं",contactFormTitle:"हमें संदेश भेजें",email:"ईमेल",subject:"विषय *",message:"संदेश *",sendMessage:"संदेश भेजें",quickLinks:"त्वरित लिंक",forBusiness:"कामगार और व्यवसाय",footerContact:"संपर्क एवं जानकारी",privacyDemo:"प्राइवेसी: डेमो डेटा केवल इस ब्राउज़र में",footerDemo:"डेमो मार्केटप्लेस • वास्तविक बुकिंग या भुगतान सक्रिय नहीं",
    demoCart:"DEMO CART",cartTitle:"इन्क्वायरी कार्ट",cartDisclosure:"यह केवल लोकल डेमो कार्ट है। भुगतान या ऑर्डर सबमिट नहीं होता।",demoCheckout:"डेमो पूछताछ करें",remove:"हटाएँ",cartEmpty:"आपका डेमो कार्ट खाली है।",checkoutDone:"डेमो पूछताछ तैयार है। कोई ऑर्डर या भुगतान नहीं भेजा गया।",demoLogin:"DEMO LOGIN",loginTitle:"लॉगिन सुविधा अभी डेमो में उपलब्ध नहीं",loginCopy:"अभी कोई असली अकाउंट या प्रमाणीकरण नहीं है। प्रोफाइल फॉर्म केवल इस ब्राउज़र में डेमो डेटा सहेजते हैं।",detailDemo:"यह एक डेमो कैटेगरी है। अभी कोई सत्यापित प्रदाता, वास्तविक कीमत या उपलब्धता सूचीबद्ध नहीं है। अनुरोध केवल आपके ब्राउज़र में सहेजा जाएगा।",languageChanged:"भाषा बदल दी गई।",added:"डेमो आइटम इन्क्वायरी कार्ट में जोड़ा गया।",removed:"कार्ट से हटाया गया।",favoriteAdded:"पसंदीदा में जोड़ा गया।",favoriteRemoved:"पसंदीदा से हटाया गया।",favoriteTitle:"पसंदीदा कैटेगरी",favoriteEmpty:"अभी कोई पसंदीदा नहीं है।",searchNoMatch:"कोई मेल नहीं मिला। कैटेगरी के नाम से खोजें।",rentSelected:"चुनी गई मशीन: ",formSuccess:"डेमो अनुरोध सहेज दिया गया। कोई वास्तविक बुकिंग या संदेश नहीं भेजा गया।",cartTitleShort:"इन्क्वायरी कार्ट",loginPrompt:"लॉगिन इस डेमो में सक्रिय नहीं है।"
  },
  en: {
    navLabour:"Labour Rates",district:"District",town:"Town / city",locality:"Locality / area",districtCatalogNote:"Demo categories • no verified district listings yet",
    districtComingSoon:"Verified local listings coming soon • demo categories only",
    labourKicker:"02 / DAILY LABOUR RATES",labourTitle:"Estimated daily labour rates",labourIntro:"Choose a district and trade to view indicative ranges and estimate a crew. These are not verified local quotes or live availability.",calculateLabour:"Calculate labour cost",wageReferenceTitle:"Minimum-wage reference • supplied by the user",wageReferenceCopy:"Madhya Pradesh reference rates (stated as effective 1 Oct 2026): Unskilled ₹484, Semi-skilled ₹522, Skilled ₹588, Highly skilled ₹651 per day. Not independently verified against an official notice; confirm applicable statutory rates before booking.",rateDisclaimer:"Indicative rate • final confirmation required",labourLocalHint:"General starting estimate • district rates unconfirmed",labourNoResults:"No trade categories match this search.",calculatorKicker:"DAILY ESTIMATE",calculatorTitle:"How many workers and days?",calculatorIntro:"Estimate = workers × daily rate × days. Overtime and selected extras are added separately. Materials are excluded.",formulaLabel:"Total wages",formulaText:"Number of workers × daily rate × working days",estimateDisclosure:"Estimate only; booking and availability are not confirmed. Final rates and charges must be agreed with the provider.",bookingFormTitle:"Labour estimate and request",labourCategory:"Worker / trade *",workerCount:"Number of workers *",workDays:"Working days *",dailyHours:"Working hours per day (overtime after 8)",dailyRate:"Daily rate per worker (INR) *",toolsRequired:"Tools required (a separate fee may apply)",travelCharge:"Travel charge (INR)",otherCharges:"Other additional charges (INR)",estimatedTotal:"Estimated total",baseWages:"Total wages",overtimeCharge:"Overtime",toolsCharge:"Tools",confirmPrice:"Request price confirmation",bookingLocalNote:"Demo request stays in this browser; no worker is booked and no payment is made. Do not enter real personal data.",adminRates:"Demo admin: manage district labour rates",adminRateNote:"Local demo controls with no login. Rates apply only in this browser. Minimums cannot be below the supplied wage reference.",minimumRate:"Minimum daily rate (INR)",maximumRate:"Maximum daily rate (INR)",effectiveDate:"Rate effective date",lastUpdated:"Last rate update",overtimeRate:"Overtime rate (INR/hour/worker)",availableCount:"Availability indicator (workers)",toolsFeeAdmin:"Tools fee (INR/request)",adminExtraFee:"Default extra charge (INR/request)",saveRates:"Save rates",bookingRequests:"Demo booking requests",
    skip:"Skip to main content",brandLine:"Your All-in-One Network for Technical Resources & Assistance",navHome:"Home",navWorkers:"Find Workers",navServices:"Services",navTools:"Tools",navMachines:"Machinery",navRent:"Rental",navPost:"Post a Requirement",registerCta:"Register",loginButton:"Login",
    heroEyebrow:"People, skills and machinery — in one place",heroTitle:"Your complete platform for engineering needs",heroEnglish:"Your All-in-One Network for Technical Resources & Assistance",heroCopy:"Explore skilled and unskilled workers, engineers, technicians, services, tools and heavy machinery in one place.",findWorkers:"Find Workers",exploreTools:"Explore Tools",rentMachine:"Rent Machinery",postJob:"Post a Requirement",search:"Search",demoNote:"Demo platform • Categories shown here are not real or verified providers",trustOne:"Engineering Workforce",trustTwo:"Engineering Services",trustThree:"Tools & Equipment",trustFour:"Heavy Machinery",
    workersKicker:"01 / WORKFORCE",workersTitle:"The right skills for the job",workersIntro:"Explore trade and technical role categories. Live profiles and verification are not available in this demo.",registerWorkerLink:"Join as a worker",categoryDemo:"Demo categories • no real profiles",noResults:"No categories match this search.",viewDetails:"View details",servicesKicker:"02 / ENGINEERING SERVICES",servicesTitle:"Project and maintenance services",servicesIntro:"Explore work categories and share a requirement.",requestService:"Request a service",
    toolsKicker:"03 / TOOLS & EQUIPMENT",toolsTitle:"Tools for the workshop and the jobsite",toolsIntro:"Browse categories, save favorites or add demo enquiries to your cart.",viewCart:"Enquiry cart",category:"Category",allCategories:"All categories",quoteNote:"Demo catalog • request pricing",quote:"Request price",addCart:"Add to cart",favorite:"Favorite",machinesKicker:"04 / HEAVY MACHINERY",machinesTitle:"Heavy machinery for bigger jobs",machinesIntro:"Explore machine categories; availability and rates require supplier confirmation.",rentalOptions:"Rental options",viewMachine:"View machine",rentNow:"Ask about rental",demoMachine:"Demo category • supplier must confirm availability",
    rentKicker:"05 / MACHINERY RENTAL",rentTitle:"Share your machinery rental needs",rentIntro:"Tell us your city, machine type and duration. This demo request is stored in this browser only; no booking or availability is confirmed.",locationFilter:"Filter by location",durationFilter:"Filter by duration",budgetFilter:"Filter by budget",rentalFormTitle:"Rental request",machineType:"Machine type *",chooseOption:"Choose",city:"City *",rentalPeriod:"Rental period *",hourly:"Per hour",daily:"Per day",weekly:"One week or more",budget:"Estimated budget (INR)",phone:"Phone number *",phoneOptional:"Phone number",sendRequest:"Send request",localDemo:"Demo: details stay in this browser only. Do not enter real personal data.",
    postKicker:"06 / POST A REQUIREMENT",postTitle:"Tell us what your project needs",postIntro:"Contractors and customers can enter project details. Submissions are local demo records; no worker is assigned.",jobPointOne:"Work and skill type",jobPointTwo:"Location, duration and team size",jobPointThree:"Budget, date and equipment needs",jobFormTitle:"Project details",requiredNote:"* Required",fullName:"Full name *",cityArea:"City and area *",workType:"Type of work *",workersNeeded:"Number of workers",workerType:"Skill level",skilled:"Skilled",unskilled:"Unskilled / helper",both:"Both",duration:"Duration (days)",startDate:"Start date",equipmentNeed:"Tools / machinery",description:"Project description *",postRequirement:"Post requirement",
    joinKicker:"07 / JOIN YANTRA",joinTitle:"Worker and supplier registration",joinIntro:"Profile details are stored on this device as demo data. No public listing or real account is created.",workerRegTitle:"Worker / technician profile",trade:"Trade / work *",experience:"Experience (years)",charge:"Daily wage / service fee (INR)",availability:"Availability",availableNow:"Available now",availableSoon:"Available later",profilePhoto:"Profile photo (optional)",workDescription:"Work description",registerWorker:"Register as a worker",supplierRegTitle:"Supplier / business registration",businessName:"Business name *",contactPerson:"Contact person *",supplierCategories:"Product / machinery categories *",businessDescription:"Business description",registerSupplier:"Register as a supplier",
    aboutKicker:"08 / ABOUT YANTRA",aboutTitle:"Connecting the engineering world",aboutCopyOne:"YANTRA aims to bring information about workers, engineers, technicians, services, tools and machinery for engineering, construction, industry and everyday needs into one place.",aboutCopyTwo:"Our goal is to make it easier to find the right person, equipment and machinery for the job. This is currently a demo website; no provider is verified and no booking is guaranteed.",hindiTagline:"People, tools and machines for every engineering job.",aboutImageCaption:"ENGINEERING • WORKFORCE • EQUIPMENT",contactKicker:"09 / CONTACT",contactTitle:"Contact us",contactIntro:"Send a question or suggestion about the demo. Messages from this form are not sent to a server.",addressPlaceholder:"Business address: to be added",contactEmail:"Email: demo — not configured",contactPhone:"Phone: demo — not configured",contactFormTitle:"Send us a message",email:"Email",subject:"Subject *",message:"Message *",sendMessage:"Send message",quickLinks:"Quick links",forBusiness:"Workers & businesses",footerContact:"Contact & information",privacyDemo:"Privacy: demo data stays in this browser",footerDemo:"Demo marketplace • no real booking or payment is active",
    demoCart:"DEMO CART",cartTitle:"Enquiry cart",cartDisclosure:"This is a local demo cart only. No payment or order is submitted.",demoCheckout:"Continue demo enquiry",remove:"Remove",cartEmpty:"Your demo cart is empty.",checkoutDone:"Demo enquiry prepared. No order or payment was sent.",demoLogin:"DEMO LOGIN",loginTitle:"Login is not available in this demo",loginCopy:"There are no real accounts or authentication yet. Profile forms save demo data only in this browser.",detailDemo:"This is a demo category. No verified provider, real price or availability is listed. Requests are stored in this browser only.",languageChanged:"Language changed.",added:"Demo item added to the enquiry cart.",removed:"Removed from cart.",favoriteAdded:"Added to favorites.",favoriteRemoved:"Removed from favorites.",favoriteTitle:"Favorite categories",favoriteEmpty:"You have no favorites yet.",searchNoMatch:"No matches found. Try a category name.",rentSelected:"Selected machine: ",formSuccess:"Demo request saved. No real booking or message was sent.",cartTitleShort:"Enquiry cart",loginPrompt:"Login is not active in this demo."
  }
};

Object.assign(tr.hi, {
  navMonthly:"मासिक घरेलू सेवाएँ",monthlyKicker:"03 / MONTHLY HOME SERVICES",monthlyTitle:"कम बजट का मासिक घरेलू सेवा चार्ट",
  monthlyIntro:"खाना बनाना, सफाई, कपड़े और देखभाल के लिए दिए गए मासिक अनुमान देखें। कीमतें अवधि, घंटे और शहर के अनुसार बदल सकती हैं।",
  monthlyRequest:"सेवा का अनुरोध करें",monthlyEstimate:"उपयोगकर्ता द्वारा दिए गए संकेतात्मक मासिक रेट • स्थानीय पुष्टि आवश्यक",
  monthlyCompliance:"ये कानूनी न्यूनतम वेतन की पुष्टि या उपलब्ध सेवा की गारंटी नहीं हैं। काम के घंटे और लागू नियम जाँचें।",
  monthlyCoverage:"जिला-वार स्थानीय प्रदाता सत्यापित नहीं • सेवा जल्द उपलब्ध",monthlyNoResults:"इस खोज से कोई सेवा नहीं मिली।",
  labourKicker:"02 / ALL 55 DISTRICTS",
  districtMarketTitle:"मध्य प्रदेश के सभी जिलों में YANTRA",
  districtMarketIntro:"मजदूर, इंजीनियरिंग सेवाएँ, औजार और किराए का सामान — आपके जिले में। One Platform. All 55 Districts. Every Engineering Need.",
  servicesKicker:"04 / ENGINEERING SERVICES",toolsKicker:"05 / TOOLS & EQUIPMENT",machinesKicker:"06 / HEAVY MACHINERY",
  rentKicker:"07 / MACHINERY RENTAL",rentIntro:"अपना जिला, शहर, मशीन का प्रकार और अवधि बताएं। यह डेमो अनुरोध केवल इसी ब्राउज़र में सहेजा जाएगा; कोई बुकिंग या उपलब्धता पक्की नहीं होती।",
  postKicker:"08 / POST A REQUIREMENT",joinKicker:"09 / JOIN YANTRA",aboutKicker:"10 / ABOUT YANTRA",contactKicker:"11 / CONTACT"
});
Object.assign(tr.en, {
  navMonthly:"Monthly home services",monthlyKicker:"03 / MONTHLY HOME SERVICES",monthlyTitle:"Low Budget Monthly Home Service Chart",
  monthlyIntro:"See the supplied monthly estimates for cooking, cleaning, laundry and care. Prices may vary by schedule, hours and city.",
  monthlyRequest:"Request a service",monthlyEstimate:"User-supplied indicative monthly prices • local confirmation required",
  monthlyCompliance:"These do not verify legal minimum wages or guarantee availability. Confirm working hours and applicable rules.",
  monthlyCoverage:"No district provider verified • service coming soon",monthlyNoResults:"No services match this search.",
  labourKicker:"02 / ALL 55 DISTRICTS",
  districtMarketTitle:"YANTRA across all Madhya Pradesh districts",
  districtMarketIntro:"Workers, engineering services, tools and rentals — in your district. One Platform. All 55 Districts. Every Engineering Need.",
  servicesKicker:"04 / ENGINEERING SERVICES",toolsKicker:"05 / TOOLS & EQUIPMENT",machinesKicker:"06 / HEAVY MACHINERY",
  rentKicker:"07 / MACHINERY RENTAL",rentIntro:"Choose your district, town, machine type and duration. This demo request is stored in this browser only; no booking or availability is confirmed.",
  postKicker:"08 / POST A REQUIREMENT",joinKicker:"09 / JOIN YANTRA",aboutKicker:"10 / ABOUT YANTRA",contactKicker:"11 / CONTACT"
});

let language = "hi";
let toastTimer;
const memoryStore = new Map();
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const t = (key) => tr[language][key] || key;
const safe = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#39;" }[char]));
function readStore(key, fallback = []) { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return memoryStore.get(key) || fallback; } }
function saveStore(key, value) { memoryStore.set(key, value); try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* The in-memory demo fallback remains available. */ } }
function toast(message) { const node = $("#toast"); node.textContent = message; node.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => node.classList.remove("show"), 3200); }
function applyIcons() { window.lucide?.createIcons?.(); }

function applyLanguage() {
  document.documentElement.lang = language;
  document.body.classList.toggle("lang-hi", language === "hi");
  $$('[data-i18n]').forEach((node) => { const value = tr[language][node.dataset.i18n]; if (value) node.textContent = value; });
  $$('[data-placeholder-hi]').forEach((node) => { node.placeholder = node.dataset[language === "hi" ? "placeholderHi" : "placeholderEn"] || ""; });
  $("#language-switch").textContent = language === "hi" ? "EN" : "हि";
  $("#language-switch").setAttribute("aria-label", language === "hi" ? "Switch to English" : "हिंदी में बदलें");
  window.YantraDistricts?.apply(language);
  renderAll();
  document.dispatchEvent(new CustomEvent("yantra-language-change", { detail: { language } }));
}

function renderCard(item, kind, index) {
  const name = language === "hi" ? item[1] : item[0];
  const description = kind === "worker" || kind === "product" ? (language === "hi" ? item[3] : item[2]) : kind === "service" ? (language === "hi" ? "इस सेवा की डेमो कैटेगरी देखें।" : item[2]) : t("demoMachine");
  const category = kind === "worker" ? (language === "hi" ? "कामगार कैटेगरी" : "WORKER CATEGORY") : kind === "service" ? (language === "hi" ? "इंजीनियरिंग सेवा" : "ENGINEERING SERVICE") : kind === "product" ? (language === "hi" ? "उपकरण कैटेगरी" : "EQUIPMENT CATEGORY") : (language === "hi" ? "डेमो मशीनरी" : "DEMO MACHINERY");
  const imageIndex = kind === "worker" ? index : kind === "service" ? index + 3 : kind === "product" ? index + 5 : index + 8;
  const id = `${kind}-${index}`;
  const isProduct = kind === "product";
  const isMachine = kind === "machine";
  const favorites = readStore("yantra-favorites");
  const active = favorites.includes(id);
  const nameEn = safe(item[0]);
  const nameHi = safe(item[1]);
  let actions;
  if (isProduct) actions = `<button class="button button-orange add-cart" type="button" data-id="${id}" data-name-en="${nameEn}" data-name-hi="${nameHi}"><i data-lucide="shopping-bag"></i>${t("addCart")}</button>`;
  else if (isMachine) actions = `<button class="mini-button machine-detail" type="button" data-name-en="${nameEn}" data-name-hi="${nameHi}"><i data-lucide="scan-eye"></i>${t("viewMachine")}</button><button class="button button-orange rent-machine" type="button" data-name-en="${nameEn}" data-name-hi="${nameHi}">${t("rentNow")}</button>`;
  else actions = `<button class="mini-button detail-trigger" type="button" data-name-en="${nameEn}" data-name-hi="${nameHi}"><i data-lucide="arrow-up-right"></i>${t("viewDetails")}</button>`;
  const machinePhoto = isMachine ? machinePhotos[item[0]] : null;
  const fallbackImage = imageAt(imageIndex, isProduct || isMachine ? 780 : 650);
  const catalogPhoto = kind === "worker" ? workerPhotos[index]
    : kind === "service" ? servicePhotos[index]
      : kind === "product" ? toolPhotos[index]
        : null;
  const imageUrl = machinePhoto?.url || (catalogPhoto ? `${PHOTO}${catalogPhoto}?auto=format&fit=crop&w=${isProduct ? 780 : 720}&q=82` : fallbackImage);
  const imageFallback = machinePhoto ? fallbackImage : FALLBACK;
  const imageCredit = machinePhoto
    ? `<a class="image-credit" href="${machinePhoto.page}" target="_blank" rel="noreferrer">Photo: ${safe(machinePhoto.credit)}</a>`
    : "";
  return `<article class="catalog-card" data-name="${safe(`${item[0]} ${item[1]}`.toLocaleLowerCase())}" data-kind="${kind}">
    <div class="catalog-media"><img src="${imageUrl}" data-fallback="${imageFallback}" alt="${safe(name)} — ${safe(category)}" loading="lazy"></div>
    <div class="catalog-body"><p class="catalog-type">${safe(category)}</p><h3>${safe(name)}</h3><p>${safe(description)}</p>${imageCredit}<div class="card-actions">${actions}<button class="mini-button favorite-button ${active ? "active" : ""}" type="button" data-id="${id}" aria-label="${t("favorite")}: ${safe(name)}"><i data-lucide="heart"></i></button></div></div>
  </article>`;
}

function fillGrid(selector, items, kind) { $(selector).innerHTML = items.map((item, index) => renderCard(item, kind, index)).join(""); }
function renderAll() {
  fillGrid("#worker-grid", workers, "worker"); fillGrid("#service-grid", services, "service"); fillGrid("#product-grid", products, "product"); fillGrid("#machinery-grid", machines, "machine");
  const categories = [...new Set(products.map((item) => item[4]))];
  const categorySelect = $("#product-category"); const oldCategory = categorySelect.value || "all";
  categorySelect.innerHTML = `<option value="all">${t("allCategories")}</option>${categories.map((category) => `<option value="${safe(category)}">${safe(category)}</option>`).join("")}`;
  categorySelect.value = categories.includes(oldCategory) ? oldCategory : "all";
  const machineSelect = $("#rental-machine"); const oldMachine = machineSelect.value;
  machineSelect.innerHTML = `<option value="">${t("chooseOption")}</option>${machines.map((item) => `<option value="${safe(item[0])}">${safe(language === "hi" ? item[1] : item[0])}</option>`).join("")}`;
  if (oldMachine) machineSelect.value = oldMachine;
  applyIcons(); updateCounts(); renderCart(); filterProducts(); filterWorkers();
}

function filterWorkers() {
  const query = $("#worker-search").value.trim().toLocaleLowerCase();
  let visible = 0;
  $$("#worker-grid .catalog-card").forEach((card) => { const show = !query || card.dataset.name.includes(query); card.classList.toggle("hidden", !show); if (show) visible++; });
  $("#worker-empty").classList.toggle("hidden", visible > 0);
  const city = $("#worker-city");
  if (city.value) city.title = language === "hi" ? "डेमो कैटेगरी में वास्तविक शहर-आधारित प्रोफाइल उपलब्ध नहीं हैं।" : "Demo categories do not include real city-based provider profiles.";
}
function filterProducts() {
  const query = $("#product-search").value.trim().toLocaleLowerCase(); const category = $("#product-category").value;
  $$("#product-grid .catalog-card").forEach((card, index) => { const item = products[index]; const matchesText = !query || card.dataset.name.includes(query) || item[2].toLocaleLowerCase().includes(query) || item[3].toLocaleLowerCase().includes(query); const matchesCategory = category === "all" || item[4] === category; card.classList.toggle("hidden", !(matchesText && matchesCategory)); });
}
function updateCounts() {
  const cart = readStore("yantra-cart"); const favorites = readStore("yantra-favorites"); const count = cart.reduce((sum, item) => sum + item.qty, 0);
  $("#cart-count").textContent = count; $("#tools-cart-count").textContent = `(${count})`; $("#favorite-count").textContent = favorites.length;
}
function renderCart() {
  const items = readStore("yantra-cart");
  $("#cart-items").innerHTML = items.length ? items.map((item) => `<div class="drawer-item"><span>${safe(language === "hi" ? item.hi : item.en)}<small>${language === "hi" ? "मात्रा" : "Quantity"}: ${item.qty} • ${language === "hi" ? "डेमो कीमत उपलब्ध नहीं" : "Demo price unavailable"}</small></span><button class="drawer-remove" type="button" data-remove="${safe(item.id)}">${t("remove")}</button></div>`).join("") : `<p class="empty-state">${t("cartEmpty")}</p>`;
}
function showDrawer() { $("#drawer-backdrop").classList.remove("hidden"); $("#cart-drawer").classList.add("open"); $("#cart-drawer").setAttribute("aria-hidden", "false"); renderCart(); }
function hideDrawer() { $("#drawer-backdrop").classList.add("hidden"); $("#cart-drawer").classList.remove("open"); $("#cart-drawer").setAttribute("aria-hidden", "true"); }
function openDetail(name) { $("#dialog-content").innerHTML = `<p class="section-kicker">YANTRA / DEMO LISTING</p><h2>${safe(name)}</h2><p>${t("detailDemo")}</p><a class="button button-orange" href="#post-job">${t("postJob")}</a>`; $("#detail-dialog").showModal(); applyIcons(); }
function saveDemoForm(form, kind) {
  const entries = readStore(`yantra-${kind}`); const data = Object.fromEntries(new FormData(form).entries()); delete data.photo;
  entries.push({ ...data, createdAt: new Date().toISOString(), demo: true }); saveStore(`yantra-${kind}`, entries); form.reset(); toast(t("formSuccess"));
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button,a"); if (!target) return;
  if (target.closest("#main-nav a")) { $("#main-nav").classList.remove("open"); $("#menu-toggle").setAttribute("aria-expanded", "false"); }
  if (target.id === "menu-toggle") { const nav = $("#main-nav"); nav.classList.toggle("open"); target.setAttribute("aria-expanded", String(nav.classList.contains("open"))); }
  if (target.id === "language-switch") { language = language === "hi" ? "en" : "hi"; try { localStorage.setItem("yantra-language", language); } catch {} applyLanguage(); toast(t("languageChanged")); }
  if (target.id === "cart-open" || target.id === "tools-cart-link") showDrawer();
  if (target.id === "login-open") $("#login-dialog").showModal();
  if (target.id === "favorites-open") {
    const favorites = readStore("yantra-favorites");
    if (!favorites.length) { toast(t("favoriteEmpty")); return; }
    const catalogs = { worker:workers, service:services, product:products, machine:machines };
    const names = favorites.map((id) => { const [kind,index] = id.split("-"); return catalogs[kind]?.[Number(index)]?.[language === "hi" ? 1 : 0]; }).filter(Boolean);
    $("#dialog-content").innerHTML = `<p class="section-kicker">YANTRA</p><h2>${t("favoriteTitle")}</h2><p>${names.map(safe).join(" · ")}</p>`; $("#detail-dialog").showModal();
  }
  if (target.classList.contains("drawer-close")) hideDrawer();
  if (target.classList.contains("add-cart")) {
    const cart = readStore("yantra-cart"); const item = cart.find((entry) => entry.id === target.dataset.id);
    if (item) item.qty++; else cart.push({ id:target.dataset.id,en:target.dataset.nameEn,hi:target.dataset.nameHi,qty:1 });
    saveStore("yantra-cart",cart); updateCounts(); renderCart(); toast(t("added"));
  }
  if (target.classList.contains("favorite-button")) {
    let favorites = readStore("yantra-favorites"); const exists = favorites.includes(target.dataset.id);
    favorites = exists ? favorites.filter((id) => id !== target.dataset.id) : [...favorites,target.dataset.id]; saveStore("yantra-favorites",favorites); target.classList.toggle("active",!exists); updateCounts(); toast(t(exists ? "favoriteRemoved" : "favoriteAdded"));
  }
  if (target.classList.contains("detail-trigger") || target.classList.contains("machine-detail")) openDetail(target.dataset[language === "hi" ? "nameHi" : "nameEn"]);
  if (target.classList.contains("rent-machine")) { $("#rental-machine").value = target.dataset.nameEn; $("#rent").scrollIntoView({behavior:"smooth"}); toast(`${t("rentSelected")}${target.dataset[language === "hi" ? "nameHi" : "nameEn"]}`); }
  if (target.dataset.remove) { saveStore("yantra-cart",readStore("yantra-cart").filter((item) => item.id !== target.dataset.remove)); updateCounts(); renderCart(); toast(t("removed")); }
  if (target.id === "demo-checkout") { if (!readStore("yantra-cart").length) toast(t("cartEmpty")); else { toast(t("checkoutDone")); hideDrawer(); } }
  if (target.classList.contains("dialog-close")) target.closest("dialog").close();
});

$("#hero-search").addEventListener("submit", (event) => {
  event.preventDefault(); const query = $("#global-search").value.trim().toLocaleLowerCase();
  const pools = [["#workers",workers], ["#services",services], ["#tools",products], ["#machinery",machines]];
  const match = pools.find(([,items]) => !query || items.some((item) => item.slice(0,4).join(" ").toLocaleLowerCase().includes(query)));
  if (!match) { toast(t("searchNoMatch")); return; }
  const [section] = match; document.querySelector(section).scrollIntoView({behavior:"smooth"});
  const filter = section === "#workers" ? $("#worker-search") : section === "#tools" ? $("#product-search") : null;
  if (filter) { filter.value = $("#global-search").value; filter.dispatchEvent(new Event("input")); }
  if (section === "#workers" && $("#global-location").value) { $("#worker-city").value = $("#global-location").value; filterWorkers(); }
});
$("#worker-search").addEventListener("input",filterWorkers);
$("#worker-city").addEventListener("input",filterWorkers);
$("#product-search").addEventListener("input",filterProducts);
$("#product-category").addEventListener("change",filterProducts);
$("#drawer-backdrop").addEventListener("click",hideDrawer);
[["#rental-form","rental-requests"],["#job-form","job-requests"],["#worker-registration","worker-profiles"],["#supplier-registration","supplier-profiles"],["#contact-form","contact-messages"]].forEach(([selector,kind]) => {
  $(selector).addEventListener("submit",(event) => { event.preventDefault(); if (event.currentTarget.reportValidity()) saveDemoForm(event.currentTarget,kind); });
});
document.addEventListener("error",(event) => {
  const image = event.target;
  if (image instanceof HTMLImageElement && image.dataset.fallback && image.src !== image.dataset.fallback) image.src = image.dataset.fallback;
},true);

$("#year").textContent = new Date().getFullYear();
try { language = localStorage.getItem("yantra-language") || "hi"; } catch { language = "hi"; }
applyLanguage();